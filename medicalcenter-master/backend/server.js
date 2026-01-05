// ================= IMPORTS =================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// ================= APP =================
const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= FRONTEND SERVE =================
// Your index.html is here:
// Desktop/final/hackathon/medicalcenter-master/index.html
app.use(express.static(
  path.join(__dirname, "../medicalcenter-master")
));

// ❌ DO NOT use app.get("/") for frontend
// express.static will automatically serve index.html

// ================= API ROUTES =================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/organ', require('./routes/organ'));
app.use('/api', require('./routes/general'));
app.use('/api/medicine', require('./routes/medicine'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/diet', require('./routes/diet'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/doctor', require('./routes/doctor_routes'));
app.use('/api/doctors', require('./routes/public_doctors'));

// ================= DATABASE + SERVER =================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
});