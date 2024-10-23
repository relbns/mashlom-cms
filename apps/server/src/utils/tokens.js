const jwt = require('jsonwebtoken');

exports.generateInvitationToken = (email, role) => {
  return jwt.sign({ email, role }, process.env.JWT_SECRET);
};


exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
}

exports.generateVerificationToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
