/**
 *  Mongoose Schema for financial model
 *  @module models/financials
 *
 *  @requires mongoose
 */


const { mongoose } = require("mongoose"); // import mongoose

const financeSchema = new mongoose.Schema({
  amount: { // amount of the transaction
    required: true,
    type: Number,
  },
  type: { // type of transaction
    type: String,
    enum: ['MONEY_IN', 'MONEY_OUT'],
    default: 'MONEY_IN',
  },
  comment: { // any additional information about the transaction
    required: true,
    type: String }
});


module.exports = mongoose.model('FinanceModel', financeSchema); // model('Model name (within the project)', model object)