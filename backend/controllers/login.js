const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username exists
    const user = await User.findOne({ username });
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: "invalid username or password"
      });
    }

    // Create JWT token
    const userToken = {
      username: user.username,
      id: user._id
    };

    const token = jwt.sign(userToken, process.env.SECRET, { expiresIn: '1h' }); // Token valid for 1 hour

    // Send token and user data
    res.status(200).json({
      token,
      username: user.username,
      name: user.name
    });

  } catch (error) {
    res.status(500).json({ error: 'something went wrong' });
  }
});

module.exports = loginRouter;
