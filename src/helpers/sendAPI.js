const request = require('request');

class API {
    static getListData(uri) {
        return new Promise((resolve, reject) => {
            request('http://www.thongtincongty.com/thanh-pho-ho-chi-minh/quan-1/', (error, req, body) => {
                if(error) {
                    Promise.reject(error);
                }
                Promise.resolve(body);
            });
        })
    }

    static getDetail(uri) {

    }
}

module.exports = {API}