const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cities: [citySchema]
});

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true }, // e.g., "IN", "US"
  states: [stateSchema]
});

module.exports = mongoose.model('Country', countrySchema);
