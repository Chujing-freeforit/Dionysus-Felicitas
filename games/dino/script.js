// games/dino/script.js (V13.0 - 最终修复版)

import { setupDino, updateDino, getDinoRect, setDinoLose, startGameControls, stopGameControls } from './dino.js';
import { setupGround, updateGround } from './ground.js';
import { setupBackground, updateBackground } from './background.js';
import { setupObstacle, updateObstacle, getObstacleRects } from './obstacle.js';
import { setupCoin, updateCoin, getCoinRects } from './coin.js';
import { DINOS, GROUND_OBSTACLES, AIR_OBSTACLES, COINS, BACKGROUNDS, getCurrentSelection, changeSkinPart } from './skins.js';

// ==========================================
const API_BASE_URL = 'http://139.199.180.70:3000'; 
// ==========================================

const SPEED_SCALE_INCREASE = 0.000005;
const COIN_VALUE = 10;

// --- DOM 元素 ---
const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const coinScoreElem = document.querySelector('[data-coin-score]');

// 屏幕容器
const menuScreenElem = document.querySelector('[data-menu-screen]');
const skinScreenElem = document.querySelector('[data-skin-screen]');
const rankScreenElem = document.querySelector('[data-rank-screen]'); // 主界面排行榜
const gameOverScreen = document.querySelector('[data-game-over-screen]'); // 游戏结束界面

// 按钮
const startBtn = document.querySelector('[data-start-btn]');
const skinBtn = document.querySelector('[data-skin-btn]');
const rankBtn = document.querySelector('[data-rank-btn]'); // 主界面排行榜按钮
const backBtn = document.querySelector('[data-back-btn]'); // 换肤返回
const rankBackBtn = document.querySelector('[data-rank-back-btn]'); // 排行榜返回
const exitBtn = document.querySelector('[data-exit-btn]');
const restartBtn = document.querySelector('[data-restart-btn]');
const menuBtn = document.querySelector('[data-menu-btn]');

// 结算数据
const finalTotalScoreElem = document.querySelector('[data-final-total-score]');

// 后端交互元素
const nameInput = document.getElementById('player-name-input');
const submitScoreBtn = document.getElementById('submit-score-btn');

// 两个排行榜列表容器
const mainLeaderboardList = document.getElementById('main-leaderboard-list');
const gameOverLeaderboardList = document.getElementById('game-over-leaderboard-list');

// 皮肤列表
const skinGridElem = document.querySelector('[data-skin-grid]');
const navItems = document.querySelectorAll('.nav-item');

let lastTime, speedScale, score, coinsCollected;
let currentTab = 'dino'; 
let finalCalculatedScore = 0; 

setupInitialUI();

// --- 事件监听 ---

// 1. 菜单按钮
startBtn.addEventListener("click", handleStart);
skinBtn.addEventListener("click", showSkinSelection);
if(rankBtn) rankBtn.addEventListener("click", showRankScreen); // 进入排行榜
exitBtn.addEventListener("click", () => {
    if (window.parent && window.parent.closeGame) window.parent.closeGame();
    else alert("无法退出，请直接关闭标签页。");
});

// 2. 返回按钮
backBtn.addEventListener("click", hideSkinSelection);
if(rankBackBtn) rankBackBtn.addEventListener("click", hideRankScreen); // 退出排行榜

// 3. 游戏结束按钮
restartBtn.addEventListener("click", handleStart);
menuBtn.addEventListener("click", () => {
    gameOverScreen.classList.add("hide");
    menuScreenElem.classList.remove("hide");
});

// 4. 提交分数
if(submitScoreBtn) {
    submitScoreBtn.addEventListener("click", uploadScore);
}

// 5. 换肤导航
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        currentTab = item.dataset.tab;
        renderSkinGrid();
    });
});

// --- 界面切换逻辑 ---

function setupInitialUI() {
    setupDino();
    setupGround();
    setupBackground();
}

function showSkinSelection() {
    menuScreenElem.classList.add("hide");
    skinScreenElem.classList.remove("hide");
    renderSkinGrid();
}

function hideSkinSelection() {
    skinScreenElem.classList.add("hide");
    menuScreenElem.classList.remove("hide");
    setupInitialUI();
}

// 【新增】显示主界面排行榜
function showRankScreen() {
    menuScreenElem.classList.add("hide");
    rankScreenElem.classList.remove("hide");
    // 加载数据到主界面的列表
    fetchLeaderboard(mainLeaderboardList);
}

// 【新增】隐藏主界面排行榜
function hideRankScreen() {
    rankScreenElem.classList.add("hide");
    menuScreenElem.classList.remove("hide");
}

function renderSkinGrid() {
    skinGridElem.innerHTML = "";
    let dataObj, type;
    const currentSelection = getCurrentSelection();
    let currentId;

    switch (currentTab) {
        case 'dino': dataObj = DINOS; type = 'dino'; currentId = currentSelection.dino; break;
        case 'groundObstacle': dataObj = GROUND_OBSTACLES; type = 'groundObstacle'; currentId = currentSelection.groundObstacle; break;
        case 'airObstacle': dataObj = AIR_OBSTACLES; type = 'airObstacle'; currentId = currentSelection.airObstacle; break;
        case 'coin': dataObj = COINS; type = 'coin'; currentId = currentSelection.coin; break;
        case 'background': dataObj = BACKGROUNDS; type = 'background'; currentId = currentSelection.background; break;
    }

    Object.entries(dataObj).forEach(([id, item]) => {
        const itemElem = document.createElement("div");
        itemElem.classList.add("skin-item");
        if (id === currentId) itemElem.classList.add("selected");
        itemElem.innerHTML = `<img src="${item.preview}" alt="${item.name}"><span>${item.name}</span>`;
        itemElem.addEventListener("click", () => {
            changeSkinPart(type, id);
            renderSkinGrid();
        });
        skinGridElem.appendChild(itemElem);
    });
}

// --- 游戏循环逻辑 ---

function handleStart() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    coinsCollected = 0;
    coinScoreElem.textContent = 0;
    scoreElem.textContent = 0;

    setupGround();
    setupBackground();
    setupDino();
    setupObstacle();
    setupCoin();
    startGameControls();
    
    menuScreenElem.classList.add("hide");
    gameOverScreen.classList.add("hide");
    rankScreenElem.classList.add("hide"); // 确保排行榜也关掉
    window.requestAnimationFrame(update);
}

function update(time) {
     if (!menuScreenElem.classList.contains('hide') || !gameOverScreen.classList.contains('hide')) {
        lastTime = null; // 重置时间
        window.requestAnimationFrame(update); // 保持循环但不计算逻辑
        return;
    }

    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    }
    const delta = time - lastTime;

    updateGround(delta, speedScale);
    updateBackground(delta, speedScale);
    updateDino(delta, speedScale);
    updateObstacle(delta, speedScale, Math.floor(score));
    updateCoin(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);
    
    checkCoinCollision();
    if (checkLose()) return handleLose();

    lastTime = time;
    window.requestAnimationFrame(update);
}

function handleLose() {
    setDinoLose();
    stopGameControls();

    setTimeout(() => {
        const distanceScore = Math.floor(score);
        const coinScore = coinsCollected * COIN_VALUE;
        finalCalculatedScore = distanceScore + coinScore; 

        if(finalTotalScoreElem) {
            finalTotalScoreElem.textContent = finalCalculatedScore;
        }
        
        if(submitScoreBtn && nameInput) {
            submitScoreBtn.disabled = false;
            submitScoreBtn.textContent = "上传";
            nameInput.value = localStorage.getItem('dinoPlayerName') || ''; 
        }

        gameOverScreen.classList.remove("hide");
        
        // 游戏结束时，加载数据到游戏结束界面的列表
        fetchLeaderboard(gameOverLeaderboardList);

    }, 300);
}

// --- 后端交互函数 ---

function uploadScore() {
    const playerName = nameInput.value.trim();
    
    if (!playerName) {
        alert("请先输入你的名字！");
        return;
    }

    submitScoreBtn.disabled = true;
    submitScoreBtn.textContent = "上传中...";

    localStorage.setItem('dinoPlayerName', playerName);

    fetch(`${API_BASE_URL}/api/score`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            game: 'dino',
            name: playerName,
            score: finalCalculatedScore
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Score uploaded:', data);
        submitScoreBtn.textContent = "成功！";
        // 上传成功后，刷新当前显示的排行榜
        fetchLeaderboard(gameOverLeaderboardList);
    })
    .catch(err => {
        console.error('Upload failed:', err);
        submitScoreBtn.disabled = false;
        submitScoreBtn.textContent = "重试";
        alert("连接服务器失败。");
    });
}

// 【修改】现在接受一个 container 参数，决定渲染到哪里
function fetchLeaderboard(container) {
    if(!container) return;
    
    container.innerHTML = '<div class="loading-text">加载排行榜中...</div>';

    fetch(`${API_BASE_URL}/api/rank?game=dino`)
        .then(res => res.json())
        .then(list => {
            renderLeaderboard(list, container);
        })
        .catch(err => {
            console.error('Fetch rank failed:', err);
            container.innerHTML = '<div class="loading-text">排行榜加载失败</div>';
        });
}

// 【修改】渲染到指定的 container
function renderLeaderboard(list, container) {
    container.innerHTML = ""; 

    if (!list || list.length === 0) {
        container.innerHTML = '<div class="loading-text">暂无数据，快来抢第一！</div>';
        return;
    }

    list.forEach((item, index) => {
        const rankItem = document.createElement("div");
        rankItem.classList.add("rank-item");
        
        rankItem.innerHTML = `
            <span class="rank-name">${index + 1}. ${item.name}</span>
            <span class="rank-score">${item.score}</span>
        `;
        container.appendChild(rankItem);
    });
}

// --- 辅助函数 ---
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
    const dinoRect = getDinoRect();
    return getObstacleRects().some(rect => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
    const padding1 = rect1.width * 0.2; 
    const padding2 = rect2.width * 0.2;
    return (
        rect1.left + padding1 < rect2.right - padding2 &&
        rect1.top + padding1 < rect2.bottom - padding2 &&
        rect1.right - padding1 > rect2.left + padding2 &&
        rect1.bottom - padding1 > rect2.top + padding2
    );
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
    score += delta * 0.01;
    scoreElem.textContent = Math.floor(score);
}
// --- 【新增】切后台自动暂停/处理 ---
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // 切后台时：清除上一帧的时间，防止切回来时 delta 巨大导致瞬移
        lastTime = null;
    } else {
        // 切回来时：重置 lastTime，平滑恢复动画
        lastTime = null;
        window.requestAnimationFrame(update);
    }
});
