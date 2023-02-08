'use strict';

const SELECTED_CLASSNAME = 'private-use-class--this-element-is-selected';
const EMPTY_NODELIST = document.createElement('div').childNodes;
const DEFAULT_RACK_SIZE = 32;
const DEFAULT_RACK_CLASS = 'rack-32u';
const DEFAULT_RACK_UNIT_CLASS = 'equipment free-space size-1u';

/**
 * @param {Element} el
 * @param {number} size
 * @param {string} direction
 */
function selectFreeElements(el, size, direction, freeClassName) {
    const start = direction == 'previousElementSibling' ?  el : el.nextElementSibling;
    const limit = direction == 'previousElementSibling' ? Math.floor(size / 2) + 1 : Math.ceil(size / 2) - 1;
    for (let i = 0, e = start; i < limit; i++, e = e[direction]) {
        if (!e) { break; }
        if (e.classList.contains(freeClassName)) {
            e.classList.add(SELECTED_CLASSNAME);
        }
    }
}

/**
 * @param {Element} el
 * @param {number} size
 * @return {NodeList}
 */
function getFreeElementsAdjoining(el, size, freeClassName) {
    if (!el.parentNode) { return EMPTY_NODELIST; }
    selectFreeElements(el, size, 'previousElementSibling', freeClassName);
    selectFreeElements(el, size, 'nextElementSibling', freeClassName);
    const nodes = el.parentNode.querySelectorAll('.' + SELECTED_CLASSNAME);
    nodes.forEach(e => e.classList.remove(SELECTED_CLASSNAME)); 
    if (nodes.length != size) { return EMPTY_NODELIST; }
    return nodes;
}

const stringToClassList = classString => classString.split(' ').map(s => s.trim()).filter(s => s);
const getSizeFromEvent =  event => parseInt(event.dataTransfer.types.filter(s => s.startsWith('size-ru/'))[0].split('/')[1]);

/**
 * @param {number} nbr
 * @param {classList} rackUnitClassList
 */
function newRackUnit(rackUnitClassList, nbr) {
    const rackUnit = document.createElement('div');
    rackUnit.classList.add(...rackUnitClassList);
    rackUnit.setAttribute('rack-unit-nbr', nbr);
    rackUnit.innerHTML = DEFAULT_RACK_SIZE - nbr;
    rackUnit.addEventListener("dragover", event => {
        const size_ru = getSizeFromEvent(event);
        const elementList = getFreeElementsAdjoining(event.target, size_ru, 'free-space');
        if (!elementList.length) { return; }
        event.preventDefault();
        event.target.parentNode.childNodes.forEach(e => e.classList.remove('dragging'));
        elementList.forEach(e => e.classList.add('dragging'));
    });
    rackUnit.addEventListener("dragleave", event => {
        event.target.parentNode.childNodes.forEach(e => e.classList.remove('dragging'));
    });
    rackUnit.addEventListener("drop", event => {
        event.preventDefault();
        const id = event.dataTransfer.getData('id');
        const size_ru = getSizeFromEvent(event);
        const elementList = getFreeElementsAdjoining(event.target, size_ru, 'free-space');
        const equip = document.getElementById(id);
        const oldRackNbr = parseInt(equip.getAttribute('rack-unit-nbr'));
        const oldParent = equip.parentElement;
        for (let i = oldRackNbr; i < oldRackNbr + size_ru; i++) {
            const element = newRackUnit(rackUnitClassList, i);
            oldParent.insertBefore(element, equip);
        }
        const newNbr = elementList.item(0).getAttribute('rack-unit-nbr');
        equip.setAttribute('rack-unit-nbr', newNbr);
        event.target.parentNode.replaceChild(equip, elementList.item(0));
        elementList.forEach(e => e.remove());
    });
    return rackUnit;
}

/**
 * @param {data} any
 * @param {number} nbr
 * @return {Element}
 */
function newEquip(rackId, data, nbr) {
    const equipment = document.createElement('div');
    equipment.classList.add('equipment');
    equipment.classList.add('size-' + data.size_ru + 'u');
    equipment.setAttribute('draggable', true);
    equipment.setAttribute('rack-unit-nbr', nbr);
    equipment.setAttribute('size-ru', data.size_ru);
    if (data.image) {
        equipment.setAttribute('style', `background-image: url("images/${data.image}");`);
    }
    equipment.innerHTML = `<span title="${data.size_ru}U">${data.name}</span>`;
    equipment.id = `rack-${rackId}-${data.name}`;
    equipment.addEventListener("dragstart", event => {
        event.dataTransfer.setData("id", equipment.id);
        event.dataTransfer.setData(`size-ru/${data.size_ru}`, data.size_ru);
        event.dataTransfer.effectAllowed = 'move';
    });
    return equipment;
}

/**
 * @param {number} size
 * @param {string} rackClass
 * @param {string} rackUnitClass
 * @param {Array} rackData
 * @return {Element}
 */
function createRack(rackId, size, rackClass, rackUnitClass, data) {
    data.sort((a, b) => parseInt(a.position) - parseInt(b.position));
    const rack = document.createElement('div');
    rack.id = `rack-${rackId}`;
    const rackClassList = stringToClassList(rackClass);
    const rackUnitClassList = stringToClassList(rackUnitClass);
    rack.classList.add(...rackClassList);
    for (let i = 0; i < size; i++) {
        let element;
        if (data.length && data[0].position == i) {
            const equipmentData = data.shift();
            element = newEquip(rackId, equipmentData, i);
            i += equipmentData.size_ru - 1;
        } else {
            element = newRackUnit(rackUnitClassList, i);
        }
        rack.appendChild(element);
    }
    return rack;
}

/**
 * @param {Element} el
 * @param {string} tagName
 * @param {Map<String, any} data
 * @return {Element}
 */
function createRacks(el, tagName, asyncData) {
    const racks = el.querySelectorAll(tagName);
    racks.forEach(rack => {
        const rackId = rack.getAttribute('rack-id') || -1;
        asyncData(rackId).then(data => {
            const newRack = createRack(rackId, DEFAULT_RACK_SIZE, DEFAULT_RACK_CLASS, DEFAULT_RACK_UNIT_CLASS, data);
            rack.parentElement.replaceChild(newRack, rack)
        });
    });
}


/**
 * @param {Element} el
 * @param {Number} rackId
 */
function updateRack(el, rackId, asyncData) {
    const rack = el.getElementById(`rack-${rackId}`);
    asyncData(rackId).then(data => {
        const newRack = createRack(rackId, DEFAULT_RACK_SIZE, DEFAULT_RACK_CLASS, DEFAULT_RACK_UNIT_CLASS, data);
        rack.parentElement.replaceChild(newRack, rack)
    });
}

exports.getFreeElementsAdjoining = getFreeElementsAdjoining;
exports.EMPTY_NODELIST = EMPTY_NODELIST;
exports.createRacks = createRacks;
exports.updateRack = updateRack;
