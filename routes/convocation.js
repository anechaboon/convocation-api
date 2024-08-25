const express = require('express');
const Convocation = require('../models/Convocation');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const convocation = await Convocation.findOne({ status: 1 });
    return res.json(convocation);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const result = await Convocation.find({ status: 1 });

    let body = {
      endColumn: req.body.endColumn,
      endRow: req.body.endRow,
      // date: req.body.date,
      reserved: req.body.reserved,
      allSeat: req.body.allSeat,
      seatAvailable: req.body.seatAvailable,
      registerAvailable:  req.body.registerAvailable,
      registered: req.body.registered,
    }
    if(!result.length){
      const convocation = new Convocation(body);

      const newConvocation = await convocation.save();
      if(newConvocation){
        return res.status(201).json(newConvocation); 
      }
      return res.status(200).json(newConvocation); 

    }else{
      const result = await Convocation.updateOne(
        { 
          status: 1,
          // date: req.body.date,
        },
        body,
        { new: true }   

      );

      return res.status(200).json(result); 
    }

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
