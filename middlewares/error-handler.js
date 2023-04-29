module.exports = (err, req, res, next) => { // централизованный обработчик ошибок
  const { statusCode = 500, message } = err; // если у ошибки нет статуса, выставляем 500

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
