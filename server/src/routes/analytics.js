import { Router } from "express";
import Application from "../models/Application.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", async (req, res) => {
  const apps = await Application.find({ user: req.user._id }).sort({ appliedDate: 1 });
  const count = (s) => apps.filter(a => a.status === s).length;
  const now = new Date(); now.setHours(0,0,0,0);
  const upcoming = apps.filter(a => a.deadline && new Date(a.deadline) >= now && a.status !== "Selected" && a.status !== "Rejected")
    .sort((a,b) => new Date(a.deadline)-new Date(b.deadline)).slice(0,5);
  const months = [];
  for (let i=5; i>=0; i--) {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth()-i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    months.push({ month: d.toLocaleDateString("en-US",{month:"short"}), key, count: apps.filter(a => {
      const x = new Date(a.appliedDate); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}` === key;
    }).length });
  }
  res.json({
    total: apps.length, applied: count("Applied"), interviews: count("Interview"),
    selected: count("Selected"), rejected: count("Rejected"),
    responseRate: apps.length ? Math.round((apps.filter(a => a.status !== "Applied").length / apps.length) * 100) : 0,
    successRate: apps.length ? Math.round((count("Selected") / apps.length) * 100) : 0,
    upcoming, monthly: months
  });
});
export default router;
