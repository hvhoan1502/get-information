const request = require('request');
const _ = require('lodash');

function getAllLink(pageNumber) {
    return new Promise((resolve, reject) => {
        request(`http://doanhnghiep.baothuongmai.com.vn/TP-Ho-Chi-Minh/page-${pageNumber}/`, (err, response, body) => {
            if (err) return reject('Error');
            body = body.trim();
            const firstIndex = body.indexOf('<div class="item">');
            const lastIndex = body.indexOf('<!-- Pagination -->');
            body = body.substring(firstIndex + 18, lastIndex);
            body =body.split('<div class="item">');
            for(let i = 0; i < body.length; i++) {
                let item = body[i];
                const firstIndexLink = item.indexOf('<a href=');
                const lastIndexLink = item.indexOf('.html">');
                item = item.substring(firstIndexLink + 9, lastIndexLink + 5);
                body[i] = item;
            }
            resolve(body);
        });
    });
}

function getDetailByLink(uri) {
    return new Promise((resolve, reject) => {
        request(uri, (err, response, body) => {
            if (err) return reject(err);
            //name
            const firstIndexName = body.indexOf('<strong>');
            const lastIndexName = body.indexOf('</strong>');
            const name = body.substring(firstIndexName + 8, lastIndexName);
            //Check status is active or not
            const firIndexStatus = body.indexOf('Người nộp');
            const lastIndexStatus = body.indexOf('ĐKT');
            if (firIndexStatus === -1 || lastIndexStatus === -1) {
                return resolve(null);
            }
            // address
            let index = body.indexOf('Địa chỉ trụ sở');
            body = body.substring(index + 19);
            const firstIndexAddress = body.indexOf('<td>');
            const lastIndexAddress = body.indexOf('(<a');
            let address = body.substring(firstIndexAddress + 4, lastIndexAddress);
            // group by key address
            let firstKeyIndex = body.indexOf('Quận');;
            const lastKeyIndex = body.indexOf(', TP Hồ Chí Minh');
            if(firstKeyIndex > lastKeyIndex) {
                firstKeyIndex = body.indexOf('Huyện');
            }
            const groupKey = body.substring(firstKeyIndex, lastKeyIndex);
            // phone number
            index = body.indexOf('Điện thoại');
            body = body.substring(index + 14);
            const firstIndexPhoneNumber = body.indexOf('<td>');
            const lastIndexPhoneNumber = body.indexOf('</td>');
            if(firstIndexPhoneNumber + 4 === lastIndexPhoneNumber) {
                return resolve(null);
            }
            const phoneNumber = body.substring(firstIndexPhoneNumber + 4, lastIndexPhoneNumber)
            // Career
            index = body.indexOf('Ngành nghề kinh doanh');
            body = body.substring(index);
            const firsrIndexCareer = body.indexOf('<td>');
            const lastIndexCareer = body.indexOf('<strong>');
            const career = body.substring(firsrIndexCareer + 4, lastIndexCareer);
            //result
            resolve({name, address, phoneNumber, career, groupKey});
        })
    });
}

async function getData(startIndex, endIndex) {
    let results = [];
    for(let pageNumber = startIndex; pageNumber <= endIndex; pageNumber ++) {
        const listCompanyLink = await getAllLink(pageNumber);
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

module.exports = { getData }