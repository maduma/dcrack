/* @jest-environment jsdom */

'use strict';

const dcrack = require('./dcrack.js');

function checkResult(html, size) {
    const container = document.createElement('div');
    container.innerHTML = html;
    const target = container.querySelector('#target');
    const result = dcrack.getFreeElementsAdjoining(target, size, 'free');
    const selection = container.querySelectorAll('.select');
    expect(result).toStrictEqual(selection);
}

test('free unit for 1u', () => {
    checkResult(`
        <div class="free">1</div>
        <div class="free select" id="target">2</div>
        <div class="free">3</div>
        `, 1);
});

test('no free unit for 1u', () => {
    checkResult(`
        <div class="free">1</div>
        <div id="target">2</div>
        <div class="free">3</div>
        `, 1);
});

test('free unit for 2ru', () => {
    checkResult(`
        <div></div>
        <div class="free">1</div>
        <div class="free select" id="target">2</div>
        <div class="free select">3</div>
        <div></div>
        `, 2);
});

test('no free unit for 3u, target not free', () => {
    checkResult(`
        <div></div>
        <div class="free select">1</div>
        <div class="free select" id="target">2</div>
        <div class="free select">3</div>
        <div></div>
        `, 3);
});

test('no free unit for 4u, target not free', () => {
    checkResult(`
        <div></div>
        <div class="free select">1</div>
        <div class="free select" id="target">2</div>
        <div class="free select">3</div>
        <div class="free select">4</div>
        <div></div>
        `, 4);
});

test('no free unit for 5u, target not free', () => {
    checkResult(`
        <div></div>
        <div class="free select">1</div>
        <div class="free select">2</div>
        <div class="free select" id="target">3</div>
        <div class="free select">4</div>
        <div class="free select">5</div>
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
        <div class="free select" id="target"></div>
        <div class="free select"></div>
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
        <div id="target">1</div>
        `, 3);
});

test('no free unit for 3ru, overflow', () => {
    checkResult(`
        <div id="target">1</div>
        `, 3);
});

test('no free unit for 2ru, adjacent', () => {
    checkResult(`
        <div class="free" id="target">1</div>
        <div>2</div>
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
    const result = dcrack.getFreeElementsAdjoining(target, 2, 'free');
    expect(result).toStrictEqual(dcrack.EmptyNodeList);
});