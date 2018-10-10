const express = require('express');
const parser = require('body-parser');

const app = express();

app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

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

app.get('/', (req, res) => {
    res.render('login');
});
 
app.post('/login', (req, res) => {
    const { email, password } =req.body;
    if(email === 'hvhoan1502@gmail.com') {
        if(password === '123456') {
            res.redirect('/home');
        }
    }
    res.redirect('/');
});

app.get('/home', (req, res) => {
    res.render('index')
});

app.get('/detail', (req, res) => {
    const index = req.query.index;
    const sizeIndex = parseInt(index);
    if (!sizeIndex) {
        res.send('Invalid parametter');
    }
    res.render('detail', {index});

});

app.use('/api', getDataRouter);


app.use((error, req, res, next) => {
    res.status(500).send({
        success: false,
        message: error.message
    });
});

module.exports = { app };