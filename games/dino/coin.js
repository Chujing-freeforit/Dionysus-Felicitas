// games/dino/coin.js (V1.0 - 金币系统)

const COIN_INTERVAL_MIN = 1200; // 金币出现的最小间隔
const COIN_INTERVAL_MAX = 3500; // 金币出现的最大间隔
const COIN_MIN_HEIGHT = 5;      // 金币最低高度 (地面)
const COIN_MAX_HEIGHT = 40;     // 金币最高高度 (空中)

const worldElem = document.querySelector('[data-world]');
let nextCoinTime;

export function setupCoin() {
    nextCoinTime = COIN_INTERVAL_MIN;
    document.querySelectorAll('[data-coin]').forEach(coin => {
        coin.remove();
    });
}

export function updateCoin(delta, speedScale) {
    // 移动所有现存的金币
    document.querySelectorAll('[data-coin]').forEach(coin => {
        incrementCustomProperty(coin, "--left", delta * speedScale * -0.05);
        if (getCustomProperty(coin, "--left") <= -100) {
            coin.remove();
        }
    });

    // 判断是否生成新金币
    if (nextCoinTime <= 0) {
        createCoin();
        nextCoinTime = randomNumberBetween(COIN_INTERVAL_MIN, COIN_INTERVAL_MAX) / speedScale;
    }
    nextCoinTime -= delta;
}

export function getCoinRects() {
    return [...document.querySelectorAll('[data-coin]')]; // 直接返回元素，方便移除
}

function createCoin() {
    const coin = document.createElement("img");
    coin.dataset.coin = true;
    coin.src = "imgs/coin.png"; // 【重要】确保你的金币图片叫这个名字
    coin.classList.add("coin");

    const randomHeight = randomNumberBetween(COIN_MIN_HEIGHT, COIN_MAX_HEIGHT);
    setCustomProperty(coin, "--bottom", randomHeight);
    setCustomProperty(coin, "--left", 100);
    worldElem.append(coin);
}

// --- 辅助函数 ---
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
