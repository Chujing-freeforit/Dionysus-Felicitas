// games/dino/coin.js (V1.2 - 支持换肤版)
import { currentSkin } from './skins.js'; // 【新增】引入皮肤

const COIN_INTERVAL_MIN = 1200;
const COIN_INTERVAL_MAX = 3500;
const COIN_MIN_HEIGHT = 5;
const COIN_MAX_HEIGHT = 40;

const worldElem = document.querySelector('[data-world]');
let nextCoinTime;

export function setupCoin() {
    nextCoinTime = COIN_INTERVAL_MIN;
    document.querySelectorAll('[data-coin]').forEach(coin => {
        coin.remove();
    });
}

export function updateCoin(delta, speedScale) {
    document.querySelectorAll('[data-coin]').forEach(coin => {
        incrementCustomProperty(coin, "--left", delta * speedScale * -0.05);
        if (getCustomProperty(coin, "--left") <= -100) {
            coin.remove();
        }
    });

    if (nextCoinTime <= 0) {
        createCoin();
        nextCoinTime = randomNumberBetween(COIN_INTERVAL_MIN, COIN_INTERVAL_MAX) / speedScale;
    }
    nextCoinTime -= delta;
}

export function getCoinRects() {
    return [...document.querySelectorAll('[data-coin]')];
}

function createCoin() {
    const coin = document.createElement("img");
    coin.dataset.coin = true;
    
    // 【关键修改】读取当前皮肤
    coin.src = currentSkin.coin.image; 
    
    coin.classList.add("coin");

    const randomHeight = randomNumberBetween(COIN_MIN_HEIGHT, COIN_MAX_HEIGHT);
    setCustomProperty(coin, "--bottom", randomHeight);
    setCustomProperty(coin, "--left", 100);
    worldElem.append(coin);
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}
function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value);
}
function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
}
