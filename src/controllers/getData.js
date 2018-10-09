const express = require('express');

const { API } = require('../helpers/sendAPI')
const getDataRouter = express.Router();


getDataRouter.get('/', (req, res) => {
    API.getDataCompany()
    .then(result => res.send(result))
    .catch(error => res.send(error));
});

module.exports = {getDataRouter}