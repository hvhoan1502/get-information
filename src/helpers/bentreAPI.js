const request = require('request');


async function getAll(pageIndex) {
    return new Promise((resolve, reject) => {
        request(`http://www.thongtincongty.com/tinh-ben-tre/?page=` + pageIndex, (err, rq, body) => {
            if (err) return reject(err);
            let results = [];
            const st1 = body.indexOf('<div class="search-results">');
            const st2 = body.indexOf('<ul class="pagination"> <li');
            let newBody = body.substring(st1 + 28, st2 - 50);
            newBody = newBody.trim();
            const infoArray = newBody.split('<div class="search-results">');
            for (let i = 0; i < infoArray.length; i++) {
                const item = infoArray[i];
                const getElement = info(item);
                if (getElement) {
                    results.push(getElement);
                }
            }
            resolve(results);
        });
    });
};

function info(data) {
    //name
    const firstIndexName = data.indexOf('"');
    const lastIndexName = data.indexOf('">');
    const link = data.substring(firstIndexName + 1, lastIndexName);

    return link;
};

async function getDetailCompany(uri) {
    return new Promise((resolve, reject) => {
        request(uri, (err, rq, body) => {
            if (err) return reject(err);
            const firstIndex = body.indexOf('jumbotron');
            const lastIndex = body.indexOf('div align="center"><script async src');
            let data = body.substring(firstIndex + 11, lastIndex);
            // name
            let firstIndexName = data.indexOf('>CÔNG');
            let lastIndexName = data.indexOf('</span>');
            let name = data.substring(firstIndexName + 1, lastIndexName);
            if (name.includes('<h4>')) {
                firstIndexName = name.indexOf('<span title="');
                name = name.substring(firstIndexName + 13);
                lastIndexName = name.indexOf('">');
                name = name.substring(0, lastIndexName);
            }
            //address
            const firstIndexAddress = data.indexOf('Địa chỉ');
            const lastIndexAddress = data.indexOf('Tre<br/>');
            const address = data.substring(firstIndexAddress, lastIndexAddress + 3);
            // ndd
            data = data.substring(lastIndexAddress + 5);
            const firstIndexMaster = data.indexOf('Đại diện pháp luật');
            const lastIndexMaster = data.indexOf('<br/> ');
            const master = data.substring(firstIndexMaster, lastIndexMaster);
            //sdt link
            const firstIndexPhone = data.indexOf('Điện thoại: <img src=');
            const lastIndexPhone = data.indexOf('"><br/>');
            let linkPhone;
            if (firstIndexPhone !== -1 && lastIndexPhone !== -1) {
                linkPhone = data.substring(firstIndexPhone + 22, lastIndexPhone);
            }
            // console.log({name, address, linkPhone});
            if (name && address && linkPhone) {
                resolve({
                    name,
                    address,
                    linkPhone,
                    master
                });
            }
            resolve(null);
        });
    })
}



async function getDataCompanyBenTre(startPages, endPages) {
    let results = [];
    let body = [];

    try {
        for(let i = startPages; i <= endPages; i++) {
            const result = await getAll(i);
            if (result.length) {
                results = results.concat(result);
            }
        }

        for (let item = 0; item < results.length; item ++) {
            const bodyDetail = await getDetailCompany(results[item]);
            if(bodyDetail) {
                body.push(bodyDetail);
            }
                
        }
        return body;
    } catch(err) {
        throw new Error('Bị lỗi');
    }
};

module.exports = {
    getDataCompanyBenTre
}