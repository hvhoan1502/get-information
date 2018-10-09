const express = require('express');

const { API } = require('../helpers/sendAPI');
const getDataRouter = express.Router();


/**
 * get data company
 */
getDataRouter.get('/', (req, res) => {
    API.getDataCompany()
    .then(results => res.render('home', { results }))
    .catch(error => res.send(error));
});

module.exports = {getDataRouter}