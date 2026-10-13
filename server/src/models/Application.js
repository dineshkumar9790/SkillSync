import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Internship", "Full-time", "Part-time", "Contract"], default: "Internship" },
  location: { type: String, default: "Remote" },
  workMode: { type: String, enum: ["Remote", "Hybrid", "On-site"], default: "Remote" },
  status: { type: String, enum: ["Applied", "Interview", "Selected", "Rejected"], default: "Applied" },
  appliedDate: { type: Date, default: Date.now },
  deadline: { type: Date, default: null },
  interviewDate: { type: Date, default: null },
  jobUrl: { type: String, default: "" },
  notes: { type: String, default: "" },
  requirements: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
