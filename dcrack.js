'use strict';

const FREE_RU_CLASSNAME = 'free-ru';
const SELECTION_CLASSNAME = 'selected_rack_unit';

/**
 * @param {Element} el
 */
function select_free_ru(el) {
    if (el.classList.contains(FREE_RU_CLASSNAME)) {
        el.classList.add(SELECTION_CLASSNAME);
    }
}

/**
 * @param {Element} el
 * @param {number} size
 * @return {NodeList}
 */
function free_rack_units_around(el, size) {
    // previous siblings
    for (let i = 0, e = el.previousElementSibling; i < Math.ceil(size / 2) - 1; i++, e = e.previousElementSibling) {
        if (!e) { break; }
        select_free_ru(e);
    }
    // me and next siblings
    for (let i = 0, e = el; i < Math.floor(size / 2) + 1; i++, e = e.nextElementSibling) {
        if (!e) { break; }
        select_free_ru(e);
    }
    let nodes = el.parentNode.querySelectorAll('.' + SELECTION_CLASSNAME);
    const count = nodes.length;
    if (count != size) {
        nodes = document.createElement('div').childNodes; // empty nodeList
    }
    nodes.forEach(e => e.classList.remove(SELECTION_CLASSNAME));
    return nodes;
}

exports.free_rack_units_around = free_rack_units_around;
