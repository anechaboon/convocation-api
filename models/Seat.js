const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  endColumn: { type: Number, required: true },
  endRow: { type: String, required: true },
  date: { type: String, required: true },
  seatAvailable: { type: Number, required: true, default: 1 },
  status: { type: Number, required: false, default: 1 },
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
