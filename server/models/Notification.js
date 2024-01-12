const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  sender_id: {type: String, required: true}, // Notification creator
  receiver_id: {type: String}, // Ids of the receiver of the notification
  created_at: {type: Date, default: Date.now, required: true},
  message: {String, required: true}, // any description of the notification message
  read: {type: Boolean, default: true}
});

module.exports = mongoose.model("Notification", NotificationSchema);
