// ================= IMPORTS =================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// ================= CONFIG =================
dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= FRONTEND SERVE =================
// medicalcenter-master/index.html serve avutundi
app.use(
  express.static(
    path.join(__dirname, "../")
  )
);

// Browser refresh / direct URL open ki
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../index.html")
  );
});

// ================= API ROUTES =================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/organ", require("./routes/organ"));
app.use("/api/general", require("./routes/general"));
app.use("/api/medicine", require("./routes/medicine"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/diet", require("./routes/diet"));
app.use("/api/prescriptions", require("./routes/prescriptions"));
app.use("/api/doctor", require("./routes/doctor_routes"));
app.use("/api/doctors", require("./routes/public_doctors"));

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});