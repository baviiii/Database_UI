const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const linkSchema = new mongoose.Schema({
  member: { // Foreign Key
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Membership',
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
  }
})

module.exports = mongoose.model('LinkModel', linkSchema);