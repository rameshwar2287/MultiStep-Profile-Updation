const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');

// POST /user/store-data
router.post('/update-data', async (req, res) => {
  const {
    username,
    currPassword,
    oldPassword,
    dob,
    gender,
    profession,
    companyName,
    address,
    country,
    state,
    city,
    subscriptionPlan,
    newsletter
  } = req.body;
console.log(username, currPassword, oldPassword,dob, gender, address, country, state, city)
  // Validation
  if (
    !username || !currPassword || !oldPassword || !dob || !gender ||
    !address || !country || !state || !city
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords (in real apps, use bcrypt to compare hashed passwords)
    if (user.password !== oldPassword) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // Update fields
    // user.profilePhoto = profilePhoto || user.profilePhoto;
    user.password = currPassword; // Make sure to hash in production
    user.dob = dob;
    user.gender = gender;
    user.profession = profession;
    user.companyName = profession === 'Entrepreneur' ? companyName : '';
    user.address = address;
    user.country = country;
    user.state = state;
    user.city = city;
    user.subscriptionPlan = subscriptionPlan;
    user.newsletter = newsletter !== undefined ? newsletter : user.newsletter;

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update this in your Express route
router.get('/searchuser', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const users = await User.find({
      username: { $regex: username, $options: 'i' }
    }).select('username');

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
