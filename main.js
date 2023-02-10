const dcrack = require('./modules/dcrack.js');

async function asyncLocalDataHttp(rackId) {
    const response = await fetch('data.json');
    const data = await response.json();
    return data[rackId];
}

async function noData(rackId) {
    return []
}

async function asyncRemoteDataHttp(rackId) {
    const response = await fetch(`https://itops.int.hs.lu/inventory/rack/${rackId}/json/`);
    const data = await response.json();
    return data;
}

dcrack.createRacks(document, 'rack', asyncLocalDataHttp);

const loadButtons = document.querySelectorAll('button.load');
loadButtons.forEach(button => {
    const rackId = button.getAttribute('rack-id');
    button.addEventListener('click', ev => {
        dcrack.updateRack(document, rackId, asyncLocalDataHttp);
    })
})