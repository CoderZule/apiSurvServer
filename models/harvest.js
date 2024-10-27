const mongoose = require('mongoose');


const harvestSchema = new mongoose.Schema({

  Product: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Unit: { type: String, required: true },
  Season: { type: String, required: true },
  HarvestMethods: { type: String, required: true },
  QualityTestResults: { type: String, required: true },
  Date: { type: Date, required: true, default: Date.now },

  Apiary: { type: String, required: true },
  Hive: { type: String, required: true },

  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ApiaryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Apiary', required: true },


}, {
  timestamps: true,
})

 

const Harvest = mongoose.model('Harvest', harvestSchema);

module.exports = Harvest;