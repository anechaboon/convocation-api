const express = require('express');
const Reserved = require('../models/Reserved');
const Spectator = require('../models/Spectator');
const Convocation = require('../models/Convocation');

const router = express.Router();
const secretKey = process.env.SECRET_KEY; 
const authenticateToken = require('./authMiddleware'); // นำเข้า authenticateToken

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

router.post('/', authenticateToken, async (req, res) => {
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

        const updatedSpectator = await Spectator.findByIdAndUpdate(
            req.body.reservedID,         
            { reservedSeat: true},     
        );
    
        if (!updatedSpectator) {
          return res.status(404).json({ message: 'Spectator not found' });
        }

 

        const [spectators, reserved, convocation] = await Promise.all([ Spectator.find({ status: 1 }), Reserved.find({ status: 1 }), Convocation.findOne({ status: 1 })]);
        
        return res.status(201).json({
          spectators: spectators,
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
