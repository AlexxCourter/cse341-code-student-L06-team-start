const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const httpError = require('http-errors');

const port = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

app.use(function (error, request, response, next) {
  response.status(error.status || 500).send(error.message);
});

/*app.use(function handleUserIdValidationError(error, request, response, next) {
  if (error instanceof UserIdValidationError) {
    
  }

  next(error);
});

app.use(function handleContactValidationError(error, request, response, next) {
  if (error instance)
}) */
