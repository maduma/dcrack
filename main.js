const dcrack = require('./modules/dcrack.js');

/**
 * @param {Array} data
 */
function justStack(data) {
    let start = 0;
    data.forEach(d => {
        d.position = start
        start += d.size_ru;
    });
}

async function asyncDataHttp(rackId) {
    const response = await fetch('data.json');
    const data = await response.json();
    data.sort((a, b) => a.name.localeCompare(b.name));
    justStack(data)
    return data;
}

async function noData(rackId) {
    return []
}

dcrack.createRacks(document, 'rack', asyncDataHttp);

const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    const rackId = parseInt(button.getAttribute('rack-id'));
    button.addEventListener('click', ev => {
        dcrack.updateRack(document, rackId, asyncDataHttp);
    })
})