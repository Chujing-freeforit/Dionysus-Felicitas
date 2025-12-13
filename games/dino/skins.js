// 这个文件就是我们的“皮肤衣柜”

// 1. 定义所有可用的皮肤包
export const SKINS = {
    classic: {
        name: "测试dino",
        dinoStationary: "imgs/dino-stationary.png",
        dinoRun: ["imgs/dino-run-0.png", "imgs/dino-run-1.png"],
        dinoLose: "imgs/dino-lose.png",
        cactus: "imgs/cactus.png",
        ground: "imgs/ground.png"
    },
    custom: {
        name: "测试替换dino", // 你可以给它起个名字
        // 【重要】请在这里填上你自己的文件名！
        dinoStationary: "imgs/sheep-stationary.png", // 你的站立图
        dinoRun: ["imgs/sheep-run-0.png", "imgs/sheep-run-1.png"], // 你的跑动图 (两张)
        dinoLose: "imgs/sheep-lose.png", // 你的失败图
        cactus: "imgs/obstacle-1.png", // 你的障碍物图
        ground: "imgs/background-1.png" // 你的背景图
    }
};

// 2. 设置默认皮肤，并尝试从浏览器缓存中读取上次的选择
let currentSkinId = localStorage.getItem("dinoGameSkin") || "classic";
if (!SKINS[currentSkinId]) currentSkinId = "classic"; // 如果保存的皮肤ID无效，则重置

// 3. 导出一个随时可用的当前皮肤对象
export let currentSkin = SKINS[currentSkinId];

// 4. 导出一个函数，用于切换皮肤
export function changeSkin(skinId) {
    if (SKINS[skinId]) {
        currentSkinId = skinId;
        currentSkin = SKINS[skinId];
        // 将选择保存到浏览器缓存中
        localStorage.setItem("dinoGameSkin", skinId);
        console.log(`皮肤已切换为: ${SKINS[skinId].name}`);
    }
}
