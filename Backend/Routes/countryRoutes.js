const express = require('express');
const router = express.Router();
const Country = require('../Models/CountrySchema'); // Adjust path as needed

router.get('/check', async(req, res)=>{
    res.send({status:400, message:"OK"})
})
// GET all countries (name + code)
router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
}); 


// GET states for a given country code
router.get('/states/:countryCode', async (req, res) => {
  try {
    const country = await Country.findOne({ code: req.params.countryCode.toUpperCase() });
    if (!country) return res.status(404).json({ error: 'Country not found' });

    const states = country.states.map(state => state.name);
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

// GET cities for a given country code and state name
router.get('/cities/:countryCode/:stateName', async (req, res) => {
  try {
    const { countryCode, stateName } = req.params;

    const country = await Country.findOne({ code: countryCode.toUpperCase() });
    if (!country) return res.status(404).json({ error: 'Country not found' });

    const state = country.states.find(s => s.name.toLowerCase() === stateName.toLowerCase());
    if (!state) return res.status(404).json({ error: 'State not found' });

    const cities = state.cities.map(city => city.name);
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});
// POST: Add a new country with states and cities
router.post('/countries', async (req, res) => {
    try {
      const { name, code, states } = req.body;
  
      if (!name || !code || !states || !Array.isArray(states)) {
        return res.status(400).json({ error: 'Invalid or missing fields' });
      }
  
      const countryExists = await Country.findOne({ code });
      if (countryExists) {
        return res.status(400).json({ error: 'Country code already exists' });
      }
  
      const country = new Country({ name, code, states });
      await country.save();
  
      res.status(201).json({ message: 'Country added successfully', country });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add country' });
    }
  });

module.exports = router;
