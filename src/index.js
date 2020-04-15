'use strict';

require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');
const bodyParser = require('body-parser');
const app = express();

// we want parse above authRoutes because
// we want to make sure that our JSON information is parsed FIRST
// and then run the request handler
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = 'mongodb+srv://elliotkim916:elliotkim916@cluster0-l1d2v.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to Mongo instance!');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to Mongo', err);
});

app.get('/', requireAuth, (req, res) => {
  res.send(`Your email is ${req.user.email}`);
});

app.listen(3000, () => {
  console.log('Listening on PORT 3000');
});