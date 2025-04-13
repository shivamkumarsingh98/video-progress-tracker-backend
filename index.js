const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const progressRoutes = require("./routes/progressRoutes");

app.use("/api", authRoutes);
app.use("/api", progressRoutes);

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () =>
      console.log("Server running on http://localhost:5000")
    );
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server running");
});
