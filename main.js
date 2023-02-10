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
    const response = await fetch(`https://itops.int.hs.lu/inventory/rack/${rackId}/json/`);
    // const response = await fetch('data.json');
    const data = await response.json();
    data.sort((a, b) => a.name.localeCompare(b.name));
    justStack(data)
    return data;
}

async function noData(rackId) {
    return []
}

dcrack.createRacks(document, 'rack', asyncDataHttp);

const loadButtons = document.querySelectorAll('button.load');
loadButtons.forEach(button => {
    const rackId = button.getAttribute('rack-id');
    button.addEventListener('click', ev => {
        dcrack.updateRack(document, rackId, asyncDataHttp);
    })
})