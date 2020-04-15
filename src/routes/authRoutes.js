'use strict';

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User'); // we can use this to interact with all the users stored in mongo
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await new User({ email, password });
    await user.save();
    
    // first arg is info we want to put in token, were going to encode user id
    // second arg is key to assign the token, this key is secret info that we dont want to share with the outside world
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY'); 
    res.send({ token });
  } catch(e) {
    return res.status(422).send(e.message);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY' );
    return res.send({ token });
  } catch(e) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }
});

module.exports = router;