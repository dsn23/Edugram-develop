/**
 * @author Danny Nansink, 500821004, mailer
 **/
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(
  {
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.MAIL_SETTINGS_USER,
      pass: process.env.MAIL_SETTINGS_PASSWORD,
    },
    secure: true,
  }
);

module.exports.sendRequestMail = (receiverEmail, student, subject, message) => {
  const title = 'You have a new class request!'
  const mailData = {
    from: process.env.MAIL_SETTINGS_USER,  // sender address
    to: receiverEmail,   // list of receivers
    subject: subject,
    html:
    '<b><h3> ' + title + ' </h3></b>' +
      '<br>' + student + ' wants to take ' + subject + ' classes from you and has messaged you to find out if you are available!' + '<br/>' +
      '<br> The student has also sent you this message as part of the request: <br/>' +
      '<br><fieldset>' + message +
      '</fieldset></br>' +
      '<br> Could you please answer this student as soon as possible?  <br/>' +
      '<br>' + student + ' cannot wait to hear from you!' + '<br/>'

  };

  transporter.sendMail(mailData, function (err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });
}

module.exports.sendAcceptMail = (mailOfReceiver, subject, student, tutor) => {
  const title = tutor + ' has accepted your request for ' + subject + ' lessons!'
  const mailData = {
    from: process.env.MAIL_SETTINGS_USER,  // sender address
    to: mailOfReceiver,   // list of receivers
    subject: title,
    html: '<b><h3> ' + title + ' </h3></b>' +
      '<br>'+ tutor + ' has accepted your lesson request!'+ '<br/>' +
      '<br> Head over to the chat to start your lessons!<br/>'
  };

  transporter.sendMail(mailData, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
  });
}

