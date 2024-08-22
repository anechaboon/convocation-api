const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const q = req.query.q || ''; 
    const query = {
      $or: [
        { firstName: { $regex: new RegExp(q, 'i') } },
        { lastName: { $regex: new RegExp(q, 'i') } },  
        { phoneNumber: { $regex: new RegExp(q, 'i') } }  
      ]
    };
    
    const users = await User.find(query);
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const query = { phoneNumber: req.body.phoneNumber };  
    const result = await User.find(query);

    if(!result.length){
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber
      });

      const newUser = await user.save();
      if(newUser){
        return res.status(201).json(newUser); 
      }
      return res.status(200).json(newUser); 

    }

    return res.status(200).json({
      message: "telephone number exists"
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
