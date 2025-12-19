// games/dino/script.js (V10.0 - 游戏结束界面版)

import { setupDino, updateDino, getDinoRect, setDinoLose, startGameControls, stopGameControls } from './dino.js'
import { setupGround, updateGround } from './ground.js'
import { setupObstacle, updateObstacle, getObstacleRects } from './obstacle.js'
import { setupCoin, updateCoin, getCoinRects } from './coin.js';
import { DINOS, GROUND_OBSTACLES, AIR_OBSTACLES, BACKGROUNDS, getCurrentSelection, changeSkinPart } from './skins.js'

// --- 游戏平衡性设置 ---
const SPEED_SCALE_INCREASE = 0.000005;
const COIN_VALUE = 10; // 每个金币值10分

// --- DOM 元素获取 ---
const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const coinScoreElem = document.querySelector('[data-coin-score]');
const menuScreenElem = document.querySelector('[data-menu-screen]')
const skinScreenElem = document.querySelector('[data-skin-screen]')
const startBtn = document.querySelector('[data-start-btn]')
const skinBtn = document.querySelector('[data-skin-btn]')
const backBtn = document.querySelector('[data-back-btn]')
const exitBtn = document.querySelector('[data-exit-btn]')

// 【新增】获取游戏结束界面的所有元素
const gameOverScreen = document.querySelector('[data-game-over-screen]');
const finalDistanceScoreElem = document.querySelector('[data-final-distance-score]');
const finalCoinScoreElem = document.querySelector('[data-final-coin-score]');
const finalTotalScoreElem = document.querySelector('[data-final-total-score]');
const restartBtn = document.querySelector('[data-restart-btn]');
const menuBtn = document.querySelector('[data-menu-btn]');

const dinoListElem = document.querySelector('[data-dino-list]')
const groundObstacleListElem = document.querySelector('[data-ground-obstacle-list]')
const airObstacleListElem = document.querySelector('[data-air-obstacle-list]')
const backgroundListElem = document.querySelector('[data-background-list]')

let lastTime, speedScale, score, coinsCollected;

setupInitialUI()

// --- 事件监听 ---
startBtn.addEventListener("click", handleStart)
skinBtn.addEventListener("click", showSkinSelection)
backBtn.addEventListener("click", hideSkinSelection)
exitBtn.addEventListener("click", () => {
    if (window.parent && window.parent.closeGame) window.parent.closeGame();
    else alert("无法退出，请直接关闭标签页。");
});
// 【新增】为游戏结束界面的按钮添加监听
restartBtn.addEventListener("click", handleStart);
menuBtn.addEventListener("click", () => {
    gameOverScreen.classList.add("hide");
    menuScreenElem.classList.remove("hide");
});


function setupInitialUI() {
    setupDino()
    setupGround()
}

function showSkinSelection() {
    menuScreenElem.classList.add("hide")
    skinScreenElem.classList.remove("hide")
    populateAllSkinLists()
}

function hideSkinSelection() {
    skinScreenElem.classList.add("hide")
    menuScreenElem.classList.remove("hide")
    setupInitialUI()
}

function populateAllSkinLists() {
    const current = getCurrentSelection();
    createSkinList(dinoListElem, DINOS, 'dino', current.dino);
    createSkinList(groundObstacleListElem, GROUND_OBSTACLES, 'groundObstacle', current.groundObstacle);
    createSkinList(airObstacleListElem, AIR_OBSTACLES, 'airObstacle', current.airObstacle);
    createSkinList(backgroundListElem, BACKGROUNDS, 'background', current.background);
}

function createSkinList(container, dataObj, type, currentId) {
    container.innerHTML = "";
    Object.entries(dataObj).forEach(([id, item]) => {
        const itemElem = document.createElement("div");
        itemElem.classList.add("skin-item");
        if (id === currentId) itemElem.classList.add("selected");
        itemElem.innerHTML = `<img src="${item.preview}" alt="${item.name}"><span>${item.name}</span>`;
        itemElem.addEventListener("click", () => {
            changeSkinPart(type, id);
            populateAllSkinLists();
        });
        container.appendChild(itemElem);
    });
}

function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    coinsCollected = 0;
    coinScoreElem.textContent = 0;
    scoreElem.textContent = 0;

    setupGround()
    setupDino()
    setupObstacle()
    setupCoin();
    startGameControls() 
    menuScreenElem.classList.add("hide");
    gameOverScreen.classList.add("hide"); // 【修改】开始时也要隐藏游戏结束界面
    window.requestAnimationFrame(update)
}

function update(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime

    updateGround(delta, speedScale)
    updateDino(delta, speedScale)
    updateObstacle(delta, speedScale, Math.floor(score))
    updateCoin(delta, speedScale);
    updateSpeedScale(delta)
    updateScore(delta)
    
    checkCoinCollision();
    if (checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

// 【重大修改】重写 handleLose 函数
function handleLose() {
    setDinoLose();
    stopGameControls();

    // 延迟一小会儿，让玩家看到死亡动画
    setTimeout(() => {
        // 1. 计算最终分数
        const distanceScore = Math.floor(score);
        const coinScore = coinsCollected * COIN_VALUE;
        const totalScore = distanceScore + coinScore;

        // 2. 更新游戏结束界面的显示
        finalDistanceScoreElem.textContent = distanceScore;
        finalCoinScoreElem.textContent = `${coinsCollected} x ${COIN_VALUE} = ${coinScore}`;
        finalTotalScoreElem.textContent = totalScore;

        // 3. 显示游戏结束界面
        gameOverScreen.classList.remove("hide");
    }, 300); // 延迟300毫秒
}

function checkCoinCollision() {
    const dinoRect = getDinoRect();
    getCoinRects().forEach(coin => {
        if (isCollision(coin.getBoundingClientRect(), dinoRect)) {
            coinsCollected++;
            coinScoreElem.textContent = coinsCollected;
            coin.remove();
        }
    });
}

function checkLose() {
    const dinoRect = getDinoRect()
    return getObstacleRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    const padding1 = rect1.width * 0.2; 
    const padding2 = rect2.width * 0.2;

    return (
        rect1.left + padding1 < rect2.right - padding2 &&
        rect1.top + padding1 < rect2.bottom - padding2 &&
        rect1.right - padding1 > rect2.left + padding2 &&
        rect1.bottom - padding1 > rect2.top + padding2
    )
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
    score += delta * 0.01
    scoreElem.textContent = Math.floor(score)
}
