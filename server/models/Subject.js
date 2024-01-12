const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Related = new Schema({
  category: {
    id: {
      type: Date
    }
  },
  subjects: {
    type: []
  },
  proceedings: {
    type: []
  }
})

const SubjectSchema = new Schema({
  familly_id: {
    type: String,
    required: true,
  },
  parent_id: {
    type: String,
    required: true
  },
  lang_group_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true,
  },
  dative: {
    type: String,
    required: true
  },
  trending: {
    type: Boolean,
    required: true,
  },
  ads_count: {
    type: Number,
    required: true
  },
  aliases: Array,
  related: Related,
});

module.exports = mongoose.model('subject', SubjectSchema)
