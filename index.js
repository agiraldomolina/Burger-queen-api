/*eslint-disable */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const authRouter = require("./routes/authRoutes");
const orderRouter = require("./routes/orderRoutes");
const productRouter = require("./routes/productRoutes");
const userRouter = require('./routes/userRoutes');

const app = express();

// 1 -  GLOBAL MIDDLEWARES
// Set security HTTP headers
console.log(process.env.NODE_ENV);
app.use(helmet());

// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limits request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser middleware, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanititation againts NoSQL query injection
app.use(mongoSanitize());

// Data sanititation againts XSS

// This middleware allows the app access to the public files and open static files.
app.use(express.static(`${__dirname}/public`));

// Tests middelwares
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});

// 3- ROUTES
app.use('/login', authRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);


app.all('*', (req, res, next) => {
  
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  //next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

  
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Middleware to catch globlas errors
//app.use(globalErrorHandler);
app.use((err,req,res,next) => {
  console.log(err.stack)
  err.statusCode = err.statusCode || 500;
  err.status= err.status || 'error';

  res.status(err.statusCode).json({
    

    status: res.status,
    message: err.message,
    
  })
})

module.exports = app;


// const config = require("./config");
// const authMiddleware = require("./middleware/auth");
// const errorHandler = require("./middleware/error");
// const routes = require("./routes");
// const pkg = require("./package.json");

// const { port, secret } = config;
// const app = express();

// app.set("config", config);
// app.set("pkg", pkg);

// // parse application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(authMiddleware(secret));

// // Registrar rutas
// routes(app, (err) => {
//   if (err) {
//     throw err;
//   }

//   app.use(errorHandler);

//   app.listen(port, () => {
//     console.info(`App listening on port ${port}`);
//   });
// });
