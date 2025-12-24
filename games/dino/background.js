// games/dino/background.js (V1.0 - 视差滚动核心)
import { currentSkin } from './skins.js';

// 背景移动速度系数 (0.1 表示只有地面速度的 10%，产生远景效果)
const BACKGROUND_SPEED_MODIFIER = 0.1; 

const backgroundElems = document.querySelectorAll('[data-background-layer]');

export function setupBackground() {
    // 1. 设置初始位置
    setCustomProperty(backgroundElems[0], "--left", 0);
    setCustomProperty(backgroundElems[1], "--left", 100);
    
    // 2. 应用当前皮肤的背景图
    backgroundElems.forEach(elem => {
        elem.style.backgroundImage = `url(${currentSkin.background.image})`;
    });
}

export function updateBackground(delta, speedScale) {
    backgroundElems.forEach(bg => {
        // 关键：乘以 BACKGROUND_SPEED_MODIFIER 让它变慢
        incrementCustomProperty(bg, "--left", delta * speedScale * 0.05 * BACKGROUND_SPEED_MODIFIER * -1);

        // 循环滚动
        if (getCustomProperty(bg, "--left") <= -100) {
            incrementCustomProperty(bg, "--left", 200);
        }
    });
}

// --- 辅助函数 ---
function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}
function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value);
}
function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
}
