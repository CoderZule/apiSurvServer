const mongoose = require('mongoose');

const forageSchema = new mongoose.Schema({
  
  Name: { type: String, required: true },

});

const Forage = mongoose.model('Forage', forageSchema);

module.exports = Forage;
