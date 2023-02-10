const dcrack = require('./modules/dcrack.js');

async function asyncLocalDataHttp(rackId) {
    const response = await fetch('data.json');
    const data = await response.json();
    return data[rackId];
}

async function noData(rackId) {
    return []
}

async function asyncGetRemoteDataHttp(rackId) {
    // const response = await fetch(`https://itops.int.hs.lu/inventory/rack/${rackId}/json/`);
    const response = await fetch(`http://127.0.0.1:8000/inventory/rack/${rackId}/json/`);
    const data = await response.json();
    return data;
}

async function asyncPostRemoteDataHttp(rackId, data) {
    const response = await fetch(
        `http://127.0.0.1:8000/inventory/rack/${rackId}/json/`,
        {method: 'POST', body: JSON.stringify(data)});
    data = await response.json();
    return data;
}

dcrack.createRacks(document, 'rack', asyncGetRemoteDataHttp);

const loadButtons = document.querySelectorAll('button.load');
loadButtons.forEach(button => {
    const rackId = button.getAttribute('rack-id');
    button.addEventListener('click', ev => {
        dcrack.loadRack(document, rackId, asyncGetRemoteDataHttp);
    })
})

const saveButtons = document.querySelectorAll('button.save');
saveButtons.forEach(button => {
    const rackId = button.getAttribute('rack-id');
    button.addEventListener('click', ev => {
        dcrack.saveRack(document, rackId, asyncPostRemoteDataHttp);
    })
})