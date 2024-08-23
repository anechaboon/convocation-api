const express = require('express');
const Convocation = require('../models/Convocation');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const convocation = await Convocation.findOne();
    return res.json(convocation);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const result = await Convocation.find();

    if(!result.length){
      const convocation = new Convocation({
        endColumn: req.body.endColumn,
        endRow: req.body.endRow,
        date: req.body.date,
        reserved: req.body.reserved,
        allSeat: req.body.allSeat,
        seatAvailable: req.body.seatAvailable,
        registered: req.body.registered,
      });

      const newConvocation = await convocation.save();
      if(newConvocation){
        return res.status(201).json(newConvocation); 
      }
      return res.status(200).json(newConvocation); 

    }else{
      const result = await Convocation.updateOne(
        { 
          status: 1,
          date: req.body.date,
        },
        {
          endColumn: req.body.endColumn,
          endRow: req.body.endRow,
          reserved: req.body.reserved,
          allSeat: req.body.allSeat,
          seatAvailable: req.body.seatAvailable,
          registered: req.body.registered,
        }
      );

      return res.status(200).json(result); 
    }

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
