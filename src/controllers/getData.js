const express = require('express');

const { API } = require('../helpers/sendAPI');
const getDataRouter = express.Router();

function getCompanyWebSite(size) {
    let district;
    switch(size) {
        case 1:
            district = 'quan-1';
            break;
        case 2:
            district = 'quan-2';
            break;
        case 3:
            district = 'quan-3';
            break;
        case 4:
            district = 'quan-4';
            break;
        case 5:
            district = 'quan-5';
            break;
        case 6:
            district = 'quan-6';
            break;
        case 7:
            district = 'quan-7';
            break;
        case 8:
            district = 'quan-8';
            break;
        case 9:
            district = 'quan-9';
            break;
        case 10:
            district = 'quan-10';
            break;
        case 11:
            district = 'quan-11';
            break;
        case 12:
            district = 'quan-12';
            break;
        case 13:
            district = 'quan-go-vap';
            break;
        case 14:
            district = 'quan-tan-binh';
            break;
        case 15:
            district = 'quan-tan-phu';
            break;
        case 16:
            district = 'quan-binh-thanh';
            break;
        case 17:
            district = 'quan-phu-nhuan';
            break;
        case 18:
            district = 'quan-thu-duc';
            break;
        case 19:
            district = 'quan-binh-tan';
            break;
        case 20:
            district = 'huyen-cu-chi';
            break;
        case 21:
            district = 'huyen-hoc-mon';
            break;
        case 22:
            district = 'huyen-binh-chanh';
            break;
        case 23:
            district = 'huyen-nha-be';
            break;
        case 24:
            district = 'quan-can-gio';
            break;
        default:
            break;
    }
    return district;
}

/**
 * get data company
 */
getDataRouter.get('/:from/:to', (req, res) => {
    const { from, to } = req.params;
    const webSize = req.query.id;
    const startPages = parseInt(from);
    const endPages = parseInt(to);
    const size = parseInt(webSize);
    const district = getCompanyWebSite(size);
    if (!startPages && !endPages && !district) {
        res.send('Invalid parametter!');
    }
    API.getDataCompany(district, startPages, endPages)
    .then(results => res.render('home', { results }))
    .catch(error => res.send(error));
});

module.exports = {getDataRouter}