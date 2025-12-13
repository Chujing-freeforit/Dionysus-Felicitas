// games/dino/script.js (V3.0 - 最终修正版)

// 【核心修复】: 导入新的 startGameControls 和 stopGameControls 函数
import { setupDino, updateDino, getDinoRect, setDinoLose, startGameControls, stopGameControls } from './dino.js'
import { setupGround, updateGround } from './ground.js'
import { setupCactus, updateCactus, getCactusRects } from './cactus.js'
import { SKINS, currentSkin, changeSkin } from './skins.js'

// --- 游戏核心变量 ---
const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

// --- DOM 元素获取 ---
const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const menuScreenElem = document.querySelector('[data-menu-screen]')
const skinScreenElem = document.querySelector('[data-skin-screen]')
const startBtn = document.querySelector('[data-start-btn]')
const skinBtn = document.querySelector('[data-skin-btn]')
const backBtn = document.querySelector('[data-back-btn]')
const skinGrid = document.querySelector('[data-skin-grid]')

let lastTime, speedScale, score

// --- 初始设置 ---
setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
setupInitialUI()

// --- 事件监听 ---
startBtn.addEventListener("click", handleStart)
skinBtn.addEventListener("click", showSkinSelection)
backBtn.addEventListener("click", hideSkinSelection)

// --- UI 函数 ---
function setupInitialUI() {
    setupDino()
    setupGround()
}

function showSkinSelection() {
    menuScreenElem.classList.add("hide")
    skinScreenElem.classList.remove("hide")
    populateSkinGrid()
}

function hideSkinSelection() {
    skinScreenElem.classList.add("hide")
    menuScreenElem.classList.remove("hide")
}

function populateSkinGrid() {
    skinGrid.innerHTML = ""
    Object.entries(SKINS).forEach(([id, skin]) => {
        const choiceElem = document.createElement("div")
        choiceElem.classList.add("skin-choice")
        choiceElem.classList.toggle("selected", currentSkin === skin)
        choiceElem.innerHTML = `
            <img src="${skin.dinoStationary}" alt="${skin.name}">
            <p>${skin.name}</p>
        `
        choiceElem.addEventListener("click", () => {
            changeSkin(id)
            populateSkinGrid()
            setupInitialUI()
        })
        skinGrid.appendChild(choiceElem)
    })
}

// --- 游戏循环与状态 ---
function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupDino()
    setupCactus()
    startGameControls() // 【核心修复】: 游戏开始时才启动游戏内控制
    menuScreenElem.classList.add("hide")
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
    updateCactus(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    if (checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function handleLose() {
    setDinoLose()
    stopGameControls() // 【核心修复】: 游戏结束时停止游戏内控制
    setTimeout(() => {
        menuScreenElem.classList.remove("hide")
    }, 500)
}

// --- 逻辑与辅助函数 (保持不变) ---
function checkLose() {
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    return rect1.left < rect2.right && rect1.top < rect2.bottom && rect1.right > rect2.left && rect1.bottom > rect2.top
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
    score += delta * 0.01
    scoreElem.textContent = Math.floor(score)
}

function setPixelToWorldScale() {
    let worldToPixelScale = (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT)
        ? window.innerWidth / WORLD_WIDTH
        : window.innerHeight / WORLD_HEIGHT
    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}
