'use strict';

const FREE_CLASSNAME = 'free-ru';
const SELECTED_CLASSNAME = 'selected_free_element';

/**
 * @param {Element} el
 * @param {number} size
 * @param {string} direction
 */
function select_free_elements(el, size, direction) {
    const start = direction == 'previousElementSibling' ?  el.previousElementSibling : el
    const limit = direction == 'previousElementSibling' ? Math.ceil(size / 2) - 1 : Math.floor(size / 2) + 1
    for (let i = 0, e = start; i < limit; i++, e = e[direction]) {
        if (!e) { break; }
        if (e.classList.contains(FREE_CLASSNAME)) {
            e.classList.add(SELECTED_CLASSNAME);
        }
    }
}

/**
 * @param {Element} el
 * @param {number} size
 * @return {NodeList}
 */
function free_elements_adjoining(el, size) {
    select_free_elements(el, size, 'previousElementSibling')
    select_free_elements(el, size, 'nextElementSibling')
    const nodes = el.parentNode.querySelectorAll('.' + SELECTED_CLASSNAME);
    if (nodes.length != size) {
        return document.createElement('div').childNodes; // create empty nodeList
    }
    nodes.forEach(e => e.classList.remove(SELECTED_CLASSNAME));
    return nodes;
}

exports.free_elements_adjoining = free_elements_adjoining;
