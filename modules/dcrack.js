'use strict';

const SELECTED_CLASSNAME = 'private-use-class--this-element-is-selected';
const EmptyNodeList = document.createElement('div').childNodes;

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
    if (!el.parentNode) { return EmptyNodeList; }
    selectFreeElements(el, size, 'previousElementSibling', freeClassName);
    selectFreeElements(el, size, 'nextElementSibling', freeClassName);
    const nodes = el.parentNode.querySelectorAll('.' + SELECTED_CLASSNAME);
    if (nodes.length != size) { return EmptyNodeList; }
    nodes.forEach(e => e.classList.remove(SELECTED_CLASSNAME));
    return nodes;
}

exports.getFreeElementsAdjoining = getFreeElementsAdjoining;
exports.EmptyNodeList = EmptyNodeList;
