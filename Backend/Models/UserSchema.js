const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  profession: { type: String },
  companyName: String,
  address: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  subscriptionPlan: { type: String },
  newsletter: { type: Boolean, default: true }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
