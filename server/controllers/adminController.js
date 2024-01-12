const mongoose = require('mongoose'),
  Tutors = mongoose.model('tutor'),
  Subjects = mongoose.model('subject'),
  Students = mongoose.model('student');
const Tutor = require("../models/Tutor");
const User = require("../models/userModal");

router.get('/', async (req, res) => {
  try {
    const tutors = await Users.find()
    res.json(tutors);
  } catch (err) {
    res.json({message: err})
  }
});
const blockUser = async (req, res) => {
  // Get the user ID from the request body
  const userId = req.body.userId;

  // Add the user ID to the list of blocked users in the database
  await User.updateOne({ _id: userId }, { blocked: true });

  res.send({ message: 'User blocked successfully' });
};

const editProfile = async (req, data) => {
  // Get the user ID from the request body
  const userId = req.body.userId;

  // Add the user ID to the list of blocked users in the database
  await User.updateOne({ _id: userId }, { blocked: true });

  res.send({ message: 'User blocked successfully' });
};

const createSubject = async (req, res) => {
  const newSubject = new Subjects(req.body);
  await newSubject.save(function (err, task) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).json(task);
    }
  });
};




module.exports = {
  blockUser,
  editProfile,
  createSubject
};
