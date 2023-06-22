const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.methods.toJSON = function toJSON() {
  const data = this.toObject();
  delete data.password;
  delete data.__v;
  return data;
};

userSchema.statics.findUser = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .orFail()
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }

        return user; // теперь user доступен
      }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new UnauthorizedError('Неправильные почта или пароль');
      } else {
        throw err;
      }
    });
};

module.exports = mongoose.model('user', userSchema);
