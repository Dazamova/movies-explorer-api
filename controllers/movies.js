const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err'); // 404
const BadRequestError = require('../errors/bad-request-err'); // 400
const ForbiddenError = require('../errors/forbidden-err'); // 403

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;

// module.exports.getMovies = (req, res, next) => { // все фильмы в базе
//   Movie.find({})
//     .populate(['owner'])
//     .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
//     .catch((err) => next(err));
// };

module.exports.getMovies = (req, res, next) => { // фильмы, сохраненные пользователем
  // Movie.find({ owner: req.user })
  Movie.find({ owner: { _id: req.user._id } })
    .populate(['owner'])
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const ownerId = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((data) => {
      data.populate(['owner'])
        .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne({ _id: movieId })
          .orFail()
          .then(() => res.status(HTTP_STATUS_OK).send(movie))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new BadRequestError('Передан некорректный _id фильма'));
            } else if (err.name === 'DocumentNotFoundError') {
              next(new NotFoundError('Фильм с указанным _id не найден'));
            } else {
              next(err);
            }
          });
      } else {
        next(new ForbiddenError('Нет прав для удаления фильма')); // return res.status(HTTP_STATUS_FORBIDDEN).send({ message: 'Нет прав для удаления карточки' });
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id фильма'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Фильм с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};
