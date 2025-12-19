// games/dino/obstacle.js (V1.1 - 高度随机修正版)
import { currentSkin } from './skins.js';

// --- 游戏平衡性设置 ---
const OBSTACLE_INTERVAL_MIN = 900;
const OBSTACLE_INTERVAL_MAX = 2800;
const AIR_OBSTACLE_SCORE_THRESHOLD = 300;
const AIR_OBSTACLE_PROBABILITY = 0.35;
// 【新增】定义空中障碍物的最低和最高出现高度
const AIR_OBSTACLE_MIN_HEIGHT = 20; // 刚好需要小跳的高度
const AIR_OBSTACLE_MAX_HEIGHT = 45; // 角色大跳的极限高度附近

const worldElem = document.querySelector('[data-world]');
let nextObstacleTime;

export function setupObstacle() {
    nextObstacleTime = OBSTACLE_INTERVAL_MIN;
    document.querySelectorAll('[data-obstacle]').forEach(obstacle => {
        obstacle.remove();
    });
}

export function updateObstacle(delta, speedScale, score) {
    document.querySelectorAll('[data-obstacle]').forEach(obstacle => {
        incrementCustomProperty(obstacle, "--left", delta * speedScale * -0.05);
        if (getCustomProperty(obstacle, "--left") <= -100) {
            obstacle.remove();
        }
    });

    if (nextObstacleTime <= 0) {
        createObstacle(score);
        nextObstacleTime = randomNumberBetween(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX) / speedScale;
    }
    nextObstacleTime -= delta;
}

export function getObstacleRects() {
    return [...document.querySelectorAll('[data-obstacle]')].map(obstacle => {
        return obstacle.getBoundingClientRect();
    });
}

function createObstacle(score) {
    let obstacleType = 'ground';

    if (score > AIR_OBSTACLE_SCORE_THRESHOLD && Math.random() < AIR_OBSTACLE_PROBABILITY) {
        obstacleType = 'air';
    }

    const obstacle = document.createElement("img");
    obstacle.dataset.obstacle = true;
    obstacle.classList.add("obstacle");

    if (obstacleType === 'ground') {
        obstacle.src = currentSkin.groundObstacle.image;
        obstacle.classList.add("obstacle-ground");
        setCustomProperty(obstacle, "--bottom", 0);
    } else { // 'air'
        obstacle.src = currentSkin.airObstacle.image;
        obstacle.classList.add("obstacle-air");
        // 【关键修正】在设定的最低和最高高度之间随机选择一个
        const randomHeight = randomNumberBetween(AIR_OBSTACLE_MIN_HEIGHT, AIR_OBSTACLE_MAX_HEIGHT);
        setCustomProperty(obstacle, "--bottom", randomHeight);
    }

    setCustomProperty(obstacle, "--left", 100);
    worldElem.append(obstacle);
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
