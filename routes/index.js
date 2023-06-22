const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const authRouter = require('./auth');

const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.use('/', authRouter);
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.all('*', auth, (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

module.exports = router;
