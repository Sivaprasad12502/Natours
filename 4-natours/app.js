const path=require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser=require('cookie-parser')
const compression=require('compression')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter=require('./routes/reviewRoutes')
const bookingRouter=require('./routes/bookingRoutes')
const viewRouter=require('./routes/viewRouters')
const app = express();

app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))

// 1) global middlewares

// Serving static files

app.use(express.static(path.join(__dirname,'starter','public')));

// Set security HTTP headers
app.use(helmet());
// DEvelopment logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // Limit to 100 requests per hour
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

//Body parser,reading data from body inot req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({extended:true,limit:'10kb'}))

app.use(cookieParser())

// Data sanitization against NoSQl query injection

app.use(mongoSanitize());

//Data sanitization against XSS

app.use(xss());

// Prevent parameter pollution

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression)


// Test middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3) Routes


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/bookings',bookingRouter);



app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:'fail',
  //   message:`Can't find ${req.originalUrl} on this server!`
  // })

  // const err=new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status='fail'
  // err.statusCode=404
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
//4) start server
module.exports = app;


