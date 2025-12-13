// ground.js 的全新代码
import { currentSkin } from './skins.js'; // <-- 新增

const SPEED = 0.05;
const groundContainer = document.querySelector('[data-ground-container]');

let backgroundPositionX = 0;

// setupGround 现在非常简单，只是重置背景位置
export function setupGround() {
    backgroundPositionX = 0;
     // 【核心改动】动态设置背景图
    groundContainer.style.backgroundImage = `url('${currentSkin.ground}')`;
    groundContainer.style.backgroundPositionX = '0px';
}

// updateGround 现在是不断改变 backgroundPositionX 的值
export function updateGround(delta, speedScale) {
    // 计算这一帧需要移动的距离
    const moveDistance = delta * speedScale * SPEED * -5; // 乘以100让速度感觉更合适
    
    backgroundPositionX += moveDistance;

    // 直接更新CSS属性
    groundContainer.style.backgroundPositionX = `${backgroundPositionX}px`;
}
