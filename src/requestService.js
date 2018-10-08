// const request = require('request'); 
var request = require('request-promise');

async function getAllData() {
    let allResults = [];
    await request('http://www.thongtincongty.com/thanh-pho-ho-chi-minh/quan-1/')
    .then(body => {
        const st1 = body.indexOf('<div class="search-results">')
        const st2 = body.indexOf('<ul class="pagination"> <li class="active">');
        let newBody = body.substring(st1 + 28, st2 - 50);
        newBody = newBody.trim();
        const infoArray = newBody.split('<div class="search-results">')
        await infoArray.forEach(item => {
            const getElement = info(item);
            if(getElement) {
                request(getElement)
                .then(bodyDetail => {
                    const firstIndex = bodyDetail.indexOf('jumbotron');
                    const lastIndex = bodyDetail.indexOf('div align="center"><script async src');
                    const data = bodyDetail.substring(firstIndex + 11, lastIndex);
                    // name
                    const firstIndexName = bodyDetail.indexOf('CÔNG');
                    const lastIndexName = bodyDetail.indexOf('</span>');
                    const name = bodyDetail.substring(firstIndexName, lastIndexName);
                    //address
                    const firstIndexAddress = bodyDetail.indexOf('Địa chỉ');
                    const lastIndexAddress = bodyDetail.indexOf('Minh<br/>');
                    const address = bodyDetail.substring(firstIndexAddress, lastIndexAddress + 4);
                    //sdt link
                    const firstIndexPhone = bodyDetail.indexOf('Điện thoại: <img src=');
                    const lastIndexPhone = bodyDetail.indexOf('"><br/>');
                    const linkPhone = bodyDetail.substring(firstIndexPhone + 22, lastIndexPhone);
                    // console.log({name, address, linkPhone});
                    if(name && address && linkPhone) {
                        return {name, address, linkPhone};
                    }
                    allResults.push({name, address, linkPhone})
                    console.log({name, address, linkPhone});
                })
            }
        });
        console.log(allResults)
    })
    return allResults;
};

function info(data) {
    //name
    const firstIndexName = data.indexOf('"');
    const lastIndexName = data.indexOf('">');
    const link = data.substring(firstIndexName + 1, lastIndexName);

    return link;
}


// console.log(getAllData());

// module.exports = {getAllData}