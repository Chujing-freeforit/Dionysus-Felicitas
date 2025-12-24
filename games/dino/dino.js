// games/dino/dino.js (V6.3 - 修复导出报错版)
import { currentSkin } from './skins.js';

const dinoElem = document.querySelector('[data-dino]');
const jumpBtn = document.getElementById('jumpBtn');

const JUMP_SPEED = 0.42;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping, dinoFrame, currentFrameTime, yVelocity;

export function startGameControls() {
    document.addEventListener("keydown", onJump);
    document.addEventListener("mousedown", onJump);
    document.addEventListener("touchstart", onJump, { passive: false });
    
    if(jumpBtn) {
        jumpBtn.addEventListener("mousedown", onJump);
        jumpBtn.addEventListener("touchstart", onJump, { passive: false });
    }
}

export function stopGameControls() {
    document.removeEventListener("keydown", onJump);
    document.removeEventListener("mousedown", onJump);
    document.removeEventListener("touchstart", onJump);
    
    if(jumpBtn) {
        jumpBtn.removeEventListener("mousedown", onJump);
        jumpBtn.removeEventListener("touchstart", onJump);
    }
}

export function setupDino() {
    isJumping = false;
    dinoFrame = 0;
    currentFrameTime = 0;
    yVelocity = 0;
    setCustomProperty(dinoElem, "--bottom", 0);
    dinoElem.src = currentSkin.dino.stationary;
}

export function updateDino(delta, speedScale) {
    handleRun(delta, speedScale);
    handleJump(delta);
}

// ⚠️ 就是这里！必须要有 export 关键字
export function getDinoRect() {
    return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
   dinoElem.src = currentSkin.dino.lose;
}

// --- 内部逻辑 ---

function handleRun(delta, speedScale) {
    if (isJumping) {
        dinoElem.src = currentSkin.dino.stationary;
        return;
    }
    if (currentFrameTime >= FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
        dinoElem.src = currentSkin.dino.run[dinoFrame];
        currentFrameTime -= FRAME_TIME;
    }
    currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
    if (!isJumping) return;
    incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);
    if (getCustomProperty(dinoElem, "--bottom") <= 0) {
        setCustomProperty(dinoElem, "--bottom", 0);
        isJumping = false;
    }
    yVelocity -= GRAVITY * delta;
}

function onJump(e) {
    // 1. 防止触摸滚动
    if(e.type === 'touchstart') e.preventDefault(); 
    
    // 2. 键盘逻辑不变
    if (e.type === 'keydown' && e.code !== "Space") return;

    // 3. 【优化】防止误触菜单按钮
    // 如果点到了按钮、输入框或皮肤选项，就不跳
    if (e.target.closest('button') || e.target.closest('.skin-item') || e.target.closest('input')) return;

    // 4. 【新增】如果是触摸事件，判断点击位置
    if (e.type === 'touchstart' || e.type === 'mousedown') {
        // 获取点击点的 X 坐标
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const screenWidth = window.innerWidth;

        // 如果点击的是屏幕左边 30% 的区域（留给方向键），则不跳
        // 也就是说，点击屏幕右边 70% 的区域都能跳！
        if (clientX < screenWidth * 0.3) return;
    }

    if (isJumping) return;
    
    yVelocity = JUMP_SPEED;
    isJumping = true;
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
