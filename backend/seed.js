// Run with: npm run seed
// Clears existing habits and inserts a few starter ones with a week of sample history.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Habit = require("./models/Habit");

function fmt(d) {
  return d.toISOString().slice(0, 10);
}

function lastNDaysRecords(n, pattern) {
  // pattern: array of booleans, cycled, most recent day last
  const records = {};
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    records[fmt(d)] = pattern[i % pattern.length];
  }
  return records;
}

const starterHabits = [
  { name: "Wake up at 06:30am", goal: 6, records: lastNDaysRecords(14, [true, true, false, true, true, false, false]) },
  { name: "Gym", goal: 5, records: lastNDaysRecords(14, [true, false, true, false, true, false, false]) },
  { name: "Reading", goal: 6, records: lastNDaysRecords(14, [true, true, true, false, true, true, false]) },
  { name: "Cold Shower", goal: 7, records: lastNDaysRecords(14, [true, true, true, true, false, false, false]) },
];

(async () => {
  await connectDB();
  await Habit.deleteMany({});
  await Habit.insertMany(starterHabits);
  console.log("Seeded starter habits with 14 days of sample history.");
  await mongoose.disconnect();
  process.exit(0);
})();
