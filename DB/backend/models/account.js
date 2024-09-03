const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    dropDups: true,
  },
  password: {
    required: true,
    type: String
  },
  account_type: {
    type: String,
    enum: ['STAFF', 'ADMIN', 'MANAGER', 'CUSTOMER', 'ACCOUNTANT', 'BOARD_MEMBER'],
    default: 'CUSTOMER'
  }
});

module.exports = mongoose.model('AccountModel', accountSchema);