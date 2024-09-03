const { mongoose } = require("mongoose");

const memberFinanceSchema = new mongoose.Schema({
  member: { // Foreign Key
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'MembershipModel',
  },
  amount: {
    required: true,
    type: Number,
  },
  type: {
    type: String,
    enum: ['MONEY_IN', 'MONEY_OUT'],
    default: 'MONEY_IN',
  },
  comment: {
    required: true,
    type: String
  }
});


module.exports = mongoose.model('MemberFinanceModel', memberFinanceSchema);