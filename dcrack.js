'use strict';

const config = {
    DEFAULT_RACK_SIZE: 42,
    DEFAULT_RACK_CLASS: 'rack-42u',
    DEFAULT_RACK_UNIT_CLASS: 'equipment free-space size-1u',
    DEFAULT_FREE_CLASS: 'free-space',
    DRAGGING_CLASSNAME: 'dragging',
    event_dispatch_selector: null,
    asyncGetData: async rackId => [],
    asyncPostData: async (rackId, data) => [],
}

const SELECTED_CLASSNAME = 'private-use-class--this-element-is-selected';
const EMPTY_NODELIST = document.createElement('div').childNodes;

const stringToClassList = (classString, suffix) => classString.split(' ').map(s => s.trim() + (suffix ? `-${suffix}` : '')).filter(s => s);
const getSizeFromEvent =  event => parseInt(event.dataTransfer.types.filter(s => s.startsWith('size-ru/'))[0].split('/')[1]);

function createUuid() {
    const now = Date.now();
    const randomNumber = Math.random() * 10 ** 6; 
    return `${now}-${randomNumber.toString(16)}`;
}

function selectFreeElements(el, size, direction) {
    const start = direction == 'previousElementSibling' ?  el : el.nextElementSibling;
    const limit = direction == 'previousElementSibling' ? Math.floor(size / 2) + 1 : Math.ceil(size / 2) - 1;
    for (let i = 0, e = start; i < limit; i++, e = e[direction]) {
        if (!e) { break; }
        if (e.classList.contains(config.DEFAULT_FREE_CLASS)) {
            e.classList.add(SELECTED_CLASSNAME);
        }
    }
}

function getFreeElementsAdjoining(el, size) {
    if (!el.parentNode) { return EMPTY_NODELIST; }
    selectFreeElements(el, size, 'previousElementSibling');
    selectFreeElements(el, size, 'nextElementSibling');
    const nodes = el.parentNode.querySelectorAll('.' + SELECTED_CLASSNAME);
    nodes.forEach(e => e.classList.remove(SELECTED_CLASSNAME)); 
    if (nodes.length != size) { return EMPTY_NODELIST; }
    return nodes;
}

function dragoverHandler(event) {
    const size_ru = getSizeFromEvent(event);
    const elementList = getFreeElementsAdjoining(event.target, size_ru);
    if (!elementList.length) { return; }
    event.preventDefault();
    event.target.parentNode.childNodes.forEach(e => e.classList.remove(config.DRAGGING_CLASSNAME));
    elementList.forEach(e => e.classList.add(config.DRAGGING_CLASSNAME));
}

function dropHandler(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('id');
    const size_ru = getSizeFromEvent(event);
    const elementList = getFreeElementsAdjoining(event.target, size_ru);
    const equip = document.getElementById(id);
    const oldRackNbr = parseInt(equip.getAttribute('rack-unit-nbr'));
    const oldParent = equip.parentElement;
    for (let i = oldRackNbr; i < oldRackNbr + size_ru; i++) {
        const element = newRackUnit(i);
        oldParent.insertBefore(element, equip);
    }
    const newNbr = elementList.item(0).getAttribute('rack-unit-nbr');
    equip.setAttribute('rack-unit-nbr', newNbr);
    const oldRackId = oldParent.id
    const newRackId = event.target.parentNode.id
    event.target.parentNode.replaceChild(equip, elementList.item(0));
    elementList.forEach(e => e.remove());
    const changedEvent1 = new Event(`${oldRackId}-changed`);
    const changedEvent2 = new Event(`${newRackId}-changed`);
    document.querySelectorAll(config.event_dispatch_selector).forEach(e => {
        e.dispatchEvent(changedEvent1);
        e.dispatchEvent(changedEvent2);
    });
}

function newRackUnit(position) {
    const rackUnit = document.createElement('div');
    const rackUnitClassList = stringToClassList(config.DEFAULT_RACK_UNIT_CLASS)
    rackUnit.classList.add(...rackUnitClassList);
    rackUnit.setAttribute('rack-unit-nbr', position);
    rackUnit.innerHTML = position;
    rackUnit.addEventListener("dragover", dragoverHandler);
    rackUnit.addEventListener("drop", dropHandler);
    rackUnit.addEventListener("dragleave", event => {
        event.target.parentNode.childNodes.forEach(e => e.classList.remove(config.DRAGGING_CLASSNAME));
    });
    return rackUnit;
}

function newEquip(data, position) {
    const equipment = document.createElement('div');
    equipment.classList.add('equipment');
    equipment.classList.add('size-' + data.size_ru + 'u');
    equipment.setAttribute('draggable', true);
    equipment.setAttribute('equipment-id', data.id);
    equipment.setAttribute('rack-unit-nbr', position);
    equipment.setAttribute('size-ru', data.size_ru);
    if (data.image) {
        equipment.setAttribute('style', `background-image: url("${data.image}");`);
    }
    equipment.innerHTML = `<span title="${data.size_ru}U">${data.name}</span>`;
    equipment.id = `equipment-${createUuid()}`;
    equipment.addEventListener("dragstart", event => {
        event.dataTransfer.setData("id", equipment.id);
        event.dataTransfer.setData(`size-ru/${data.size_ru}`, data.size_ru);
        event.dataTransfer.effectAllowed = 'move';
    });
    return equipment;
}

function createRack(rackId, size, class_suffix, data) {
    const rack = document.createElement('div');
    const rackClassList = stringToClassList(config.DEFAULT_RACK_CLASS, class_suffix);
    
    rack.id = `rack-${rackId}`;
    rack.setAttribute('size-ru', size);
    rack.setAttribute('rack-id', rackId);
    rack.classList.add(...rackClassList);

    data.sort((a, b) => parseInt(a.position) - parseInt(b.position));
    for (let pos = 0; pos < size; pos++) {
        let element;
        if (data.length && data[0].position == pos) {
            const equipmentData = data.shift();
            element = newEquip(equipmentData, pos);
            pos += equipmentData.size_ru - 1;
        } else {
            element = newRackUnit(pos);
        }
        rack.appendChild(element);
    }
    return rack;
}

async function createRacks(element, tagName) {
    const shadowRacks = element.querySelectorAll(tagName);
    shadowRacks.forEach(shadowRack => {
        const rackId = shadowRack.getAttribute('rack-id');
        const size_ru = shadowRack.getAttribute('size-ru') || config.DEFAULT_RACK_SIZE
        const class_suffix = shadowRack.getAttribute('rack-class-suffix');
        return config.asyncGetData(rackId).then(data => {
            const rack = createRack(rackId, size_ru, class_suffix, data);
            shadowRack.parentElement.replaceChild(rack, shadowRack)
        });
    });
}

async function loadRack(rackId) {
    const rack = document.getElementById(`rack-${rackId}`);
    const size_ru = rack.getAttribute('size-ru');
    const class_suffix = rack.getAttribute('rack-class-suffix');
    return config.asyncGetData(rackId).then(data => {
        const newRack = createRack(rackId, size_ru, class_suffix, data);
        rack.parentElement.replaceChild(newRack, rack)
    });
}

async function saveRack(rackId) {
    const rack = document.getElementById(`rack-${rackId}`);
    const equipments = rack.querySelectorAll("[equipment-id]");
    const rackData = [];
    equipments.forEach(e => {
        rackData.push({
            "id": e.getAttribute('equipment-id'),
            "position": e.getAttribute('rack-unit-nbr'),
        });
    });
    return config.asyncPostData(rackId, rackData);
}

exports.EMPTY_NODELIST = EMPTY_NODELIST;
exports.config = config;
exports.getFreeElementsAdjoining = getFreeElementsAdjoining;
exports.createRacks = createRacks;
exports.loadRack = loadRack;
exports.saveRack = saveRack;

