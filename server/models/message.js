const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    default: Date.now(),
  },
}, );

const Message = mongoose.model('message', messageSchema);
module.exports = Message;
