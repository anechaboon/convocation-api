const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  reservedSeat: { type: Boolean, default: false },
  status: { type: Number, required: false, default: 1 },

});

const User = mongoose.model('User', userSchema);

module.exports = User;