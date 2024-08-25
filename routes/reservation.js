const express = require('express');
const Reserved = require('../models/Reserved');
const User = require('../models/Spectator');
const Convocation = require('../models/Convocation');


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // let query = {}; 
    // if(req.query.date){
    //   query = { date: req.query.date };  
    // }

    const result = await Reserved.find({ status: 1 });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const reserved = new Reserved({
        // date: req.body.date,
        reservedID: req.body.reservedID,
        seatNumber: req.body.seatNumber,
        status: req.body.status
    });

    const newReserved = await reserved.save();
    if(newReserved){
        await Convocation.updateOne(
          { 
            status: 1,
            // date: req.body.date,
          },
          {
            $inc: { 
              seatAvailable: -1,       
            }
          },
        );

        const updatedUser = await User.findByIdAndUpdate(
            req.body.reservedID,         
            { reservedSeat: true},     
        );
    
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }

 

        const [users, reserved, convocation] = await Promise.all([ User.find({ status: 1 }), Reserved.find({ status: 1 }), Convocation.findOne({ status: 1 })]);
        
        console.log(`🚀 log:add reserve`,{
          users: users,
          reserved: reserved,
          convocation: convocation
        } )
        return res.status(201).json({
          users: users,
          reserved: reserved,
          convocation: convocation
        }); 
    }
    return res.status(200).json(newReserved); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
