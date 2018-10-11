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

function checkDistrict(address) {
    let groupByKey;
    if (address.includes('Quận 1,')) {
        groupByKey = 'Quan1';
    } else if(address.includes('Quận 2')) {
        groupByKey = 'Quan2';
    } else if(address.includes('Quận 3')) {
        groupByKey = 'Quan3';
    } else if(address.includes('Quận 4')) {
        groupByKey = 'Quan4';
    } else if(address.includes('Quận 5')) {
        groupByKey = 'Quan5';
    } else if(address.includes('Quận 6')) {
        groupByKey = 'Quan6';
    } else if(address.includes('Quận 7')) {
        groupByKey = 'Quan7';
    } else if(address.includes('Quận 8')) {
        groupByKey = 'Quan8';
    } else if(address.includes('Quận 9')) {
        groupByKey = 'Quan9';
    } else if(address.includes('Quận 10')) {
        groupByKey = 'Quan10';
    } else if(address.includes('Quận 11')) {
        groupByKey = 'Quan11';
    } else if(address.includes('Quận 12')) {
        groupByKey = 'Quan12';
    } else if(address.includes('Quận Gò Vấp')) {
        groupByKey = 'QuanGoVap';
    } else if(address.includes('Tân Bình')) {
        groupByKey = 'TanBinh';
    } else if(address.includes('Tân Phú')) {
        groupByKey = 'TanPhu';
    } else if(address.includes('Bình Thạnh')) {
        groupByKey = 'BinhThanh';
    } else if(address.includes('Phú Nhuân')) {
        groupByKey = 'PhuNhuan';
    } else if(address.includes('Thủ Đức')) {
        groupByKey = 'ThuDuc';
    } else if(address.includes('Bình Tân')) {
        groupByKey = 'BinhTan';
    } else if(address.includes('Củ Chi')) {
        groupByKey = 'HuyenCuChi';
    } else if(address.includes('Huyện Hóc Môn')) {
        groupByKey = 'HuyenHocMon';
    } else if(address.includes('Huyện Bình Chánh')) {
        groupByKey = 'HuyenBinhChanh';
    } else if(address.includes('Huyện Nhà Bè')) {
        groupByKey = 'HuyenNhaBe';
    } else if(address.includes('Huyện Cần Giờ')) {
        groupByKey = 'HuyenCanGio';
    }
    return groupByKey;
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
            // const groupKey = checkDistrict(address);
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