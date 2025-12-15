// === 游戏静态数据 (Data.js) ===

const GRAPES = {
    cabernet: {
        id: 'cabernet',
        name: "赤霞珠",
        cost: 100,
        sellPrice: 150,
        desc: "皮厚耐操，喜干旱。",
        idealWater: 30,
        idealHarvestDay: 12,
        color: "#bd717aff",
        colorName: "深邃宝石红",
        locked: false ,// 默认解锁
        flavorProfile: { fruit: ["黑醋栗", "青椒", "雪松"], body: "饱满", acidity: "中高" }
    },
    merlot: {
        id: 'merlot',
        name: "梅洛",
        cost: 300,
        sellPrice: 450,
        desc: "柔和甜美，喜湿润。",
        idealWater: 60,
        idealHarvestDay: 10,
        color: "#bd717aff",
        colorName: "明亮紫红色",
        locked: false, // 默认解锁
        flavorProfile: { fruit: ["李子", "樱桃", "巧克力"], body: "中等", acidity: "中低" }
    },
    pinot: {
        id: 'pinot',
        name: "黑皮诺",
        cost: 800,
        sellPrice: 1200,
        desc: "娇贵皇后，极难伺候。",
        idealWater: 70,
        idealHarvestDay: 8,
        color: "#bd717aff",
        colorName: "透亮砖红色",
        locked: true, // 需购买解锁
        unlockCost: 2000, 
        flavorProfile: { fruit: ["草莓", "覆盆子", "湿土"], body: "轻盈", acidity: "高" }
    }
};

const QUALITY_LEVELS = {
    normal: { name: "普通", multiplier: 1.0, color: "#95a5a6" },
    bronze: { name: "铜星", multiplier: 1.2, color: "#cd7f32" },
    silver: { name: "银星", multiplier: 1.5, color: "#bdc3c7" },
    gold:   { name: "金星", multiplier: 2.0, color: "#ffd700" }
};

// 土地升级配置
const LAND_UPGRADE = {
    baseCost: 500, // 第4块地的价格
    multiplier: 2.0 // 几何倍数 (500 -> 1000 -> 2000 -> 4000...)
};

// 图鉴详细攻略 (按品质解锁)
// 只有获得过对应品质，才能看到这句话
const LORE = {
    cabernet: {
        normal: "赤霞珠生命力顽强，是新手的最佳选择。",
        bronze: "提示：它不喜欢太多的水，保持土壤干燥(水分30左右)是关键。",
        silver: "提示：它属于晚熟品种，耐心等待到第12天左右再采摘。",
        gold: "大师笔记：完美的赤霞珠需要在极度干旱(水分30)和漫长等待(12天)中诞生。"
    },
    merlot: {
        normal: "梅洛口感柔和，适应性较强。",
        bronze: "提示：保持中庸之道，水分控制在50-60之间。",
        silver: "提示：成熟速度适中，第10天是它的黄金采摘期。",
        gold: "大师笔记：不干不湿，不早不晚。梅洛的中庸即是完美。"
    },
    pinot: {
        normal: "黑皮诺是“心碎之葡萄”，极难种植。",
        bronze: "提示：它喜欢湿润的环境，水分需要保持在70左右。",
        silver: "提示：它非常早熟！第8天就必须采摘，晚了就会烂掉。",
        gold: "大师笔记：高风险高回报。在第8天保持高水分(70)，你将得到液体的红宝石。"
    }
};

const EVENTS = [
    { text: "野猪闯进了葡萄园！破坏了一些设施。", effect: "none" },
    { text: "酒神节到了！所有葡萄成熟度 +10。", effect: "growth" },
    { text: "突然的暴雨！所有地块水分激增。", effect: "rain" },
    { text: "风调雨顺，是个好日子。", effect: "none" }
];
// === 游戏静态数据 (V6.0 新增) ===

// 酿造容器 (Vessel)
const VESSELS = {
    stainless: { 
        name: "不锈钢罐", 
        desc: "精准温控，保留纯粹果香。", 
        cost: 0, 
        style: "fruity",
        flavorMod: "纯净果香，无额外修饰" // 风格标签：果味
    },
    used_oak: { 
        name: "旧橡木桶", 
        desc: "微量透气，口感柔和，无额外风味。", 
        cost: 0, // 暂时设定为免费或低价
        style: "balanced" ,
        flavorMod: "口感柔和，微氧化"// 风格标签：平衡
    },
    new_oak: { 
        name: "新橡木桶", 
        desc: "浓郁香草与烤面包气息，陈酿利器。", 
        cost: 0, // 需要每次支付使用费，或作为一次性解锁(这里简化为使用费)
        style: "oaky", // 风格标签：橡木味
        unlockCost: 2000,
        flavorMod: "赋予香草与烤面包风味"
    }
};

// 破碎工艺 (Crush)
const CRUSH_METHODS = {
    light: { name: "轻度破碎", desc: "低单宁，轻酒体。", suitability: ['merlot', 'pinot'] ,flavorMod: "单宁丝滑，酒体轻盈" },
    medium: { name: "标准压榨", desc: "平衡之选。", suitability: ['cabernet', 'merlot'],flavorMod: "结构平衡，适中单宁" },
    deep: { name: "深度浸渍", desc: "高单宁，深颜色。", suitability: ['cabernet'],flavorMod: "单宁强劲，颜色深邃"  }
};

// 评分逻辑配置
// 每种葡萄有其“最佳工序组合”
// 格式: { grapeId: { vessel: [good], crush: [good], aging: idealDays } }
const BREWING_GUIDE = {
    cabernet: {
        idealVessel: 'new_oak', // 喜欢新桶
        idealCrush: 'deep',     // 喜欢重口
        minAging: 6,            // 至少6天
        maxAging: 12,           // 超过12天过老
        desc: "赤霞珠皮厚单宁重，需要深度浸渍提取风味，并使用新橡木桶长期陈酿以柔化单宁。"
    },
    merlot: {
        idealVessel: 'used_oak', // 喜欢旧桶或钢桶
        idealCrush: 'medium',
        minAging: 4,
        maxAging: 8,
        desc: "梅洛追求柔和，适合旧橡木桶或标准压榨，陈酿时间适中。"
    },
    pinot: {
        idealVessel: 'stainless', // 喜欢钢桶保留果香 (或者旧桶)
        idealCrush: 'light',      // 必须轻柔
        minAging: 3,
        maxAging: 6,
        desc: "黑皮诺极其娇贵，应采用轻度破碎，并使用不锈钢桶或旧桶快速陈酿，避免氧化。"
    }
};
// 工坊升级配置 (新增)
const WINERY_UPGRADES = {
    maxSlots: 6, // 最多6个桶
    baseCost: 800, // 第4个桶的价格
    multiplier: 1.5 // 价格增长倍率
};

// 酿酒百科全书 (新增核心)
const DICTIONARY = {
    maceration: {
        title: "浸渍 (Maceration)",
        desc: "指葡萄汁与葡萄皮接触的过程。皮中含有色素和单宁，接触时间越长（深度浸渍），红酒颜色越深，单宁越强劲，陈酿潜力越久。"
    },
    tannin: {
        title: "单宁 (Tannin)",
        desc: "来自葡萄皮和橡木桶的酚类物质。它给口腔带来“涩”的感觉，是红酒的骨架。没有单宁的酒如同一团软肉，难以陈年。"
    },
    oak: {
        title: "橡木桶 (Oak Aging)",
        desc: "不仅是容器，更是香料。新橡木桶能赋予葡萄酒香草、烟熏、丁香等风味，同时微量的氧气进入能让单宁变得柔和。"
    },
    oxidation: {
        title: "氧化 (Oxidation)",
        desc: "氧气是把双刃剑。适量氧化能熟化酒体，过度氧化则会产生乙醛，使葡萄酒变成醋。把握陈酿时长至关重要。"
    },
    stainless: {
        title: "不锈钢发酵",
        desc: "现代酿酒技术的象征。完全隔绝氧气，精准控制温度。这种工艺能最大限度地保留葡萄本身的新鲜果香，适合年轻饮用的酒。"
    },
    terroir: {
        title: "风土 (Terroir)",
        desc: "天、地、人的总和。土壤的水分、当年的降雨、阳光的照射，共同决定了葡萄的品质。这就是为什么我们需要根据天气决定种植策略。"
    }
};
// 增加一种成品等级：铱星 (分数 > 140)
QUALITY_LEVELS.iridium = { name: "铱星", multiplier: 5.0, color: "#e1bee7" }; // 紫色传说
