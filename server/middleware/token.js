const jwt = require("jsonwebtoken");
module.exports.createToken = (id, firstName, email, lastName, role) => {
  return jwt.sign(
    {
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role
    }, process.env.ACCES_TOKEN_SECRET
  )
}

