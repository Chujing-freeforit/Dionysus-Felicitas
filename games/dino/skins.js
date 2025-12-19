// games/dino/skins.js (V2.0 - 自由组合版)

// ==================================================
// 1. 定义所有可用的皮肤部件 (我们的“自助餐”菜单)
// ==================================================

// --- 可选角色 ---
export const DINOS = {
    dino_classic: {
        name: "经典小恐龙",
        preview: "imgs/dino-stationary.png", // 用于选择界面的预览图
        stationary: "imgs/dino-stationary.png",
        run: ["imgs/dino-run-0.png", "imgs/dino-run-1.png"],
        lose: "imgs/dino-lose.png"
    },
    sheep_cute: {
        name: "像素绵羊",
        preview: "imgs/sheep-stationary.png", // 【重要】请替换成你自己的文件名
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
    // 你可以在这里添加更多角色...
    // dino_pixel: { ... },
};

// --- 可选地面障碍物 ---
export const GROUND_OBSTACLES = {
    cactus_classic: {
        name: "经典仙人掌",
        preview: "imgs/cactus.png", // 预览图
        image: "imgs/cactus.png"
    },
    rock_normal: {
        name: "普通ddl",
        preview: "imgs/obstacle-1.png", // 【重要】请替换成你自己的文件名
        image: "imgs/obstacle-1.png"
    }
    // 你可以在这里添加更多障碍物...
};
// --- 可选空中障碍物 ---
export const AIR_OBSTACLES = {
    demon_fly: {
        name: "飞行exam",
        preview: "imgs/fly-obstacle-0.png", // 【重要】请换成你的预览图文件名
        image: "imgs/fly-obstacle-0.png"          // 【重要】请换成你的实际图片文件名
    }
    // 你可以在这里添加更多空中障碍物...
};

// --- 可选背景 ---
export const BACKGROUNDS = {
    ground_classic: {
        name: "经典地面",
        preview: "imgs/ground-preview.png", // 【重要】背景需要一张小尺寸的预览图
        image: "imgs/ground.png"
    },
    grassland_day: {
        name: "白天草地",
        preview: "imgs/background-1-preview.png", // 【重要】请替换成你自己的文件名
        image: "imgs/background-1.png"
    }
    // 你可以在这里添加更多背景...
};


// ==================================================
// 2. 管理当前用户的皮肤选择
// ==================================================

// --- 设置默认选择 ---
const DEFAULT_SELECTION = {
    dino: 'dino_classic',
    obstacle: 'cactus_classic',
    background: 'ground_classic',
    airObstacle: 'demon_fly',
};

// --- 从 localStorage 读取用户配置，如果不存在则使用默认值 ---
let currentSelection = JSON.parse(localStorage.getItem('dinoGameCustomSkin')) || DEFAULT_SELECTION;

// --- 安全检查：确保保存的ID在当前版本中仍然有效 ---
// ...
if (!DINOS[currentSelection.dino]) currentSelection.dino = DEFAULT_SELECTION.dino;
// 分别检查地面和空中障碍物
if (!GROUND_OBSTACLES[currentSelection.groundObstacle]) currentSelection.groundObstacle = DEFAULT_SELECTION.groundObstacle;
if (!AIR_OBSTACLES[currentSelection.airObstacle]) currentSelection.airObstacle = DEFAULT_SELECTION.airObstacle;
if (!BACKGROUNDS[currentSelection.background]) currentSelection.background = DEFAULT_SELECTION.background;


// ==================================================
// 3. 导出接口，供其他JS文件使用
// ==================================================

/**
 * 导出一个动态对象，它能随时提供当前组合好的皮肤资源路径。
 * 这是其他JS文件（dino.js, cactus.js, ground.js）将要直接使用的对象。
 */
export let currentSkin = {
    get dino() { return DINOS[currentSelection.dino]; },
    get groundObstacle() { return GROUND_OBSTACLES[currentSelection.groundObstacle]; }, // <-- 新的地面障碍导出
    get airObstacle() { return AIR_OBSTACLES[currentSelection.airObstacle]; },       // <-- 新增的空中障碍导出
    get background() { return BACKGROUNDS[currentSelection.background]; }
};


/**
 * 导出一个函数，用于获取当前选择的ID，方便UI显示哪个被选中。
 */
export function getCurrentSelection() {
    return currentSelection;
}

/**
 * 更新皮肤选择的函数。
 * @param {string} type - 要更改的部件类型 ('dino', 'obstacle', 'background')
 * @param {string} id - 新选择的皮肤ID (例如 'sheep_cute')
 */
export function changeSkinPart(type, id) {
    if (currentSelection.hasOwnProperty(type)) {
        // 检查ID是否有效
        const isValid = (type === 'dino' && DINOS[id]) ||
                        (type === 'groundObstacle' && GROUND_OBSTACLES[id]) || // <-- 新的地面检查
                        (type === 'airObstacle' && AIR_OBSTACLES[id]) ||       // <-- 新增的空中检查
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


// --- 内部函数：将当前选择保存到 localStorage ---
function saveSelection() {
    localStorage.setItem('dinoGameCustomSkin', JSON.stringify(currentSelection));
}
