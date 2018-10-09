const express = require('express');

const app = express();
app.set('view engine', 'ejs');

const { getDataRouter } = require('./src/controllers/getData')
app.use((req, res, next) => {
    res.onError = error => res.status(error.statusCode || 500).send({
        success: false,
        message: error.message,
        code: error.code
    });
    next();
});

app.use('/api', getDataRouter);


app.use((error, req, res, next) => {
    res.status(500).send({
        success: false,
        message: error.message
    });
});

module.exports = { app };