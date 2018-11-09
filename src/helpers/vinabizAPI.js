const request = require('request');
const _ = require('lodash');

function getAllLink(district, id, pageNumber) {
    return new Promise((resolve, reject) => {
        request(`https://vinabiz.org/categories/quanhuyen/${district}/${id}/${pageNumber}`, (err, response, body) => {
            if (err) return reject('Error');
            body = body.trim();
            const firstIndex = body.indexOf('<a href="/company/detail');
            const lastIndex = body.lastIndexOf('<div class="pagination-container">');
            body = body.substring(firstIndex + 2, lastIndex);
            body =body.split('<a href="/company/detail');
            for(let i = 0; i < body.length; i++) {
                let item = body[i];
                let firstIndexLink = item.indexOf('/company/detail');
                if (firstIndexLink !== -1) {
                    firstIndexLink += 15;
                }
                const lastIndexLink = item.indexOf('rel="tooltip" data-html="true"');
                item = item.substring(firstIndexLink, lastIndexLink - 2);
                body[i] = item;
            }
            resolve(body);
        });
    });
}

function getDetailByLink(uri) {
    return new Promise((resolve, reject) => {
        request(`https://vinabiz.org/company/detail${uri}`, (err, response, body) => {
            if (err) return reject(err);
            //name
            const firstIndexName = body.indexOf('</div>">');
            const lastIndexName = body.indexOf('</a> </h4>');
            const name = body.substring(firstIndexName + 8, lastIndexName);
            //Check status is active or not
            const firIndexStatus = body.indexOf('Người nộp');
            const lastIndexStatus = body.indexOf('ĐKT');
            if (firIndexStatus === -1 || lastIndexStatus === -1) {
                return resolve(null);
            }
            // address
            let index = body.indexOf('Địa chỉ trụ sở');
            body = body.substring(index);
            const firstIndexAddress = body.indexOf('<td colspan="3">');
            const lastIndexAddress = body.indexOf('</a> </td>');
            let address = body.substring(firstIndexAddress + 16, lastIndexAddress);
    
            // phone number
            index = body.indexOf('Điện thoại');
            body = body.substring(index + 14);
            const firstIndexPhoneNumber = body.indexOf('<td>');
            const lastIndexPhoneNumber = body.indexOf('</td>');
            if(firstIndexPhoneNumber + 4 === lastIndexPhoneNumber) {
                return resolve(null);
            }
            const phoneNumber = body.substring(firstIndexPhoneNumber + 4, lastIndexPhoneNumber)
            //result
            resolve({name, address, phoneNumber, career, groupKey});
        })
    });
}

async function getDataVinaBiz(district, id ,startIndex, endIndex) {
    let results = [];
    for(let pageNumber = startIndex; pageNumber <= endIndex; pageNumber ++) {
        const listCompanyLink = await getAllLink(district, id, pageNumber);
        for(let i = 0; i < listCompanyLink.length; i++) {
            const companyInformation = await getDetailByLink(listCompanyLink[i]);
            if(companyInformation) {
                results.push(companyInformation);
            }
        }
    }
    results = _.groupBy(results, item => item.groupKey)
    return results;
}

module.exports = { getDataVinaBiz }