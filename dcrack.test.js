/* @jest-environment jsdom */

'use strict';

const dcrack = require('./dcrack.js');
dcrack.config.DEFAULT_FREE_CLASS = 'free';

function checkResult(html, size) {
    const container = document.createElement('div');
    container.innerHTML = html;
    const target = container.querySelector('#target');
    const result = dcrack.getFreeElementsAdjoining(target, size);
    const selection = container.querySelectorAll('.select');
    expect(result).toStrictEqual(selection);
}

test('free unit for 1u', () => {
    checkResult(`
        <div class="free"></div>
        <div class="free select" id="target"></div>
        <div class="free"></div>
        `, 1);
});

test('no free unit for 1u', () => {
    checkResult(`
        <div class="free"></div>
        <div id="target"></div>
        <div class="free"></div>
        `, 1);
});

test('free unit for 2ru', () => {
    checkResult(`
        <div></div>
        <div class="free select"></div>
        <div class="free select" id="target"></div>
        <div class="free"></div>
        <div></div>
        `, 2);
});

test('no free unit for 3u, target not free', () => {
    checkResult(`
        <div></div>
        <div class="free select"></div>
        <div class="free select" id="target"></div>
        <div class="free select"></div>
        <div></div>
        `, 3);
});

test('no free unit for 4u, target not free', () => {
    checkResult(`
        <div></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select" id="target"></div>
        <div class="free select"></div>
        <div></div>
        `, 4);
});

test('no free unit for 5u, target not free', () => {
    checkResult(`
        <div></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select" id="target"></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div></div>
        `, 5);
});

test('no free unit for 12u, target not free', () => {
    checkResult(`
        <div></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select" id="target"></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div class="free select"></div>
        <div></div>
        `, 12);
});

test('no free unit for 2ru, overflow', () => {
    checkResult(`
        <div id="target"></div>
        `, 2);
});

test('no free unit for 3ru, overflow', () => {
    checkResult(`
        <div id="target"></div>
        `, 3);
});

test('no free unit for 2ru, adjacent', () => {
    checkResult(`
        <div class="free" id="target"></div>
        <div></div>
        `, 2);
});

test('no free unit for 3ru, adjacent', () => {
    checkResult(`
        <div></div>
        <div class="free" id="target"></div>
        <div class="free"></div>
        `, 3);
});

test('no free unit for 2ru, non-adjacent', () => {
    checkResult(`
        <div class="free" id="target"></div>
        <div></div>
        <div class="free"></div>
        `, 2);
});

test('no free unit for 3ru, non-adjacent', () => {
    checkResult(`
        <div class="free"></div>
        <div></div>
        <div class="free" id="target"></div>
        <div class="free"></div>
        <div></div>
        `, 3);
});

test('target as no parent element', () => {
    const target = document.createElement('div');
    const result = dcrack.getFreeElementsAdjoining(target, 2);
    expect(result).toStrictEqual(dcrack.EMPTY_NODELIST);
});

test('create a rack', () => {
    const target = document.createElement('div');
    target.innerHTML = '<tableau rack-id="1" size-ru="2"></tableau>';
    dcrack.createRacks(target, 'tableau').then(data => {
        const expected = document.createElement('div');
        expected.innerHTML = `<div class="rack-42u" id="rack-1" rack-id="1" size-ru="2"><div class="equipment free-space size-1u" rack-unit-nbr="0">0</div><div class="equipment free-space size-1u" rack-unit-nbr="1">1</div></div>`;
        expect(target).toStrictEqual(expected);
    });
});