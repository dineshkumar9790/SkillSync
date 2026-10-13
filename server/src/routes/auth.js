import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const safeUser = (u) => ({ id: u._id, name: u.name, email: u.email, headline: u.headline, skills: u.skills, college: u.college });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8)
      return res.status(400).json({ message: "Name, email and a password of at least 8 characters are required." });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "An account with this email already exists." });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash });
    res.status(201).json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (e) { res.status(500).json({ message: "Could not create account." }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password || "", user.password)))
      return res.status(401).json({ message: "Email or password is incorrect." });
    res.json({ token: makeToken(user._id), user: safeUser(user) });
  } catch { res.status(500).json({ message: "Could not sign in." }); }
});

router.get("/me", protect, (req, res) => res.json({ user: safeUser(req.user) }));

router.put("/profile", protect, async (req, res) => {
  const { name, headline, college, skills } = req.body;
  if (typeof name === "string" && name.trim()) req.user.name = name.trim();
  if (typeof headline === "string") req.user.headline = headline.trim();
  if (typeof college === "string") req.user.college = college.trim();
  if (Array.isArray(skills)) req.user.skills = [...new Set(skills.map(s => String(s).trim()).filter(Boolean))].slice(0, 40);
  await req.user.save();
  res.json({ user: safeUser(req.user) });
});

export default router;
