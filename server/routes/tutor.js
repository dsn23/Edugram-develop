const express = require('express')
const router = express.Router()
const Student = require('../models/studentModal')
const {checkCookie} = require("../middleware/authentication");
const Tutor = require("../models/tutorModal");
const bcrypt = require("bcrypt");
const {check, validationResult, body} = require("express-validator");
const {verifyToken} = require("../middleware/authentication");
const {JsonWebTokenError} = require("jsonwebtoken");
const {checkPassword} = require('../middleware/authentication')
const { sendAcceptMail} = require("../middleware/mail");
// const upload = require("multer")({ dest: "uploads/" });
const tutorController = require('../controllers/tutorController');
const upload = require("../middleware/multer");
const userValidation = [
  check("firstName")
    .exists()
    .notEmpty()
    .withMessage("Firstname can not be empty")
    .trim()
    .escape(),
  check("lastName").exists().notEmpty().trim().escape().bail(),
  check("email")
    .exists()
    .notEmpty()
    .withMessage("Email can not be empty")
    .isEmail()
    .withMessage("Email is not valid")
    .trim()
    .escape(),
  check("password")
    .exists()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password can not be empty")
    .isLength({min: 8})
    .withMessage("Password must contain at leat 8 characters")
    .matches("[0-9]")
    .withMessage("Password must contain numbers")
    .matches("[A-Z]")
    .withMessage("Password must contain uppercase"),
];

router.get('/get_image', checkCookie, tutorController.getProfileImage)
router.post('/upload', upload, checkCookie, tutorController.uploadProfileImage)

// Get all tutors
router.get('/', async (req, res, next) => {
  try {
    const tutors = await Tutor.find().select('_id')
    res.json(tutors);
  } catch (err) {
    res.json({message: err})
  }
});

router.post("/", userValidation, async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const tutor = new Tutor({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  });
  
  try {
    const errors = validationResult(req);
    if (Object.keys(errors).length > 0) {
      res.status(404).send(errors.array())
    } else {
      tutor.save();
      res.status(201).json({messsage: tutor});
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error });
  }

});

router.get('/details', checkCookie, async (req, res, next) => {
    if (req.role === 'tutor') {
      try {
        const tutor = await Tutor.findById(req.id);
        return res.json(tutor);
      } catch (err) {
        return res.send({message: err})
      }
    } else if (req.role === 'student') {
      try {
        const student = await Student.findById(req.id);
        return res.json(student);
      } catch (err) {
        return res.send({message: err})
      }
    } else if (req.role === 'admin') {
      next()
    } else {
      //Try to redirect to unauthenticated route or something
      res.status(403).send({message: "unautenticated"})
      console.log('unauthenticated')
      // return next('/unauthenticated')
    }
  }
);

//Gets a specific tutor
router.get('/:tutorId', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId);
    res.send(tutor);
  } catch (err) {
    res.json({message: err})
  }
});

router.delete('/:tutorId', checkCookie, async (req, res) => {
  try {
    const updateTutor = await Tutor.deleteOne(
      {_id: req.params.tutorId},
    );
    res.json(updateTutor);
  } catch (err) {
    res.json({message: err})
  }
})

//Update a specific tutor
router.put('/:tutorId', checkCookie, async (req, res, next) => {
  const profile = req.body.user
  console.log('triggered')
  const updates = Object.keys(profile);
  const allowedUpdatesForProfile = ["firstName", "lastName", "dateOfBirth", "gender", "phoneNumber"];
  const allowedUpdatesForAddress = ["street", "postalCode"];
  const isValidProfileOperation = updates.every((update) =>
    allowedUpdatesForProfile.includes(update)
  );
  const isValidAddressOperation = updates.every((update) =>
    allowedUpdatesForAddress.includes(update)
  );

  //Delete the empty values if sent to backend
  Object.keys(req.body.user).forEach(key => {
    if (req.body.user[key] === '') {
      delete req.body.user[key];
    }
  });

  //First check if dateOfBirth has been entered and thus is not an empty string
  //Reformat date because ours is superior and makes more sense
  if (profile.dateOfBirth) {
    profile.dateOfBirth = new Date(profile.dateOfBirth).toLocaleDateString('german', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }

  //Check if only the aforementioned fields are being used
  if (isValidProfileOperation) {
    try {
      const updateTutor = await Tutor.updateOne(
        {_id: req.params.tutorId},
        {
          $set: profile
        });
      res.json({message: updateTutor});
    } catch (err) {
      res.json({error: err})
    }
  }

  if (isValidAddressOperation) {
    try {
      const updateTutor = await Tutor.findByIdAndUpdate(
        req.params.tutorId,
        {
          $set: {
            "address.street": profile.street,
            "address.postalCode": profile.postalCode,
          }
        }, {new: true})
      res.json({message: updateTutor});
    } catch (err) {
      res.json({error: err})
    }
  } else {
    console.log('nah man')
  }
})

router.put('/password/:tutorId', checkCookie, async (req, res, next) => {
  const password = req.body.password.oldPassword
  const newPassword = await bcrypt.hash(req.body.password.newPassword, 10);

  if (req.body.password.oldPassword && req.body.password.oldPassword){
    try{
      Tutor.find({_id: req.params.tutorId},
        function (error, data) {
          if (data.length === 1 ){
            bcrypt.compare(password, data[0].password).then(async result => {
              if (result) {
                const updatePassword = await Tutor.findByIdAndUpdate(req.params.tutorId, {
                  $set: {
                    password: newPassword
                  }
                })
                res.json(updatePassword);
              } else {
                res.status(400).json({error: 'Wrong query!'})
              }
            })
          } else {
            res.status(400).json({error: 'Wrong password!'})
          }
        }
      )
    } catch (e) {
      res.status(400).json({error: e})
    }
  } else {
    res.status(400).json({error: 'Old or new password is empty!'})
  }
})


//Update a specific tutor
router.patch('/:tutorId', checkCookie, async (req, res) => {
  try {
    const updatedTutor = await Tutor.findByIdAndUpdate(req.params.tutorId, req.body, {new: true}).lean()
    delete updatedTutor.password
    delete updatedTutor.email

    if (req.body.request && req.body.data && req.body.data.status === "accepted"){
      sendAcceptMail(req.body.data.tutorEmail, req.params.subject, req.body.request.firstName, req.body.data.firstName)
    }
    res.send(updatedTutor);
  } catch (err) {
    res.json({message: err})
  }
});

//Retrieve tutors based on a specific subject
router.get('/search/:subject', async (req, res) => {
  try {
    const query = {"course.subject": req.params.subject}
    const tutors = await Tutor.find(query).select('_id firstName lastName profile course');

    res.json(tutors);
  } catch (err) {
    res.json({message: err})
  }
})

//login request
router.post('/tutor', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Tutor.findOne({email: req.body.email}, function (err, user) {
    if (!user) {
      console.log('no user found')
    } else {
      if (req.body.password === user.password) {
        console.log('Success Fully login');
      } else {
        console.log('invalid password')
      }
    }

  })

})

module.exports = router;
