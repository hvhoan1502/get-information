const request = require('request');

class API {
    static getAll() {
        return new Promise((resolve, reject) => {
            request('http://www.thongtincongty.com/thanh-pho-ho-chi-minh/quan-1/', (err, rq, body) => {
                if (err) return reject(err);
                return resolve(body);
            });
        });
    };
    
    static getDetailCompany(uri) {
        return new Promise((resolve, reject) => {
            request(uri, (err, rq, body) => {
                if (err) return reject(err);
                return resolve(body);
            });
        })
    }
    
    static async getDataCompany() {
        const results = [];
        const body = await getAll();
        const st1 = body.indexOf('<div class="search-results">');
        const st2 = body.indexOf('<ul class="pagination"> <li class="active">');
        let newBody = body.substring(st1 + 28, st2 - 50);
        newBody = newBody.trim();
        const infoArray = newBody.split('<div class="search-results">')
        infoArray.forEach(item => {
            const getElement = info(item);
            if (getElement) {
                const bodyDetail = await getDetailCompany(getElement);
                const firstIndex = bodyDetail.indexOf('jumbotron');
                const lastIndex = bodyDetail.indexOf('div align="center"><script async src');
                const data = bodyDetail.substring(firstIndex + 11, lastIndex);
                // name
                const firstIndexName = data.indexOf('CÔNG');
                const lastIndexName = data.indexOf('</span>');
                const name = data.substring(firstIndexName, lastIndexName);
                //address
                const firstIndexAddress = data.indexOf('Địa chỉ');
                const lastIndexAddress = data.indexOf('Minh<br/>');
                const address = data.substring(firstIndexAddress, lastIndexAddress + 4);
                //sdt link
                const firstIndexPhone = data.indexOf('Điện thoại: <img src=');
                const lastIndexPhone = data.indexOf('"><br/>');
                const linkPhone = data.substring(firstIndexPhone + 22, lastIndexPhone);
                // console.log({name, address, linkPhone});
                if (name && address && linkPhone) {
                    return {
                        name,
                        address,
                        linkPhone
                    };
                }
                results.push({
                    name,
                    address,
                    linkPhone
                });
            }
        });
        return results;
    };
    
    static info(data) {
        //name
        const firstIndexName = data.indexOf('"');
        const lastIndexName = data.indexOf('">');
        const link = data.substring(firstIndexName + 1, lastIndexName);
    
        return link;
    };
}

module.exports = {API}