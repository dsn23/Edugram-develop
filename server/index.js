/**
 * @author Bugra Karaaslan, 500830631, connection to MongoDB
 * @author Daniel Kumankumah, 500811456, Routes from MongoDB
 * To run the server write command 'node server' in the terminal.
 **/
require("dotenv").config({path: require('find-config')('.env')})
const cookieParser = require('cookie-parser')
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const username = process.env.DATABASE_CONNECTION_USERNAME;
const password = process.env.DATABASE_CONNECTION_PASSWORD;
const jwt = require('jsonwebtoken')
const cors = require('cors');
const bodyParser = require('body-parser')
const Student = require("./models/studentModal");
const Tutor = require("./models/tutorModal");
const Admin = require("./models/Admin");
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')

// Passport config
require('./oauth/passport')(passport)

/**
 * URI of the database, The username and password are in the .env file.
 **/
const uri = `mongodb+srv://${username}:${password}@cluster0.wscvjuf.mongodb.net/Edugram?retryWrites=true&w=majority`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err));

// Sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}))

//Middlewares
app.use(cookieParser())
app.use(cors({origin: "http://localhost:3000", credentials: true}))
app.use(bodyParser.json())
const {allowedMethods} = require("./middleware/requestMethod");
const {checkCookie, checkPassword, createToken, createCookie}= require("./middleware/authentication")
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Import routes
const tutorRouter = require('./routes/tutor')
app.use('/tutor', allowedMethods, tutorRouter);

const subjectRouter = require('./routes/subject')
app.use('/subject', allowedMethods, subjectRouter);

const studentRouter = require('./routes/studentRoute')

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const {cookies} = require("next/headers");
app.use('/student', studentRouter)

//Routes
app.get('/', (req, res) => {
  res.send('we are on home')
})

app.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Student.find({email: email},
    function (error, data) {
      data.length === 1 ? checkPassword(data, password, res, next) : Tutor.find({email: email},
        function (error, data) {
          data.length === 1 ? checkPassword(data, password, res, next) : Admin.find({email: email},
            function (error, data) {
              data.length === 1 ? checkPassword(data, password, res, next) : res.status(400).send({
                error: 'Invalid Credentials'
              })
              if (error) {
                console.log(error);
              }
            })
          if (error) {
            console.log(error);
          }
        })
      if (error) {
        console.log(error);
      }
    })
})

app.get('/logout', checkCookie, function (req, res) {
  res.clearCookie('connect.sid')
  res.clearCookie('access_token').status(201).send({message:'Succesfully logged out!'})
  res.end()
})

app.get('/cookie', checkCookie, async function (req, res) {
  // console.log('yes')
  // console.log(req.id)

  if (req.role === 'tutor'){
    res.status(404).send({error: 'Tutors cannot make this request!'})
  }
  const findStudent = await Student.findById({_id: req.id}).lean()
  delete findStudent.password
  delete findStudent.request
  delete findStudent.requests

  res.send(findStudent)

})


app.listen(8000, () => {
  console.log("Server started on port 8000");
});
