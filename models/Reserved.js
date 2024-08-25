const mongoose = require('mongoose');

const reservedSchema = new mongoose.Schema({
//   date: { type: String, required: true },
  reservedID: { type: String, required: true },
  seatNumber: { type: String, required: true },
  status: { type: Number, required: false, default: 1 },

});

const Reserved = mongoose.model('Reserved', reservedSchema);

module.exports = Reserved;