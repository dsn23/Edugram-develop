const express = require('express')
const router = express.Router()
const Subject = require('../models/Subject')

// Get all subject
router.get('/', async (req, res, next) => {
  try {
    const subjects = await Subject.find()
    res.json(subjects);
  } catch (err) {
    res.json({message: err})
  }
});

// Adds a new subject
router.post('/', async (req, res) => {
  const subject = new Subject(
    {title: req.body.title,})
  try {
    await subject.save()
    res.status(201).json(subject)
  }catch (err) {
    res.status(400).json({message: err})
  }
});

module.exports = router;
