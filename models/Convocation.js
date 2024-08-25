const mongoose = require('mongoose');

const convocationSchema = new mongoose.Schema({
  endColumn: { type: Number, required: true },
  endRow: { type: String, required: true },
  // date: { type: String, required: true },
  reserved: { type: String },
  allSeat: { type: Number, required: true, default: 1 },
  seatAvailable: { type: Number, required: true, default: 1 },
  registerAvailable: { type: Number, required: true, default: 1 },
  registered: { type: Number, required: true, default: 1 },
  status: { type: Number, required: false, default: 1 },
});

const Convocation = mongoose.model('Convocation', convocationSchema);

module.exports = Convocation;
