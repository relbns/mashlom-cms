const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { UserStatuses } = require('../utils/constants');
const { isPasswordValid } = require('../utils/passUtil');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, },
  lastName: { type: String, required: true, trim: true, },
  email: {
    type: String, required: true, unique: true, index: true, trim: true, match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please add a valid email',
    ]
  },
  password: { type: String, required: true },
  mobile: { type: String },
  isSuperAdmin: { type: Boolean, default: false },
  refreshToken: { type: String },
  status: {
    type: String,
    enum: Object.values(UserStatuses),
    default: UserStatuses.INVITED
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

userSchema.plugin(mongoosePaginate);

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

async function savePassword (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  const password = user.password;
  if (!isPasswordValid(password)) {
    const error = new Error('Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
    return next(error);
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    next();
  } catch (err) {
    next(err);
  }
}

userSchema.pre('save', savePassword);
userSchema.pre('findOneAndUpdate', savePassword);

const userModel = mongoose.model('User', userSchema);

userModel.paginate().then({});

module.exports = userModel;