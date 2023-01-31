const dcrack = require('./modules/dcrack.js');

const rackData = [
    {"name": "t52ffe01", "size_ru": 3, "position": 0, "image": "sun-server-t5-2.gif"},
    {"name": "t52ffe02", "size_ru": 3, "position": 4, "image": "sun-server-t5-2.gif"},
    {"name": "bro01-01", "size_ru": 1, "position": 8, "image": "brocade.gif"},
    {"name": "bro01-02", "size_ru": 1, "position": 10, "image": "brocade.gif"},
    {"name": "bro02-01", "size_ru": 1, "position": 12, "image": "brocade.gif"},
    {"name": "bro02-02", "size_ru": 1, "position": 14, "image": "brocade.gif"},
    {"name": "s72hrs01", "size_ru": 2, "position": 16, "image": "s7-2l.gif"},
    {"name": "s72hrs02", "size_ru": 2, "position": 19, "image": "s7-2l.gif"},
    {"name": "v5200-1", "size_ru": 1, "position": 22, "image": "v5200.gif"},
    {"name": "v5200-2", "size_ru": 1, "position": 24, "image": "v5200.gif"},
]

rackData.sort((a, b) => a.position < b.position);

dcrack.createRacks(document, 'rack', {"rackData": rackData});

//validate data with rack size
//insert equipement in rack