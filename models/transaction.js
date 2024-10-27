const mongoose = require("mongoose");


const transactionSchema = mongoose.Schema({
  OperationType: { type: String, required: true },
  Description: { type: String, required: true },
  TransactionDate: { type: Date, required: true, default: Date.now },
  Category: { type: String, required: true },
  Amount: { type: Number, required: true, default: 0 },
  Note: { type: String },
  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },


}, {
  timestamps: true,
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction