const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: true,
    minLength: [6, 'Must be at least 6 characters long, got {VALUE}']
  },
  userType: {
    type: String,
    required: true,
    enum: {
      values: ['customer', 'admin-full', 'admin-readonly'],
      message: '{VALUE} is not supported'
    }
  },
  passwordHistory: { type: [String] }
})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
