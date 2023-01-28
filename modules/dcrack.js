'use strict';

const SELECTED_CLASSNAME = 'private-use-class--this-element-is-selected';
const EMPTY_NODELIST = document.createElement('div').childNodes;
const DEFAULT_RACK_SIZE = 42;
const DEFAULT_RACK_CLASSES = 'rack-42u equipement free-space size-1u';

/**
 * @param {Element} el
 * @param {number} size
 * @param {string} direction
 */
function selectFreeElements(el, size, direction, freeClassName) {
    const start = direction == 'previousElementSibling' ?  el.previousElementSibling : el;
    const limit = direction == 'previousElementSibling' ? Math.ceil(size / 2) - 1 : Math.floor(size / 2) + 1;
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
    if (nodes.length != size) { return EMPTY_NODELIST; }
    nodes.forEach(e => e.classList.remove(SELECTED_CLASSNAME));
    return nodes;
}

/**
 * @param {number} size
 * @param {string} classes
 */
function createRack(size, classes) {
    const rack = document.createElement('div');
    const classesList = classes.split(' ').map(s => s.trim()).filter(s => s);
    rack.classList.add(classesList[0]);
    for (let i = size; i > 0; i--) {
        const rackUnit = document.createElement('div');
        rackUnit.classList.add(...classesList.slice(1));
        rackUnit.innerHTML = i;
        rack.appendChild(rackUnit);
    }
    return rack;
}

/**
 * @param {Element} el
 * @param {string} tagName
 * @return {Element}
 */
function createRacks(el, tagName) {
    const racks = el.querySelectorAll(tagName);
    racks.forEach(rack => {
        const size = rack.getAttribute('size') || DEFAULT_RACK_SIZE;
        let classes = rack.getAttribute('custom-class') || DEFAULT_RACK_CLASSES;
        classes += ' ' + rack.getAttribute('class');
        const newRack = createRack(size, classes);
        rack.parentElement.replaceChild(newRack, rack)
    });
}

exports.getFreeElementsAdjoining = getFreeElementsAdjoining;
exports.EMPTY_NODELIST = EMPTY_NODELIST;
exports.createRacks = createRacks;
