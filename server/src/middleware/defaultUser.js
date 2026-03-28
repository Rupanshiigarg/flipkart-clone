// Assumes a default logged-in user for the assignment.
// In production this would be replaced by JWT auth middleware that
// decodes the Bearer token and sets req.userId from the payload.
const defaultUser = (req, res, next) => {
  req.userId = parseInt(process.env.DEFAULT_USER_ID || '1', 10);
  next();
};

module.exports = defaultUser;
