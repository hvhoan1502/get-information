const request = require('request');
const _ = require('lodash');


function getAll(index) {
    return new Promise((resolve, reject) => {
        request('http://thuonghieutoancau.vn/index.php?lang=vi&mod=search&op=company&codetax=&keys=&business=0&location=14&begin=&end=&p=' + index, (err, rq, body) => {
            if (err) return reject(err);
            let results = [];
            const firstIndex = body.indexOf('<div class="list-info-c">');
            const lastIndex = body.indexOf('<div class="page"><a');
            body = body.substring(firstIndex + 15, lastIndex);
            body = body.split('<div class="list-info-c">');
            for (let i = 0; i < body.length; i++) {
                const firstIndexLink = body[i].indexOf('http://');
                const lastIndexLink = body[i].indexOf('" title="');
                results.push(body[i].substring(firstIndexLink, lastIndexLink));
            }
            return resolve(results);
        });
    })
}

function getDetailCompany(uri) {
    return new Promise((resolve, reject) => {
        request(uri, (err, rq, body) => {
            if (err) return reject(err);
            const firstIndex = body.indexOf('<div class="company-info">');
            const lastIndex = body.indexOf('<div class="sys_mess postion_ads_detail">');
            body = body.substring(firstIndex, lastIndex);
            // name
            const firstIndexName = body.indexOf('<h1>');
            const lastIndexName = body.indexOf('</h1>');
            const name = body.substring(firstIndexName + 4, lastIndexName);
            // address
            const firstIndexAddress = body.indexOf('<h2>');
            const lastIndexAddress = body.indexOf('</h2>');
            const address = body.substring(firstIndexAddress + 4, lastIndexAddress);
            // master
            let cutBodyIndex = body.indexOf('GĐ/Chủ/Đại diện');
            body = body.substring(cutBodyIndex);
            const firstIndexMaster = body.indexOf('</strong>');
            const lastIndexMaster = body.indexOf('</p>');
            const master = body.substring(firstIndexMaster + 9, lastIndexMaster);
            // phone number
            cutBodyIndex = body.indexOf('Di động:');
            body = body.substring(cutBodyIndex);
            const firstIndexPhone = body.indexOf('</strong>');
            const lastIndexPhone = body.indexOf('</p>');
            const phoneNumber = body.substring(firstIndexPhone + 9, lastIndexPhone);
            // field
            cutBodyIndex = body.indexOf('Lĩnh vực hoạt động:');
            body = body.substring(cutBodyIndex);
            const firstIndexField = body.indexOf('</strong>');
            const lastIndexField = body.indexOf('</p>');
            const field = body.substring(firstIndexField + 9, lastIndexField);
            if (phoneNumber) {
                return resolve({name, address, master, phoneNumber, field});
            }
            return resolve(null);
        });
    })
}


async function getTMData(startIndex, endIndex) {
    let bodyDetail = [];
    let results = [];

    for (let index = startIndex; index <= endIndex; index++) {
        const listLink = await getAll(index);
        bodyDetail = bodyDetail.concat(listLink);
    }
    
    for(let i = 0; i< bodyDetail.length; i++) {
        const body = await getDetailCompany(bodyDetail[i]);
        if(body) {
            results.push(body);
        }
    }
    return results;
}

module.exports = { getTMData };