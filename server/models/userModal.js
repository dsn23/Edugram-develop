const mongoose = require('mongoose')

const AddressSchema = {
  street: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: false
  },
  postalCode: {
    type: String,
    required: false
  }
};

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  dateOfBirth: {
    type: String,
    required: false
  },
  address: {
    type: AddressSchema,
    required: false
  },
  blocked: {
    type: Boolean,
    required: false
  },
  request: [
    {id: String, firstName: String, lastName: String, location: String, subject: String, status: String}
  ]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
