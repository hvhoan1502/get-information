const request = require('request');


function getAll() {
    return new Promise((resolve, reject) => {
        request('http://thuonghieutoancau.vn/index.php?lang=vi&mod=search&op=company&codetax=&keys=&business=0&location=14&begin=&end=&p=2', (err, rq, body) => {
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
            return resolve(body);
        });
    })
}

async function getDataCompany() {
    const bodyDetail = await getAll();
    // for(let i = 0; i< 5; i++) {
    //     const body = await getDetailCompany('http://www.thongtincongty.com/thanh-pho-ho-chi-minh/quan-1/');
    //     list.push(1);
    // }
    return bodyDetail;
};

function info(data) {
    //name
    const firstIndexName = data.indexOf('"');
    const lastIndexName = data.indexOf('">');
    const link = data.substring(firstIndexName + 1, lastIndexName);

    return link;
}

getDataCompany().then(result => console.log(result));
