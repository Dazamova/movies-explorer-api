require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

const { PORT, BASE_PATH } = process.env;
const app = express();

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
