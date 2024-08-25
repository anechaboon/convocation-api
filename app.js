require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// สร้าง Express app
const app = express();

// ใช้ middleware สำหรับจัดการ JSON
app.use(express.json());
app.use(cors());

// URL สำหรับเชื่อมต่อกับ MongoDB
const mongoURI = `mongodb://localhost:27017/${process.env.DB_NAME}`;

// เริ่มการเชื่อมต่อ
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/user');
const convocationRoutes = require('./routes/convocation');
const reservationRoutes = require('./routes/reservation');
app.use('/users', userRoutes);
app.use('/convocation', convocationRoutes);
app.use('/reservation', reservationRoutes);

// เริ่มเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});