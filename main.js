const dcrack = require('./modules/dcrack.js');

const rackData = [
    {"name": "t52ffe01", "size_ru": 3, "position": 0},
    {"name": "bro01-01", "size_ru": 1, "position": 3},
    {"name": "bro01-02", "size_ru": 1, "position": 4},
    {"name": "s72hrs01", "size_ru": 2, "position": 5},
    {"name": "v5200-1", "size_ru": 1, "position": 7},
    {"name": "t52ffe02", "size_ru": 3, "position": 12},
]

rackData.sort((a, b) => a.position < b.position);

dcrack.createRacks(document, 'rack', {"rackData": rackData});

//validate data with rack size
//insert equipement in rack