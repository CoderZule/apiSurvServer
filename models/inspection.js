const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({

  Inspector: {
    firstName: { type: String ,required: true  },
    lastName: { type: String , required: true },
    cin: { type: String ,required: true  },
    phone : { type: String,required: true  },
  }, //المتفقد		

  InspectionDateTime: { type: Date, default: Date.now ,required: true   },
  //التاريخ		
 
  Queen: {
    seen: { type: Boolean},
    isMarked: { type: Boolean },
    color: { type: String },
    clipped: { type: Boolean },
    temperament: { type: String},
    note: { type: String },
    queenCells: { type: String },
    isSwarmed: { type: Boolean }
  },
  
  Colony: {
    strength: { type: String , required: true },
    temperament: { type: String, required: true  },
    deadBees: { type: Boolean, required: true },
    supers: { type: Number , required: true },
    pollenFrames: { type: Number, required: true },
    TotalFrames: { type: Number, required: true  },
    note: { type: String},

  },
  Brood: {
    state: { type: String , required: true }, //حضنة		
    maleBrood: { type: String, required: true  },//حضنة الذكور	
    totalBrood: { type: Number, default: 0 , required: true },//جملي الحضنة
  },

  DronesSeen: { type: Boolean, required: true  }, //ذكور	

  Supplies: { //التغذية 
    product: { type: String },
    ingredients: {
      name: { type: String },
      quantity: { type: Number},
      unit: { type: String }
    },
    note: { type: String }
  },

  BeeHealth: {
    disease: { type: String },
    treatment: { type: String },
    duration: {
      from: { type: Date },
      to: { type: Date}
    },
    quantity: { type: Number},
    doses: { type: String },
    note: { type: String }
  },

  HoneyStores: { type: String , required: true },
  PollenStores: { type: String , required: true },

  Adding: {
    ActivityAdd: { type: String },
    QuantityAdded: { type: Number}
  },
 Removing: {
  ActivityRemove: { type: String },
  QuantityRemoved:{ type: Number}
 },
 
  Weather: {
    condition: { type: String, required: true  },
    temperature: { type: Number, default: 0 , required: true },
    humidity: { type: Number, default: 0 , required: true },
    pressure: { type: Number, default: 0 , required: true },
    windSpeed: { type: Number, default: 0 , required: true },
    windDirection: { type: Number, default: 0, required: true  }
  },

  Note: { type: String },

  Hive: { type: mongoose.Schema.Types.ObjectId, ref: 'Hive', required: true },

}, {
  timestamps: true,
});

const Inspection = mongoose.model('Inspection', inspectionSchema);

module.exports = Inspection;
