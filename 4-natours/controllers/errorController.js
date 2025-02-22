const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError('Invaild token. please log in again!', 401);

const handleJWTExpiredError = (err) =>
  new AppError('token is expired! Please log in again', 401);
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidateErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Ivalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, req, res) => {
  //A) APi
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //B) RENDERED WEBSITE
  console.error('ERROR',err)
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  // A)APi
  if ((req.originalUrl.startsWith('/api'))) {
    // operational, tursted error: send message to client

    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //  Programingor other unknown error: don't leak error details
    }
    // 1) Log error
    console.error('ERROR', err);

    // 2) Send generic message

    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // B)RENDERED WEBSITE
  // operational, tursted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error',{
      title: 'Something went wrong!',
      msg: err.message,
    });
    //  Programingor other unknown error: don't leak error details
  }
  // 1) Log error
  console.error('ERROR', err);

  // 2) Send generic message

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message=err.message

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidateErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(err);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(err);

    sendErrorProd(error, req, res);
  }
};
