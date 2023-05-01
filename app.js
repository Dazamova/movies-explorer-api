require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

const { PORT = 3000, BASE_PATH = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(helmet()); // подключаем rate-limiter

mongoose.connect(BASE_PATH, {}); // Подключаемся к серверу mongo

const corsOptions = {
  origin: [
    'https://localhost:3000',
    'http://localhost:3000',
    'http://movies-scout.nomoredomains.monster',
    'https://movies-scout.nomoredomains.monster',
    'http://api.movies-scout.nomoredomains.monster',
    'https://api.movies-scout.nomoredomains.monster',
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json()); // для работы с телом запроса
app.use(cookieParser());

app.use(requestLogger); // логгер запросов
app.use(limiter); // подключаем rate-limiter

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router); // обработчик роутов

app.use(errorLogger); // логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

app.listen(PORT);
