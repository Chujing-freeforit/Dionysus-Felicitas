// games/dino/dino.js (V2.0 - 修复版)
import { currentSkin } from './skins.js';

const dinoElem = document.querySelector('[data-dino]')
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping, dinoFrame, currentFrameTime, yVelocity

// --- 核心改动：将事件监听器从 setupDino 中分离 ---

// 游戏开始时才添加控制
export function startGameControls() {
    document.addEventListener("keydown", onJump)
    document.addEventListener("click", onJump)
}

// 游戏结束时移除控制，避免冲突
export function stopGameControls() {
    document.removeEventListener("keydown", onJump)
    document.removeEventListener("click", onJump)
}

// --- 原有函数更新 ---

export function setupDino() {
    isJumping = false
    dinoFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(dinoElem, "--bottom", 0)
    dinoElem.src = currentSkin.dinoStationary;
}

export function updateDino(delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)
}

export function getDinoRect() {
    return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
   dinoElem.src = currentSkin.dinoLose;
}

function handleRun(delta, speedScale) {
    if (isJumping) {
        dinoElem.src = currentSkin.dinoStationary;
        return
    }
    if (currentFrameTime >= FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
        dinoElem.src = currentSkin.dinoRun[dinoFrame];
        currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += delta * speedScale
}

function handleJump(delta) {
    if (!isJumping) return
    incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)
    if (getCustomProperty(dinoElem, "--bottom") <= 0) {
        setCustomProperty(dinoElem, "--bottom", 0)
        isJumping = false
    }
    yVelocity -= GRAVITY * delta
}

function onJump(e) {
    if ((e.code !== "Space" && e.type !== "click") || isJumping) return
    yVelocity = JUMP_SPEED
    isJumping = true
}

// Helper functions
function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
}
function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value)
}
function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc)
}
