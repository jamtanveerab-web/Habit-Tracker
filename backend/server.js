require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const habitRoutes = require("./routes/habits");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "Ledger API is running" }));
app.use("/api/habits", habitRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    if (require.main === module) {
      app.listen(PORT, () => console.log(`Ledger API listening on port ${PORT}`));
    }
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

module.exports = app;
