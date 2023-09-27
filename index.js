/*eslint-disable */
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const appError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const authRouter = require("./routes/authRoutes");
const orderRouter = require("./routes/orderRoutes");
const productRouter = require("./routes/productRoutes");
const userRouter = require('./routes/userRoutes');

const app = express();

console.log(process.env.NODE_ENV);

// Global MIDDLEWARES
/* 'Dev' is one of the predefined logging formats provided by Morgan. This logging format displays basic information about each incoming request, such as the HTTP method, the route, the status code, and the response time.*/
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
};

// Rate limiting middleware for allowing max 100 requests from the client to the server durin 1  hour
const limiter = rateLimit({
  max : 100,
  windowMs : 60 * 60 * 1000,
  message: 'To many requests from this IP, please try again in an hour.'
});

app.use('/', limiter);

/* Next middleware is used to ensure that your Express application can understand and work with JSON data sent in incoming requests. This is crucial for many modern web applications, as JSON is a common format for exchanging data between the client and server in API (Application Programming Interface)-based web applications*/
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);

  next();
})

app.use('/login', authRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 400));
});

app.use(globalErrorHandler.cathMyErrors);


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
