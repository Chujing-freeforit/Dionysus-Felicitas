// games/dino/obstacle.js (V1.2 - 规整版)
import { currentSkin } from './skins.js';

// --- 游戏平衡性设置 ---
const OBSTACLE_INTERVAL_MIN = 900;
const OBSTACLE_INTERVAL_MAX = 2800;
const AIR_OBSTACLE_SCORE_THRESHOLD = 300; // 分数达到多少才出现空中障碍
const AIR_OBSTACLE_PROBABILITY = 0.35;    // 空中障碍出现的概率
const AIR_OBSTACLE_MIN_HEIGHT = 20;
const AIR_OBSTACLE_MAX_HEIGHT = 45;

const worldElem = document.querySelector('[data-world]');
let nextObstacleTime;

export function setupObstacle() {
    nextObstacleTime = OBSTACLE_INTERVAL_MIN;
    document.querySelectorAll('[data-obstacle]').forEach(obstacle => {
        obstacle.remove();
    });
}

export function updateObstacle(delta, speedScale, score) {
    // 1. 移动障碍物
    document.querySelectorAll('[data-obstacle]').forEach(obstacle => {
        incrementCustomProperty(obstacle, "--left", delta * speedScale * -0.05);
        if (getCustomProperty(obstacle, "--left") <= -100) {
            obstacle.remove();
        }
    });

    // 2. 生成新障碍物
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

    // 难度控制：分数够高且运气好时，生成空中障碍
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
