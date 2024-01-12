const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    subjectName: {
      type: String,
      required: true,
    },
  }
);

module.exports = mongoose.model('Subjects', subjectSchema)
