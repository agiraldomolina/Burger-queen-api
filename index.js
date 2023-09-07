/*eslint-disable */
const express = require("express");
const morgan = require("morgan");

const appError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const orderRouter = require("./routes/order");
const productRouter = require("./routes/products");

const app = express();

//MIDDLEWARES:
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 400));
});

app.use(globalErrorHandler);

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
