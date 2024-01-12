const mongoose = require('mongoose')
const User = require("./userModal")

const UserSchema = User.schema

// Extend function
const extend = (Schema, obj) => (
  new mongoose.Schema(
    Object.assign({}, Schema.obj, obj)
  )
);

const studentSchema = extend(UserSchema, {
  request: [
    {firstName: String, lastName: String, location: String, subject: String, status: String, created_at: {type: Date, default: Date.now()}}
  ]
})

const Student = mongoose.model("Student", studentSchema);

module.exports = Student

