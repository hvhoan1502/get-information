const express = require('express');

const { API } = require('../helpers/sendAPI')
const getDataRouter = express.Router();


getDataRouter.get('/', (req, res) => {
    API.getListData().then(data => res.send(data))
    .catch(err => res.send(err))
});

module.exports = {getDataRouter}