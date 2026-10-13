import { Router } from "express";
import Application from "../models/Application.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

function cleanPayload(body) {
  const allowed = ["company","role","type","location","workMode","status","appliedDate","deadline","interviewDate","jobUrl","notes","requirements"];
  const out = {};
  for (const key of allowed) if (body[key] !== undefined) out[key] = body[key];
  if (out.requirements && !Array.isArray(out.requirements)) out.requirements = String(out.requirements).split(",").map(x => x.trim()).filter(Boolean);
  return out;
}
function validDates(data) {
  for (const key of ["appliedDate","deadline","interviewDate"]) {
    if (data[key] === "") data[key] = null;
    if (data[key] && Number.isNaN(new Date(data[key]).getTime())) return false;
  }
  return true;
}

router.get("/", async (req, res) => {
  const { q, status, type } = req.query;
  const filter = { user: req.user._id };
  if (status && status !== "All") filter.status = status;
  if (type && type !== "All") filter.type = type;
  if (q) filter.$or = [{ company: { $regex: q, $options: "i" } }, { role: { $regex: q, $options: "i" } }];
  const items = await Application.find(filter).sort({ updatedAt: -1 });
  res.json({ applications: items });
});

router.post("/", async (req, res) => {
  const data = cleanPayload(req.body);
  if (!data.company?.trim() || !data.role?.trim()) return res.status(400).json({ message: "Company and role are required." });
  if (!validDates(data)) return res.status(400).json({ message: "One or more dates are invalid." });
  const item = await Application.create({ ...data, user: req.user._id });
  res.status(201).json({ application: item });
});

router.get("/:id", async (req, res) => {
  const item = await Application.findOne({ _id: req.params.id, user: req.user._id });
  if (!item) return res.status(404).json({ message: "Application not found." });
  res.json({ application: item });
});

router.put("/:id", async (req, res) => {
  const data = cleanPayload(req.body);
  if (!validDates(data)) return res.status(400).json({ message: "One or more dates are invalid." });
  const item = await Application.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, data, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Application not found." });
  res.json({ application: item });
});

router.delete("/:id", async (req, res) => {
  const item = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!item) return res.status(404).json({ message: "Application not found." });
  res.json({ message: "Application deleted." });
});

export default router;
