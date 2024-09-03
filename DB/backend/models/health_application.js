const { mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const healthApplicationSchema = new mongoose.Schema({
  member: { // Foreign Key
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Membership',
  },
  member_id: {
    required: true,
    type: String
  },
  single_name: {
    required: true,
    type: String,
  },
  dob: {
    required: true,
    type: Date
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
  application_reason: {
    required: true,
    type: String,
  },
  application_self: {
    type: Schema.Types.Boolean,
    default: false,
  },
  application_child: {
    type: Schema.Types.Boolean,
    default: false,
  },
  childs_name: {
    type: String,
    default: "",
  },
  linked: {
    type: Schema.Types.Boolean,
    default: false
  }
});


const healthApplicationNewSchema = new mongoose.Schema({
  member: { // Foreign Key
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Membership',
  },
  dob: {
    required: true,
    type: Date
  },
  dob: {
    required: true,
    type: Date
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


module.exports = mongoose.model('HealthApplicationModel', healthApplicationSchema);