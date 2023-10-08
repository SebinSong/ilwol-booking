const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const UserSchema = new mongoose.Schema({
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
      values: ['customer', 'admin-owner', 'admin-staff'],
      message: '{VALUE} is not supported'
    }
  },
  isPermitted: {
    type: Boolean,
    default: false
  },
  numLogin: {
    type: Number,
    default: 0
  },
  passwordHistory: { type: [String] }
})

// methods
UserSchema.methods.matchPassword = async function (queryPassword) {
  return await bcrypt.compare(queryPassword, this.password)
}

// attach middlewares
UserSchema.pre('save', async function () {
  if (this.isNew) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)

    this.password = hashedPassword
  }
})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
