import mongoose, { Schema, model } from "mongoose";

const postingSchema: Schema = new Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companymodels",
      required: false,
    },
    logo: { type: String, required: false, default: "" },
    companyName: { type: String, required: false },
    workplace: { type: String, required: false },
    position: { type: String, required: false },
    location: { type: String, required: false },
    jobDescription: { type: [String], required: false, default: [] },
    jobResponsibilities: { type: [String], required: false, default: [] },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    salary: { type: String, required: false, default: [] },
    totalEmployees: { type: String, required: false, default: 0 },
    time: {
      type: String,
      enum: ["full-time", "part-time"],
      required: true,
    },
    duration: { type: String, required: false, default: "" },
    availablePositions: { type: String, required: false, default: 0 },
    gender: {
      type: String,
      enum: ["any", "male", "female", "other"],
      default: "any",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Speeds up "jobs posted by this company" lookups and newest-first listing
postingSchema.index({ companyId: 1 });
postingSchema.index({ createdAt: -1 });

const Post = model("Post", postingSchema);
export { Post };
