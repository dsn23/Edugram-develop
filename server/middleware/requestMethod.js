/**
 * @author Danny Nansink, 500821004, allowed request methods
 **/
module.exports.allowedMethods =(req, res, next) => {
  // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
  const allowedMethods = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
  ];
  if (!allowedMethods.includes(req.method)) {
    res.status(405).send(`${req.method} not allowed.`);
  }

  next();
};
