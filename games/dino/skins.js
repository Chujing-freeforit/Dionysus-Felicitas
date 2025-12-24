// games/dino/skins.js (V3.0 - 含金币皮肤版)

// ==================================================
// 1. 皮肤数据定义
// ==================================================

export const DINOS = {
    dino_classic: {
        name: "经典小恐龙",
        preview: "imgs/dino-stationary.png",
        stationary: "imgs/dino-stationary.png",
        run: ["imgs/dino-run-0.png", "imgs/dino-run-1.png"],
        lose: "imgs/dino-lose.png"
    },
    sheep_cute: {
        name: "像素绵羊",
        preview: "imgs/sheep-stationary.png",
        stationary: "imgs/sheep-stationary.png",
        run: ["imgs/sheep-run-0.png", "imgs/sheep-run-1.png"],
        lose: "imgs/sheep-lose.png"
    },
    shark: {
        name: "像素鲨鱼",
        preview: "imgs/shark-stationary.png",
        stationary: "imgs/shark-stationary.png",
        run: ["imgs/shark-run-1.png", "imgs/shark-run-0.png"],
        lose: "imgs/shark-lose.png"
    },
    crow: {
        name: "像素乌鸦",
        preview: "imgs/crow-stationary.png",
        stationary: "imgs/crow-stationary.png",
        run: ["imgs/crow-run-1.png", "imgs/crow-run-0.png"],
        lose: "imgs/crow-lose.png"
    },  
    jellyfish: {
        name: "像素水母",
        preview: "imgs/jellyfish-stationary.png",
        stationary: "imgs/jellyfish-stationary.png",
        run: ["imgs/jellyfish-run-1.png", "imgs/jellyfish-run-0.png"],
        lose: "imgs/jellyfish-lose.png"
    },
    marten: {
        name: "像素翼猫",
        preview: "imgs/marten-stationary.png",
        stationary: "imgs/marten-stationary.png",
        run: ["imgs/marten-run-1.png", "imgs/marten-run-0.png"],
        lose: "imgs/marten-lose.png"
    },
    fox: {
        name: "像素狐狸",
        preview: "imgs/fox-stationary.png",
        stationary: "imgs/fox-stationary.png",
        run: ["imgs/fox-run-1.png", "imgs/fox-run-0.png"],
        lose: "imgs/fox-lose.png"
    },
    lizard: {
        name: "像素蜥蜴",
        preview: "imgs/lizard-stationary.png",
        stationary: "imgs/lizard-stationary.png",
        run: ["imgs/lizard-run-1.png", "imgs/lizard-run-0.png"],
        lose: "imgs/lizard-lose.png"
    },
    
};

export const GROUND_OBSTACLES = {
    cactus_classic: {
        name: "经典仙人掌",
        preview: "imgs/cactus.png",
        image: "imgs/cactus.png"
    },
    rock_normal: {
        name: "普通ddl",
        preview: "imgs/obstacle-1.png",
        image: "imgs/obstacle-1.png"
    },
    // 【修复】键名不能重复，我把第二个 rock_normal 改成了 wine_glass
    wine_glass: {
        name: "酒杯",
        preview: "imgs/obstacle-2.png",
        image: "imgs/obstacle-2.png"
    }
};

export const AIR_OBSTACLES = {
    demon_fly: {
        name: "飞行exam",
        preview: "imgs/fly-obstacle-0.png",
        image: "imgs/fly-obstacle-0.png"
    }
};

// 【新增】金币皮肤数据
export const COINS = {
    coin_classic: {
        name: "经典金币",
        preview: "imgs/coin.png", // 预览图
        image: "imgs/coin.png"    // 实际游戏图
    },
    // 你可以在这里加新的，比如：
    coin_star: {
        name: "神秘金币",
        preview: "imgs/coin-1.png", // 记得把图片放进 imgs 文件夹
        image: "imgs/coin-1.png"
    }
};

export const BACKGROUNDS = {
    ground_classic: {
        name: "经典地面",
        preview: "imgs/ground-preview.png",
        image: "imgs/ground.png"
    },
    grassland_day: {
        name: "白天草地",
        preview: "imgs/background-1-preview.png",
        image: "imgs/background-1.png"
    },
    // 【修复】键名不能重复，我把第二个 grassland_day 改成了 mystery_photo
    mystery_photo: {
        name: "你瞅啥",
        preview: "imgs/background-2-preview.png",
        image: "imgs/background-2.png"
    }
};

// ==================================================
// 2. 皮肤管理逻辑
// ==================================================

const DEFAULT_SELECTION = {
    dino: 'dino_classic',
    groundObstacle: 'cactus_classic',
    airObstacle: 'demon_fly',
    coin: 'coin_classic', // 【新增】默认金币
    background: 'ground_classic',
};

// 读取本地存储
let currentSelection = JSON.parse(localStorage.getItem('dinoGameCustomSkin')) || DEFAULT_SELECTION;

// 安全检查
if (!DINOS[currentSelection.dino]) currentSelection.dino = DEFAULT_SELECTION.dino;
if (!GROUND_OBSTACLES[currentSelection.groundObstacle]) currentSelection.groundObstacle = DEFAULT_SELECTION.groundObstacle;
if (!AIR_OBSTACLES[currentSelection.airObstacle]) currentSelection.airObstacle = DEFAULT_SELECTION.airObstacle;
if (!COINS[currentSelection.coin]) currentSelection.coin = DEFAULT_SELECTION.coin; // 【新增】检查金币
if (!BACKGROUNDS[currentSelection.background]) currentSelection.background = DEFAULT_SELECTION.background;

// ==================================================
// 3. 导出接口
// ==================================================

export let currentSkin = {
    get dino() { return DINOS[currentSelection.dino]; },
    get groundObstacle() { return GROUND_OBSTACLES[currentSelection.groundObstacle]; },
    get airObstacle() { return AIR_OBSTACLES[currentSelection.airObstacle]; },
    get coin() { return COINS[currentSelection.coin]; }, // 【新增】导出金币
    get background() { return BACKGROUNDS[currentSelection.background]; }
};

export function getCurrentSelection() {
    return currentSelection;
}

export function changeSkinPart(type, id) {
    if (currentSelection.hasOwnProperty(type)) {
        const isValid = (type === 'dino' && DINOS[id]) ||
                        (type === 'groundObstacle' && GROUND_OBSTACLES[id]) ||
                        (type === 'airObstacle' && AIR_OBSTACLES[id]) ||
                        (type === 'coin' && COINS[id]) || // 【新增】验证金币
                        (type === 'background' && BACKGROUNDS[id]);
        
        if (isValid) {
            currentSelection[type] = id;
            saveSelection();
            console.log(`皮肤部件 '${type}' 已切换为 '${id}'`);
        } else {
            console.error(`无效的皮肤ID: ${id} 对于类型 ${type}`);
        }
    }
}

function saveSelection() {
    localStorage.setItem('dinoGameCustomSkin', JSON.stringify(currentSelection));
}
