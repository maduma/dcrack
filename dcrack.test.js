/* @jest-environment jsdom */

'use strict';

const dcrack = require('./dcrack.js');

const rack = document.createElement('div');

/**
 * @param {number} size_ru
 */
function check_selection(size_ru) {
    const target = rack.querySelector('#target');
    const free_rack_units = rack.querySelectorAll('.select');
    const result = dcrack.free_elements_adjoining(target, size_ru)
    expect(result).toStrictEqual(free_rack_units);
}

test('free unit for 1u', () => {
    rack.innerHTML = `
        <div class="free-ru">1</div>
        <div class="free-ru select" id="target">2</div>
        <div class="free-ru">3</div>
    `
    check_selection(1)
});

test('no free unit for 1u', () => {
    rack.innerHTML = `
        <div class="free-ru">1</div>
        <div id="target">2</div>
        <div class="free-ru">3</div>
        `
    check_selection(1)
});

test('free unit for 2ru', () => {
    rack.innerHTML = `
        <div></div>
        <div class="free-ru">1</div>
        <div class="free-ru select" id="target">2</div>
        <div class="free-ru select">3</div>
        <div></div>
        `
    check_selection(2)
});

test('no free unit for 3u, target not free', () => {
    rack.innerHTML = `
    <div></div>
    <div class="free-ru select">1</div>
    <div class="free-ru select" id="target">2</div>
    <div class="free-ru select">3</div>
    <div></div>
    `
    check_selection(3)
});

test('no free unit for 4u, target not free', () => {
    rack.innerHTML = `
    <div></div>
    <div class="free-ru select">1</div>
    <div class="free-ru select" id="target">2</div>
    <div class="free-ru select">3</div>
    <div class="free-ru select">4</div>
    <div></div>
    `
    check_selection(4)
});

test('no free unit for 5u, target not free', () => {
    rack.innerHTML = `
    <div></div>
    <div class="free-ru select">1</div>
    <div class="free-ru select">2</div>
    <div class="free-ru select" id="target">3</div>
    <div class="free-ru select">4</div>
    <div class="free-ru select">5</div>
    <div></div>
    `
    check_selection(5)
});

test('no free unit for 12u, target not free', () => {
    rack.innerHTML = `
    <div></div>
    <div class="free-ru select"></div>
    <div class="free-ru select"></div>
    <div class="free-ru select"></div>
    <div class="free-ru select"></div>
    <div class="free-ru select"></div>
    <div class="free-ru select" id="target"></div>
    <div class="free-ru select"></div>
    <div class="free-ru select"></div>
    <div class="free-ru select"></div>
    <div class="free-ru select"></div>
    <div class="free-ru select"></div>
    <div class="free-ru select"></div>
    <div></div>
    `
    check_selection(12)
});

test('no free unit for 2ru, overflow', () => {
    rack.innerHTML = `
        <div id="target">1</div>
    `
    check_selection(2)
});

test('no free unit for 3ru, overflow', () => {
    rack.innerHTML = `
        <div id="target">1</div>
    `
    check_selection(3)
});

test('no free unit for 2ru, adjacent', () => {
    rack.innerHTML = `
        <div class="free-ru" id="target">1</div>
        <div>2</div>
    `
    check_selection(2)
});

test('no free unit for 3ru, adjacent', () => {
    rack.innerHTML = `
        <div></div>
        <div class="free-ru" id="target"></div>
        <div class="free-ru"></div>
    `
    check_selection(3)
});

test('no free unit for 2ru, non-adjacent', () => {
    rack.innerHTML = `
        <div class="free-ru" id="target"></div>
        <div></div>
        <div class="free-ru"></div>
    `
    check_selection(2)
});

test('no free unit for 3ru, non-adjacent', () => {
    rack.innerHTML = `
        <div class="free-ru"></div>
        <div></div>
        <div class="free-ru" id="target"></div>
        <div class="free-ru"></div>
        <div></div>
        `
    check_selection(3)
});