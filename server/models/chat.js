const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const chatSchema = new Schema({
  messages: {
    type: [],
    required: true,
  },
  student: {
    type: Object,
    required: true,
  },
  tutor: {
    type: Object,
    required: true
  },
});

module.exports = mongoose.model('chat', chatSchema);
