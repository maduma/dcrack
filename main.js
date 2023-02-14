const dcrack = require('./dcrack.js');

async function asyncLocalDataHttp(rackId) {
    const response = await fetch(`data_${rackId}.json`);
    const data = await response.json();
    return data;
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

const loadButtons = document.querySelectorAll('button.load');
loadButtons.forEach(button => {
    const rackId = button.getAttribute('rack-id');
    button.addEventListener('click', ev => {
        dcrack.loadRack(rackId);
        button.parentNode.querySelectorAll('button').forEach(b => b.disabled = true);
    });
    button.addEventListener(`rack-${rackId}-changed`, ev => {
        ev.target.disabled = false;
    });
})

const saveButtons = document.querySelectorAll('button.save');
saveButtons.forEach(button => {
    const rackId = button.getAttribute('rack-id');
    button.addEventListener('click', ev => {
        dcrack.saveRack(rackId);
        button.parentNode.querySelectorAll('button').forEach(b => b.disabled = true);
    });
    button.addEventListener(`rack-${rackId}-changed`, ev => {
        ev.target.disabled = false;
    });
})

dcrack.config.event_dispatch_selector = 'button';
dcrack.config.asyncGetData = asyncLocalDataHttp;
dcrack.config.asyncPostData = asyncPostRemoteDataHttp;
dcrack.createRacks(document, 'rack');