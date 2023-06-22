const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err'); // 401

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = req.cookies.jwt;
  try {
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'ya-practicum');
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
