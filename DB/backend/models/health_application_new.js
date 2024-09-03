/**
 *  Mongoose Schema for HealthApplication model
 *  @module models/health_application_new
 *
 *  @requires mongoose
 */


const { mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const healthApplicationNewSchema = new mongoose.Schema({
  member: { // Foreign Key
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Membership',
  },
  name: {
    required: true,
    default: "-",
    type: String,
  },
  dob: {
    required: true,
    type: Date
  },
  date: {
    required: true,
    type: Date,
    default: Date.now()
  },
  phone: {
    required: true,
    type: String,
  },
  address: {
    required: true,
    type: String,
  },
  amount: {
    required: true,
    type: Number,
  },
  reason: {
    required: true,
    type: String,
  },
  self: {
    type: Schema.Types.Boolean,
    default: false,
  },
  child: {
    type: Schema.Types.Boolean,
    default: false,
  },
  child_name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: ""
  },
  postal: {
    type: String,
    default: ""
  },
  common_holder: {
    type: Schema.Types.Boolean,
    default: false
  },
  linked: {
    type: Schema.Types.Boolean,
    default: false
  }
});

module.exports = mongoose.model('HealthApplicationModelNew', healthApplicationNewSchema);