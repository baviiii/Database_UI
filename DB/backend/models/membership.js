/**
 *  Mongoose Schema for Membership model
 *  @module models/membership
 *
 *  @requires mongoose
 */


const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  name: {
    required: false,
    type: String,
    default: ""
  },
  mobile: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  work_phone: {
    required: false,
    default: "-",
    type: String
  },
  member_id: {
    type: String,
  },
  street_address: {
    required: true,
    type: String
  },
  suburb: {
    required: true,
    type: String
  },
  state: {
    required: true,
    type: String
  },
  dob: {
    required: true,
    type: Date
  },
  date_of_membership: {
    required: true,
    type: Date
  },
  account_balance: {
    required: true,
    default: 2000.,
    type: Number
  }
}, {
  strict: true,
  strictQuery: true
});

module.exports = mongoose.model('MembershipModel', membershipSchema);