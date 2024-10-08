const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // กำหนดระดับความซับซ้อนของ salt
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY; 

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, status: 1 });
    if(!user){

      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      });

      const newUser = await user.save();

      return res.status(201).json({
        message: 'User created successfully',
        user: newUser
      });

    }

    return res.status(200).json({
      message: "email number exists"
    });
  

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const userId = req.params.id; 
  const updateData = req.body;  

  try {
    const updatedUser = await User.findByIdAndUpdate(
        userId,         
        updateData,     
        { new: true }   
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const users = await User.find(); 
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {

      // ดึงข้อมูลผู้ใช้จากฐานข้อมูล (ตัวอย่าง)
      const user = await User.findOne({ email: req.body.email});

      if (!user) {
        return res.status(401).json({
          message: "Email or Password is Incorrect"
        }); 
      }

      // เปรียบเทียบรหัสผ่านที่กรอกกับรหัสผ่านที่ถูกเข้ารหัสในฐานข้อมูล
      const match = await bcrypt.compare(req.body.password, user.password);

      if (match) {
        const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

        return res.status(200).json({
          message: "login success",
          data: token
        }); 
      } else {
        return res.status(401).json({
          message: "Email or Password is Incorrect"
        }); 

      }
  } catch (err) {
      console.error('Error during login:', err);
  }
});

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const users = await User.find(); 
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});



module.exports = router;
