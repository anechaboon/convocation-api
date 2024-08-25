const express = require('express');
const User = require('../models/User');
const Convocation = require('../models/Convocation');

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
    const convocation = await Convocation.findOne({ status: 1 });
    if(convocation.registerAvailable){
      const user = await User.findOne({ phoneNumber: req.body.phoneNumber, status: 1 });
      console.log(`🚀 log:findOne.user`,user )
      if(!user){
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber
        });
  
        const newUser = await user.save();
        if(newUser){
          await Convocation.updateOne(
            { 
              status: 1,
              // date: req.body.date,
            },
            {
              $inc: { 
                registerAvailable: -1,       
                registered: 1       
              }
            }
          );
          return res.status(201).json(newUser); 
        }
        return res.status(200).json(newUser); 
  
      }
  
      return res.status(200).json({
        message: "telephone number exists"
      });
    }
    
    return res.status(200).json({
      message: "seat not available"
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

module.exports = router;
