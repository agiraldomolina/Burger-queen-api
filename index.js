/*eslint-disable */
const path = require('path');
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
const viewsRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
// using path.join will create the path in the correct order and sintax 
app.set('views', path.join(__dirname, 'views'));

// 1 -  GLOBAL MIDDLEWARES

// This middleware allows the app access to the public files and open static files.
app.use(express.static(path.join(__dirname, 'public')));
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
// app.get('/', (req, res) => {
//   res.status(200).render('base');
// })

// app.get('/overview', (req, res) => {
//   res.status(200).render('overview', {
//     title: 'Overview'
//   });
// });

// app.get('/menu', (req, res) => {
//   res.status(200).render('menu',{
//     title: 'Menu'
//   });
// });
app.use('/', viewsRouter);
app.use('/api/v1/login', authRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);


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
