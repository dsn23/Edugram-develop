/**
 * @author Salman Lartey, 500779627
 * To run the server write command 'node server' in the terminal.
 * Applied potentially caching.
 * health checker of backend
 */
require("dotenv").config({path: require('find-config')('.env')})
const express = require("express");
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");

const username = process.env.DATABASE_CONNECTION_USERNAME;
const password = process.env.DATABASE_CONNECTION_PASSWORD;
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const cors = require('cors');


const PORT = process.env.PORT || 8001
const http = require('http');
const app = express();
const server = http.createServer(app);

// mongoose.Promise = global.Promise;
const uri = `mongodb+srv://${username}:${password}@cluster0.wscvjuf.mongodb.net/Edugram?retryWrites=true&w=majority`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err));

/**
 * Configure app to use bodyParser()
 * Add the routes here as well to get noticed
 * Cache is installed and set for 5 minutes
 */

//Middlewares
app.use(cookieParser())
app.use(cors({origin: "http://localhost:3000", credentials: true}))
app.use(bodyParser.json())
// Using morgan middleware to log requests
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);
app.use(morganMiddleware);
const {allowedMethods} = require("./middleware/requestMethod");
const blockBlockedUsers = require('./middleware/checkBlockedUsers');
//caching all routes for 5 minutes. Debating if it is useful.
// app.use(cache('5 minutes'));


//Import routes
const tutorRouter = require('./routes/tutor')
app.use('/tutor', allowedMethods, tutorRouter);

const subjectRouter = require('./routes/subject')
app.use('/subject', allowedMethods, subjectRouter);

const ticketRoute = require('./routes/ticketsRoute');
app.use(ticketRoute);

const studentRouter = require('./routes/studentRoute')
const {cookies} = require("next/headers");

const Student = require("./models/studentModal");
const {checkPassword, checkCookie} = require("./middleware/authentication");
const Tutor = require("./models/tutorModal");
const Admin = require("./models/Admin");


// Health route to make sure everything is working (accessed at GET http://localhost:3000/health)
app.use('/health', require('express-healthcheck')({}));

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
                throw error;
              }
            })
          if (error) {
            throw error;
          }
        })
      if (error) {
        throw error;
      }
    })
})

app.get('/logout', checkCookie, function (req, res) {
  res.clearCookie('access_token').status(201).send({message: 'Succesfully logged out!'})
  res.end()
})

server.listen(PORT, () => {
  logger.log('info', `Server Running on the following port: ${PORT} `)
});

module.exports = app;
