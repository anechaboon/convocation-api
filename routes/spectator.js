const express = require('express');
const Spectator = require('../models/Spectator');
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
    
    const spectators = await Spectator.find(query);
    return res.json(spectators);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const convocation = await Convocation.findOne({ status: 1 });
    if(convocation.registerAvailable){
      const spectator = await Spectator.findOne({ phoneNumber: req.body.phoneNumber, status: 1 });
      console.log(`🚀 log:findOne.spectator`,spectator )
      if(!spectator){
        const spectator = new Spectator({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber
        });
  
        const newSpectator = await spectator.save();
        if(newSpectator){
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
          return res.status(201).json(newSpectator); 
        }
        return res.status(200).json(newSpectator); 
  
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
  const spectatorId = req.params.id; 
  const updateData = req.body;  

  try {
    const updatedSpectator = await Spectator.findByIdAndUpdate(
        spectatorId,         
        updateData,     
        { new: true }   
    );

    if (!updatedSpectator) {
      return res.status(404).json({ message: 'Spectator not found' });
    }
    
    const spectators = await Spectator.find(); 
    return res.json(spectators);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
