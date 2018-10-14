const request = require('request');


function getAll(district, pageIndex) {
    return new Promise((resolve, reject) => {
        request(`http://www.thongtincongty.com/thanh-pho-ho-chi-minh/${district}/?page=${pageIndex}`, (err, rq, body) => {
            if (err) return reject(err);
            resolve(body);
        });
    });
};

function getDetailCompany(uri) {
    return new Promise((resolve, reject) => {
        request(uri, (err, rq, body) => {
            if (err) return reject(err);
            resolve(body);
        });
    })
}

function info(data) {
    //name
    const firstIndexName = data.indexOf('"');
    const lastIndexName = data.indexOf('">');
    const link = data.substring(firstIndexName + 1, lastIndexName);

    return link;
};

class API {
    static async getDataCompany(district, startPages, endPages) {
        const results = [];
        for(let i = startPages; i <= endPages; i++) {
            try {
                const body = await getAll(district, i);
                const st1 = body.indexOf('<div class="search-results">');
                const st2 = body.indexOf('<ul class="pagination"> <li');
                let newBody = body.substring(st1 + 28, st2 - 50);
                newBody = newBody.trim();
                const infoArray = newBody.split('<div class="search-results">')
    
                for (let i = 0; i < infoArray.length; i++) {
                    const item = infoArray[i];
                    const getElement = info(item);
                    if (getElement) {
                        const bodyDetail = await getDetailCompany(getElement);
                        const firstIndex = bodyDetail.indexOf('jumbotron');
                        const lastIndex = bodyDetail.indexOf('div align="center"><script async src');
                        let data = bodyDetail.substring(firstIndex + 11, lastIndex);
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
                        const lastIndexAddress = data.indexOf('Minh<br/>');
                        const address = data.substring(firstIndexAddress, lastIndexAddress + 4);
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
                            results.push({
                                name,
                                address,
                                linkPhone,
                                master
                            });
                        }
                        
                    }
                }
            } catch(err) {
                throw new Error('Bị lỗi');
            }
        }
        return results;
    };
}

module.exports = {
    API
}