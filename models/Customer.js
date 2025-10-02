const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  memberNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  interests: [{
    type: String,
    trim: true,
  }],
}, { timestamps: true });

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
