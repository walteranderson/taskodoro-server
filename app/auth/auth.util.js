
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  res.status(401);
}

exports.ensureAuthentication = ensureAuthentication;