const User = require('../../models/User');
const { UserStatuses } = require('../../utils/constants');
const { isValidRole } = require('../../utils/helpers');
const { generateTempPassword } = require('../../utils/passUtil');

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ status: { $ne: UserStatuses.ARCHIVED } }).select('-password -refreshToken');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get a single user
module.exports.saveUser = async (req, res) => {
  const { email, firstName, lastName, role, isResend } = req.body;

  if (!firstName || !lastName || !email || !role || !isValidRole(role)) {
    return res.badRequest('Valid email, first name, last name, and role are required');
  }

  let user = await User.findOne({ email });

  if (user) {
    if (user.status === UserStatuses.INVITED && isResend) {
      return res.success('Invitation alredy sent successfully');
    }
    return res.badRequest('User already exists', user.status);
  }
  user = new User({
    email,
    firstName,
    lastName,
    role,
    status: UserStatuses.INVITED,
    password: generateTempPassword()
  });
  await user.save();
  return res.success({
    message: 'User invited successfully',
    user: user.toJSON()
  });
};
