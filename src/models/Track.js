'use strict';

const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number
  }
});
// all the point objects are embedded inside of the track schema
// thats why we only need to load up track into mongoose

const trackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // this is how we indicate that the user ID is a reference to some other object stored inside mongoDB
    ref: 'User' // tells that this userId is pointing at an instance of a user
  },
  name: {
    type: String,
    default: ''
  },
  locations: [pointSchema]
});

mongoose.model('Track', trackSchema);