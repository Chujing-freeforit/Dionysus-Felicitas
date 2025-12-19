// games/dino/ground.js (V2.1 - 逻辑修正版)
import { currentSkin } from './skins.js';

const SPEED = 0.05
const groundElems = document.querySelectorAll('[data-ground-container]')

export function setupGround() {
    // 【关键修正】正确设置两个地面的初始位置
    // 第一个地面从屏幕左边界开始
    setCustomProperty(groundElems[0], "--left", 0)
    // 第二个地面紧跟在第一个后面，形成无缝连接
    setCustomProperty(groundElems[1], "--left", 100) 
    
    // 设置背景图片 (这部分逻辑保持不变)
    groundElems.forEach(elem => {
        elem.style.backgroundImage = `url(${currentSkin.background.image})`;
    })
}

export function updateGround(delta, speedScale) {
    groundElems.forEach(ground => {
        incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1)

        // 【关键修正】使用正确的循环判断条件
        // 当一个地面完全移出屏幕左侧时 (left <= -100)
        if (getCustomProperty(ground, "--left") <= -100) {
            // 将它移动 200% 的宽度，接到队伍的最后面
            incrementCustomProperty(ground, "--left", 200) 
        }
    })
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
