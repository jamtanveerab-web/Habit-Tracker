const mongoose = require("mongoose");

// records: keys are "YYYY-MM-DD" date strings, values are booleans (done / not done)
const HabitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
      maxlength: 80,
    },
    goal: {
      type: Number, // target days per week
      required: true,
      min: 1,
      max: 7,
      default: 5,
    },
    records: {
      type: Map,
      of: Boolean,
      default: () => new Map(),
    },
  },
  {
    timestamps: true, // createdAt doubles as the habit's tracking start date
    toJSON: {
      transform: (_doc, ret) => {
        // Convert the Mongoose Map into a plain object so the frontend
        // can just do habit.records["2026-07-04"] like normal JSON.
        ret.records = ret.records instanceof Map
          ? Object.fromEntries(ret.records)
          : ret.records || {};
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Habit", HabitSchema);
