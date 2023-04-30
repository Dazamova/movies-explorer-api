const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const { urlRegex } = require('../utils/constants');

router.get('/', getMovies); // GET /movies - возвращает все сохранённые текущим пользователем фильмы

router.post('/', celebrate({ // POST /movies - создаёт фильм с переданными в теле параметрами
  body: Joi.object().keys({ // #
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegex),
    trailerLink: Joi.string().required().pattern(urlRegex),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(urlRegex),
    movieId: Joi.string().required().hex().length(24),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({ // DELETE /movies/_id - удаляет сохранённый фильм по id
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie); // DELETE /cards/:cardId — удаляет карточку по идентификатору

module.exports = router;
