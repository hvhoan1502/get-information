const request = require('request');


function getAll() {
    return new Promise((resolve, reject) => {
        request('http://www.thongtincongty.com/thanh-pho-ho-chi-minh/quan-1/', (err, rq, body) => {
            if (err) return reject(err);
            return resolve(body);
        });
    })
}

function getDetailCompany(uri) {
    return new Promise((resolve, reject) => {
        request(uri, (err, rq, body) => {
            if (err) return reject(err);
            return resolve(body);
        });
    })
}

async function getDataCompany() {
    const results = [1, 2, 3, 4, 5];
    let list = [];
    const bodyDetail = await getAll();
    for(let i = 0; i< 5; i++) {
        const body = await getDetailCompany('http://www.thongtincongty.com/thanh-pho-ho-chi-minh/quan-1/');
        list.push(1);
    }
    return list;
};

function info(data) {
    //name
    const firstIndexName = data.indexOf('"');
    const lastIndexName = data.indexOf('">');
    const link = data.substring(firstIndexName + 1, lastIndexName);

    return link;
}

getDataCompany().then(result => console.log(result));

// function Tinh() {
//     return new Promise((resolve, reject) => {
//         request('http://www.thongtincongty.com/thanh-pho-ho-chi-minh/quan-1/',(err, rq, body) => {
//             if(err) return reject(err);
//             return resolve(body);
//         });
//     }) 
// }

// async function result() {
//     const a = await Tinh();
//     // console.log(a);
//     return a;
// }

// result().then(a => console.log(a));