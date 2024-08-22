const express = require('express');
const Seat = require('../models/Seat');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const seats = await Seat.findOne();
    return res.json(seats);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const result = await Seat.find();

    if(!result.length){
      const seat = new Seat({
        endColumn: req.body.endColumn,
        endRow: req.body.endRow,
        date: req.body.date,
        seatAvailable: req.body.seatAvailable,
      });

      const newSeat = await seat.save();
      if(newSeat){
        return res.status(201).json(newSeat); 
      }
      return res.status(200).json(newSeat); 

    }else{
      const result = await Seat.updateOne(
        { 
          status: 1,
          date: req.body.date,
        },
        {
          endColumn: req.body.endColumn,
          endRow: req.body.endRow,
          seatAvailable: req.body.seatAvailable,
        }
      );

      return res.status(200).json(result); 
    }

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
