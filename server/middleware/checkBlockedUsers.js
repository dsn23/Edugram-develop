// const mongoose = require('mongoose'),
//   Tutors = mongoose.model('tutor'),
//   Students = mongoose.model('student');
//
// module.exports.blockBlockedUsers = async (req, res, next) => {
//
//   // Get the user ID from the request
//   const userId = req.userId;
//
//   // Check if the user is blocked
//   const tutor = await Tutors.findOne({_id: userId});
//   const student = await Students.findOne({_id: userId});
//   if (tutor && tutor.blocked || student && student.blocked) {
//     // Redirect the user to the blocked page
//     res.redirect('/blocked');
//   } else {
//     next();
//   }
// }
