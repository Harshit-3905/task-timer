import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    isRunning: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
