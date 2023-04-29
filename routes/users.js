const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getMe, updateProfile,
} = require('../controllers/users');

router.get('/me', getMe); // GET /users/me - возвращает пользователя

router.patch('/me', celebrate({ // PATCH /users/me — обновляет профиль
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = router;
