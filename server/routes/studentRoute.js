/**
 * @author Danny Nansink, 500821004, booking
 **/
const express = require("express");
const router = express.Router();
const Student = require("../models/studentModal");
const Chat = require("../models/chat");
const Message = require("../models/message");

const bcrypt = require("bcrypt");
const {check, validationResult} = require("express-validator");
const Tutor = require("../models/tutorModal");
const {checkCookie} = require("../middleware/authentication");
const {sendRequestMail} = require("../middleware/mail");

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

// add student
router.post("/", userValidation, async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const student = new Student({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  });

  try {
    const errors = validationResult(req);
    if (Object.keys(errors.errors).length > 0) {
      res.status(404).send(errors.array())
      console.log("SIIUUUUU" + errors.array().length)
    } else {
      student.save();
      res.status(201).json({messsage: student});
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({message: error});
  }

});

router.post("/booking", checkCookie, async (req, res, next) => {
  const tutorRequest = {
    firstName: req.firstName,
    lastName: req.lastName,
    location: req.body.request.location,
    subject: req.body.request.subject,
    email: req.email,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  const studentRequest = {
    firstName: req.body.request.firstName,
    lastName: req.body.request.lastName,
    location: req.body.request.location,
    subject: req.body.request.subject,
    status: 'pending',
    created_at: Date.now(),
  }

  const chatObject = new Chat(
    {
      messages: [{message: req.body.request.message, sender: req.id, dateTime: Date.now()}],
      student: {_id: req.id, firstName: req.firstName},
      tutor: {_id: req.body.request.tutorId, firstName: req.body.request.firstName}
    }
  )

  const messageObject = new Message({
    message: req.body.request.message, sender: req.id, dateTime: Date.now()
  })


  try {
    const updateTutor = await Tutor.findByIdAndUpdate({_id: req.body.request.tutorId},
      {$push: {request: tutorRequest}}, {new: true});
    const updateStudent = await Student.findByIdAndUpdate({_id: req.id},
      {$push: {request: studentRequest}}, {new: true});

    //Lets try and check if a chat already exists, else we create a new onw so that we can navigate to it in the frontend
    try {
      const addChat = await Chat.findOne(
        {
          tutor: {_id: req.body.request.tutorId, firstName: req.body.request.firstName},
          student: {_id: req.id, firstName: req.firstName}
        }, {})
      if (addChat == null) {
        //Chat does not exist between student and tutor
        //So, we make a new chat object and insert teacher and student info
        try {
          await chatObject.save()
          //Chat made, now we cycle through the chat again but this time we know it exists!
          //So, we return the chatId that we have just created along with the object
          try {
            const getNewChatId = await Chat.findOne(
              {
                tutor: {_id: req.body.request.tutorId, firstName: req.body.request.firstName},
                student: {_id: req.id, firstName: req.firstName}
              }, {})
            sendRequestMail(updateTutor.email, req.firstName, req.body.request.subject, req.body.request.message)
            res.json({chatId: getNewChatId._id.valueOf()})
          } catch (e) {
            res.status(400).json({error: 'Error fetching newly made chat!'});
          }  //Check if cookie contains an = and return the token
          // res.status(201).json({messsage: 'oke'});
        } catch (e) {
          res.status(400).json({error: 'Could not make new chat!'});
        }
      } else {
        //Chat does exist
        //What do we do now?
        const sendNewMessage = await Chat.findOneAndUpdate(
          {
            tutor: {_id: req.body.request.tutorId, firstName: req.body.request.firstName},
            student: {_id: req.id, firstName: req.firstName}
          }, {
            $push: {
              messages: messageObject
            }
          }
        )
        sendRequestMail(updateTutor.email, req.firstName, req.body.request.subject, req.body.request.message)
        res.json({chatId: addChat._id.valueOf()})
      }
    } catch (e) {
      console.log(e + "=======>")
      res.send(400).json({error: 'Could not add chat between student and teacher!'})
    }
  } catch (e) {
    console.log(e + "<=======")
    res.status(400).json({error: 'Could not book lesson!'})
  }
});

module.exports = router;
