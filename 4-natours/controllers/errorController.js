const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};
const handleJWTError=err=>new AppError('Invaild token. please log in again!' ,401)

const handleJWTExpiredError=err=>new AppError('token is expired! Please log in again',401)
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/);
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message,400)
};
const handleValidateErrorDB = err=>{
  const errors=Object.values(err.errors).map(el=>el.message)
  const message=`Ivalid input data. ${errors.join('. ')}`
  return new AppError(message,400)
}
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // operational, tursted error: send message to client

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //  Programingor other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR', err);

    // 2) Send generic message

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name ==='ValidationError') error=handleValidateErrorDB(err)
    if(err.name==='JsonWebTokenError') error=handleJWTError(err)  
    if(err.name==='TokenExpiredError') error= handleJWTExpiredError(err)

    sendErrorProd(error, res);
  }
};
