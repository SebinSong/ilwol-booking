const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
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
  isPermitted: {
    type: Boolean,
    default: false
  },
  passwordHistory: { type: [String] }
})

// attach middlewares
UserSchema.pre('save', async function () {
  console.log('pre-save hook: ', this)
  if (this.isNew) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)

    this.password = hashedPassword
  }
})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
