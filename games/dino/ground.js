// games/dino/ground.js (V3.0 - 剥离背景图版)
// 注意：不再需要 import currentSkin，因为它不负责显示图片了

const SPEED = 0.05;
const groundElems = document.querySelectorAll('[data-ground-container]');

/**
 * 初始化地面
 */
export function setupGround() {
    // 设置两个地面的初始位置，实现无缝滚动
    setCustomProperty(groundElems[0], "--left", 0);
    setCustomProperty(groundElems[1], "--left", 100);
    
    // 【关键修改】删除了设置背景图的代码
    // 因为背景图现在由 background.js 控制，地面层变成了透明的载体
}

/**
 * 更新地面位置
 */
export function updateGround(delta, speedScale) {
    groundElems.forEach(ground => {
        incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1);

        // 循环滚动逻辑
        if (getCustomProperty(ground, "--left") <= -100) {
            incrementCustomProperty(ground, "--left", 200);
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
