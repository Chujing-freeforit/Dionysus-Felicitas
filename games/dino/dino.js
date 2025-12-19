// games/dino/dino.js (V6.1 - 触摸优化版)
import { currentSkin } from './skins.js';

const dinoElem = document.querySelector('[data-dino]')
const jumpBtn = document.getElementById('jumpBtn')

const JUMP_SPEED = 0.42 
const GRAVITY = 0.0015 
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping, dinoFrame, currentFrameTime, yVelocity

export function startGameControls() {
    document.addEventListener("keydown", onJump)
    document.addEventListener("mousedown", onJump)
    document.addEventListener("touchstart", onJump, { passive: false }) // 【新增】为整个文档添加触摸监听
    if(jumpBtn) {
        jumpBtn.addEventListener("mousedown", onJump)
        jumpBtn.addEventListener("touchstart", onJump, { passive: false }) // 【新增】为跳跃按钮添加触摸监听
    }
}

export function stopGameControls() {
    document.removeEventListener("keydown", onJump)
    document.removeEventListener("mousedown", onJump)
    document.removeEventListener("touchstart", onJump) // 【新增】移除触摸监听
    if(jumpBtn) {
        jumpBtn.removeEventListener("mousedown", onJump)
        jumpBtn.removeEventListener("touchstart", onJump) // 【新增】移除跳跃按钮的触摸监听
    }
}

export function setupDino() {
    isJumping = false
    dinoFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(dinoElem, "--bottom", 0)
    dinoElem.src = currentSkin.dino.stationary;
}

export function updateDino(delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)
}

export function getDinoRect() {
    return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
   dinoElem.src = currentSkin.dino.lose;
}

function handleRun(delta, speedScale) {
    if (isJumping) {
        dinoElem.src = currentSkin.dino.stationary;
        return
    }
    if (currentFrameTime >= FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
        dinoElem.src = currentSkin.dino.run[dinoFrame];
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
    // 阻止触摸事件的默认行为（如滚动页面），这是防止卡死的关键
    if(e.type !== 'keydown') e.preventDefault(); 
    
    // 【关键修改】在判断条件中加入对 "touchstart" 的允许
    if ((e.code !== "Space" && e.type !== "mousedown" && e.type !== "touchstart") || isJumping) return
    
    yVelocity = JUMP_SPEED
    isJumping = true
}

function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
}
function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value)
}
function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc)
}
