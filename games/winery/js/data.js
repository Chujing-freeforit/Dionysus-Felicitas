// === 游戏静态数据 (Data.js) ===

const GRAPES = {
    cabernet: {
        id: 'cabernet',
        name: "赤霞珠",
        type:"red",
        cost: 100,
        sellPrice: 150,
        desc: "皮厚耐操，喜干旱。",
        idealWater: 30,
        idealHarvestDay: 12,
        color: "#bd717aff",
        colorName: "深邃宝石红",
        locked: false ,// 默认解锁
        flavorProfile: { fruit: ["黑醋栗", "青椒", "雪松"], body: "饱满", acidity: "中高" },
        agingPotential: 0.9,
        isHardy: false,
    },
    merlot: {
        id: 'merlot',
        name: "梅洛",
        type:"red",
        cost: 300,
        sellPrice: 450,
        desc: "柔和甜美，喜湿润。",
        idealWater: 60,
        idealHarvestDay: 10,
        color: "#bd717aff",
        colorName: "明亮紫红色",
        locked: false, // 默认解锁
        flavorProfile: { fruit: ["李子", "樱桃", "巧克力"], body: "中等", acidity: "中低" },
        agingPotential: 0.5,
        isHardy: false,
    },
    pinot: {
        id: 'pinot',
        name: "黑皮诺",
        type:"red",
        cost: 800,
        sellPrice: 1200,
        desc: "娇贵皇后，极难伺候。",
        idealWater: 70,
        idealHarvestDay: 8,
        color: "#bd717aff",
        colorName: "透亮砖红色",
        locked: true, // 需购买解锁
        unlockCost: 2000, 
        flavorProfile: { fruit: ["草莓", "覆盆子", "湿土"], body: "轻盈", acidity: "高" },
        agingPotential: 0.7 ,
        isHardy: false,
    },
    chardonnay: {
        name: "霞多丽",
        type: "white", // 标记为白葡萄
        cost: 60,      // 种子价格
        sellPrice: 200, // 基础售价
        growthSpeed: 1.1, // 生长速度修正 (1.1表示稍快)
        idealWater: 60, // 喜好水分
        idealHarvestDay: 12,  
        unlockCost: 1500, // 商店解锁配方价格
        color: "#f1c40f", // UI颜色：金黄色
        colorName: "稻草金",
        desc: "白葡萄之后。风格多变，既可清爽也可通过橡木桶陈酿变得圆润。",
        flavorProfile: {fruit: ["黄苹果", "菠萝", "黄油"],body: "饱满",acidity: "中等"},
        agingPotential: 0.6 ,
        isHardy: false,
    },
    sauvignon_blanc: {
        name: "长相思",
        type: "white",
        cost: 45,
        sellPrice: 160,
        growthSpeed: 1.3, // 生长很快
        idealWater: 70,
        idealHarvestDay: 10,
        unlockCost: 800,
        color: "#d4e157", // UI颜色：青绿色
        colorName: "浅青柠色",
        desc: "酸度极高，香气奔放。带有标志性的青草和热带水果气息。",
        flavorProfile: {fruit: ["青柠", "百香果", "青草"],body: "轻盈",acidity: "极高"},
        agingPotential: 0.3,
        isHardy: false,
    },
    riesling: {
        name: "雷司令",
        type: "white",
        cost: 55,
        sellPrice: 190,
        growthSpeed: 0.9, // 生长较慢
        idealWater: 50,
        idealHarvestDay: 12,
        unlockCost: 1200,
        color: "#fff176", // UI颜色：淡黄色
        colorName: "白金色",
        desc: "芳香型葡萄品种。能反映风土，陈年后会发展出独特的汽油味。",
        flavorProfile: {fruit: ["白桃", "杏子", "茉莉花"],body: "中等",acidity: "高"},
        agingPotential: 0.8,
        isHardy: true

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
// 图鉴详细攻略 (教科书版)
const LORE = {
    cabernet: {
        normal: "【品种概述】\n赤霞珠（Cabernet Sauvignon）是红葡萄品种之王。它果皮厚实，富含单宁和色素，生命力极其顽强，是新手庄主最可靠的伙伴。",
        bronze: "【种植指南：水分管理】\n赤霞珠源于波尔多左岸，那里土壤排水性极佳。它极其厌恶积水！\n教科书建议：将土壤水分严格控制在 30% 左右。轻微的干旱胁迫（Water Stress）能促使根系向下扎根，并让果实浓缩风味。",
        silver: "【种植指南：成熟期】\n这是一个晚熟品种。在我们的气候下，它通常需要漫长的生长周期（约12天）才能积累足够的酚类物质。\n警告：过早采摘会导致酒中出现令人不悦的“生青味”（类似青椒的味道）。",
        gold: "【大师笔记：风土的极致】\n要酿造顶级的赤霞珠，你需要在这三个维度做到极致：\n1. 极度贫瘠干旱的土壤（水分<30）；\n2. 漫长的挂果时间让单宁完全成熟；\n3. 酿造时配合深度浸渍提取骨架。\n只有这样，才能展现出它标志性的黑醋栗与雪松香气。"
    },
    // ... 你可以继续模仿上面的格式修改 merlot 和 pinot
    merlot: {
        normal: "梅洛（Merlot）以其柔顺的口感和早熟的特性著称，是波尔多右岸的主角。",
        bronze: "【种植指南：水分】梅洛喜欢凉爽湿润的粘土土壤。保持水分在 50-60% 之间，它能长出肥硕多汁的果实。",
        silver: "【种植指南：采摘】它比赤霞珠早熟。第10天是它的黄金窗口期。如果挂果太久，酸度会迅速下降，导致酒体变得平庸肥腻。",
        gold: "【大师笔记】梅洛的艺术在于“平衡”。它不需要极端的干旱，也不需要过度的萃取。中庸之道，方得圆润甜美的李子与巧克力风味。"
    },
    pinot: {
        normal: "黑皮诺（Pinot Noir）是娇贵的“红葡萄之后”，皮薄易烂，对环境极其敏感。",
        bronze: "【种植指南：水分】它原本生长在凉爽的勃艮第。它需要充足的水分（70%左右）来维持叶片的蒸腾作用，切忌干旱。",
        silver: "【种植指南：早熟】极度早熟！第8天必须采摘。多一天，它就会失去那迷人的草莓香气，甚至开始腐烂。",
        gold: "【大师笔记】种植黑皮诺是在刀尖上跳舞。高水分带来了腐烂的风险，但只有在高水分和短周期的双重限制下，才能诞生出那种如丝绸般顺滑、带有湿土与覆盆子气息的液体红宝石。"
    },
    chardonnay: {
        normal: "霞多丽是世界上种植最广泛的白葡萄品种之一，适应性极强。",
        bronze: "这种葡萄本身香气并不浓郁，因此它是酿酒师展现工艺的最佳画布。",
        silver: "在凉爽气候下，它表现出青苹果和柑橘味；在温暖气候下则转向热带水果味。",
        gold: "经过橡木桶陈酿的顶级霞多丽，会发展出迷人的黄油、烤面包和香草气息，口感如奶油般顺滑。"
    },
    sauvignon_blanc: {
        normal: "起源于法国卢瓦尔河谷的芳香型白葡萄品种。",
        bronze: "它的名字意为'野蛮的白葡萄'，因为它生长旺盛，需要经常修剪。",
        silver: "标志性的高酸度让它成为开胃酒的首选。它非常怕热，喜欢凉爽的气候。",
        gold: "顶级的长相思拥有极其纯净的'猫尿味'（黑醋栗芽孢味）和打火石矿物味，这是风土的极致表达。"
    },
    riesling: {
        normal: "源自德国莱茵河畔的高贵白葡萄品种。",
        bronze: "雷司令极其耐寒，它的木质极其坚硬，能在寒冷的冬季存活。",
        silver: "它拥有极高的天然酸度，这使得它具有极强的陈年潜力，甚至可以陈放几十年。",
        gold: "陈年的雷司令会散发出一种类似'汽油'的独特香气（TDN物质），这是资深酒客追逐的迷人风味。"
    }
};


const EVENTS = [
    // --- 天气与环境 ---
    { text: "突降暴雨！所有地块水分大幅增加 (+20)。", effect: "rain" },
    { text: "遭遇热浪袭击！水分快速蒸发 (-20)，请注意补水。", effect: "drought" },
    
    // --- 生长与灾害 ---
    { text: "酒神节到了！空气中充满魔力，葡萄成熟度提升 (+15)。", effect: "growth_boost" },
    { text: "遭遇了一波虫害！葡萄生长停滞了一段时间 (-10)。", effect: "growth_stunt" },
    
    // --- 经济与经营 ---
    { text: "一群迷路的游客参观了酒庄，购买了一些纪念品 (收入+$200)。", effect: "money_gain", value: 200 },
    { text: "野猪闯进了葡萄园！虽然赶走了它，但围栏被撞坏了 (维修费-$150)。", effect: "money_loss", value: 150 },
    { text: "一位老朋友寄来了一笔赞助金，支持你的梦想 (收入+$500)。", effect: "money_gain", value: 500 },
    
    // --- 纯氛围 (无效果) ---
    { text: "今天风调雨顺，是个好日子。", effect: "none" },
    { text: "你在葡萄藤下发现了一朵不知名的小花，心情变好了。", effect: "none" },
    { text: "远处的教堂传来了钟声，宁静祥和。", effect: "none" }
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
        cost: 800, // 暂时设定为免费或低价
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
    },
     // --- 新增白葡萄指南 ---
    chardonnay: {
        idealVessel: 'new_oak', // 霞多丽适合过桶
        idealCrush: 'light',
        minAging: 5,
        maxAging: 10,
        desc: "霞多丽是白葡萄之后，风格多变，使用新橡木桶能赋予其黄油和烤面包的迷人风味。"
    },
    sauvignon_blanc: {
        idealVessel: 'stainless', // 长相思追求纯净果香
        idealCrush: 'light',
        minAging: 2,
        maxAging: 5,
        desc: "长相思以奔放的香气著称，应使用不锈钢桶快速发酵以保留其新鲜的青草和热带水果气息。"
    },
    riesling: {
        idealVessel: 'stainless', // 雷司令也追求纯净
        idealCrush: 'light',
        minAging: 4,
        maxAging: 15, // 雷司令陈年潜力强
        desc: "雷司令拥有极高的酸度和陈年潜力，适合在惰性容器中慢慢发展风味。"
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
    },red_grape: {
        title: "红葡萄 (Red Grape)",
        desc: "果皮颜色较深的葡萄品种。酿造红葡萄酒时，果皮必须与果汁一起发酵（浸皮），以提取果皮中的色素（花青素）和单宁。正是果皮赋予了红酒其颜色和涩感结构。"
    },
    white_grape: {
        title: "白葡萄 (White Grape)",
        desc: "果皮颜色为绿色或黄色的葡萄品种。酿造白葡萄酒时，通常在发酵前就将果皮去除并压榨，只用澄清的果汁进行发酵。因此白葡萄酒通常单宁含量极低，口感更注重酸度和果香。"
    },
    // --- 破碎工艺 ---
    crush_light: { title: "轻度破碎", desc: "尽量保持葡萄颗粒完整，减少皮渣接触。适合酿造单宁低、果香清新的红酒（如黑皮诺）或白葡萄酒。" },
    crush_deep: { title: "深度浸渍", desc: "延长果皮与果汁的接触时间，甚至加热。能提取最深邃的颜色和最强劲的单宁，是陈年型红酒的基础。" },
    
    // --- 酵母知识 ---
    yeast_wild: { title: "野生酵母", desc: "葡萄皮上天然附着的酵母。使用它们酿酒就像赌博，可能诞生绝世佳酿，也可能因为杂菌污染而产生异味。" },
    yeast_cultured: { title: "商业酵母", desc: "实验室培育的优选菌株。它们能确保发酵顺利完成，产生预期的香气，是现代工业酿酒的基石。" },
    
    bottle_aging: {
        title: "瓶中陈年 (Bottle Aging)",
        desc: "葡萄酒装瓶后仍在缓慢发展。氧气不再是主导，瓶内发生的微观化学反应（酯化反应）会让果香转化为更复杂的陈年香气。单宁和酸度是陈年的骨架，它们能支撑酒体走得更远。"
    },
    aging_curve: {
        title: "陈年曲线 (Aging Curve)",
        desc: "每瓶酒都有自己的生命周期，如抛物线般。从年轻、发展、适饮巅峰，到衰退、死亡。优秀的酒陈年潜力长，巅峰期平台宽广。而普通的酒可能出厂即巅峰，久放反而失去风味。"
    },

    // --- 容器知识 ---
    vessel_oak: { title: "橡木桶陈酿", desc: "橡木桶不仅是容器，更是调味品。它赋予酒体香草、烟熏、丁香等风味，微量氧气还能柔化单宁。" },
    vessel_stainless: { title: "惰性容器", desc: "不锈钢或水泥槽。它们不会给酒添加任何味道，能最大程度保留葡萄本身来自土地和气候的原始风味。" }

};
// 增加一种成品等级：铱星 (分数 > 140)
QUALITY_LEVELS.iridium = { name: "铱星", multiplier: 5.0, color: "#e1bee7" }; // 紫色传说
// === 1. 新增：酵母类型配置 ===
const YEAST_TYPES = {
    wild: { 
        name: "野生酵母", 
        desc: "不可预测的风味赌博。", 
        cost: 0, 
        unlockCost: 0, // 默认解锁
        flavorMod: "风味狂野复杂，品质波动大" 
    },
    cultured: { 
        name: "商业酵母", 
        desc: "稳定可靠，发酵迅速。", 
        cost: 10, // 每次使用消耗金币
        unlockCost: 500, // 商店解锁价格
        flavorMod: "果香纯净，品质稳定" 
    },
    special: { 
        name: "特选酵母", 
        desc: "针对特定品种优化。", 
        cost: 50, 
        unlockCost: 1200, 
        flavorMod: "极大提升特定品种表现" 
    }
};

// 在 js/data.js 文件末尾追加

const COMMISSIONS = [
    // === 早期订单 (10种) ===
    // 目标：引导玩家熟悉基础品种和品质概念
    { id: 'c001', text: "镇上的小酒馆需要一批基础餐酒。", requirements: { grape: 'cabernet', quality: 'normal' }, rewardMultiplier: 1.2 },
    { id: 'c002', text: "一位女士想尝尝柔和的红酒。", requirements: { grape: 'merlot', quality: 'bronze' }, rewardMultiplier: 1.3 },
    { id: 'c003', text: "面包师傅想用葡萄酒做面包，需要一瓶便宜的。", requirements: { grape: 'cabernet' }, rewardMultiplier: 1.15 }, // 任何品质都行
    { id: 'c004', text: "一位年轻学者对“风土”概念着迷，想对比一下赤霞珠和梅洛。", requirements: { grape: 'merlot' }, rewardMultiplier: 1.2 },
    { id: 'c005', text: "守卫队的日常配给，需要一批铜星品质的酒。", requirements: { quality: 'bronze' }, rewardMultiplier: 1.25 }, // 任何品种都行
    { id: 'c006', text: "庆祝丰收节，村长需要一瓶银星品质的酒来招待客人。", requirements: { quality: 'silver' }, rewardMultiplier: 1.4 },
    { id: 'c007', text: "吟游诗人没有钱，但希望能用故事换一瓶黑皮诺。", requirements: { grape: 'pinot' }, rewardMultiplier: 1.1 },
    { id: 'c008', text: "猎人打到了野味，需要一瓶能搭配的红酒。", requirements: { grape: 'cabernet', quality: 'bronze' }, rewardMultiplier: 1.3 },
    { id: 'c009', text: "有人想试试轻盈口感的红酒。", requirements: { grape: 'pinot', quality: 'normal' }, rewardMultiplier: 1.2 },
    { id: 'c010', text: "杂货店老板想了解你的手艺，需要一瓶你最好的酒。", requirements: { quality: 'silver' }, rewardMultiplier: 1.35 },

    // === 中期订单 (10种) ===
    // 目标：引导玩家探索白葡萄和基础工艺
    { id: 'c101', text: "一位富商对新橡木桶风味很好奇。", requirements: { grape: 'chardonnay', settings: { vessel: 'new_oak' } }, rewardMultiplier: 1.5 },
    { id: 'c102', text: "一位美食家在寻找高酸度的开胃酒。", requirements: { grape: 'sauvignon_blanc', quality: 'silver' }, rewardMultiplier: 1.4 },
    { id: 'c103', text: "夏季派对需要清爽的白葡萄酒，不要橡木桶味！", requirements: { grape: 'sauvignon_blanc', settings: { vessel: 'stainless' } }, rewardMultiplier: 1.45 },
    { id: 'c104', text: "一位画家想用雷司令的香气寻找灵感。", requirements: { grape: 'riesling', quality: 'bronze' }, rewardMultiplier: 1.3 },
    { id: 'c105', text: "有客户想定制一批单宁强劲的酒。", requirements: { grape: 'cabernet', settings: { crush: 'deep' } }, rewardMultiplier: 1.6 },
    { id: 'c106', text: "一位女士偏爱丝滑口感，指定要轻度破碎的黑皮诺。", requirements: { grape: 'pinot', quality: 'silver', settings: { crush: 'light' } }, rewardMultiplier: 1.7 },
    { id: 'c107', text: "炼金术士需要一批用“商业酵母”稳定发酵的酒作为实验基底。", requirements: { settings: { yeast: 'cultured' } }, rewardMultiplier: 1.4 },
    { id: 'c108', text: "德鲁伊想感受最原始的风味，指定要“野生酵母”酿的酒。", requirements: { quality: 'silver', settings: { yeast: 'wild' } }, rewardMultiplier: 1.5 },
    { id: 'c109', text: "一位大厨需要果香纯粹的霞多丽来烹饪海鲜。", requirements: { grape: 'chardonnay', settings: { vessel: 'stainless' } }, rewardMultiplier: 1.5 },
    { id: 'c110', text: "商队需要一批耐储存的酒，最好是用旧橡木桶酿的。", requirements: { quality: 'bronze', settings: { vessel: 'used_oak' } }, rewardMultiplier: 1.4 },

    // === 后期订单 (10种) ===
    // 目标：考验玩家对高级工艺、陈年和高品质的综合运用能力
    { id: 'c201', text: "一位收藏家正在寻觅有陈年潜力的黑皮诺。", requirements: { grape: 'pinot', quality: 'gold', minAge: 10 }, rewardMultiplier: 1.8 },
    { id: 'c202', text: "王室晚宴需要顶级的、陈年过的雷司令。", requirements: { grape: 'riesling', quality: 'gold', minAge: 5 }, rewardMultiplier: 2.0 },
    { id: 'c203', text: "一位退役将军想回忆往事，需要一瓶陈年超过20天的赤霞珠。", requirements: { grape: 'cabernet', quality: 'silver', minAge: 20 }, rewardMultiplier: 1.9 },
    { id: 'c204', text: "年度评酒大会需要一瓶能代表你最高水平的作品。", requirements: { quality: 'iridium' }, rewardMultiplier: 3.0 }, // 铱星品质
    { id: 'c205', text: "一位神秘的贵族想购买一瓶“液体黄金”——用特选酵母酿造的金星霞多丽。", requirements: { grape: 'chardonnay', quality: 'gold', settings: { yeast: 'special' } }, rewardMultiplier: 2.2 },
    { id: 'c206', text: "一位历史学家想研究陈年后的雷司令会产生什么风味。", requirements: { grape: 'riesling', minAge: 15 }, rewardMultiplier: 1.8 },
    { id: 'c207', text: "宫廷需要一瓶结构宏大、适合长期窖藏的赤霞珠。", requirements: { grape: 'cabernet', quality: 'gold', settings: { crush: 'deep', vessel: 'new_oak' } }, rewardMultiplier: 2.5 },
    { id: 'c208', text: "一位挑剔的评论家想品尝最纯粹的黑皮诺，要求无橡木桶影响且品质极高。", requirements: { grape: 'pinot', quality: 'gold', settings: { vessel: 'stainless' } }, rewardMultiplier: 2.0 },
    { id: 'c209', text: "邻国的王子听闻你的美酒，希望能获得一瓶陈年的银星梅洛。", requirements: { grape: 'merlot', quality: 'silver', minAge: 12 }, rewardMultiplier: 1.8 },
    { id: 'c210', text: "酒神节祭典，需要一瓶传说品质的酒作为祭品。", requirements: { quality: 'iridium', minAge: 10 }, rewardMultiplier: 5.0 } // 终极任务
];
const SEASONS = {
    spring: {
        name: "春季",
        weather: { sunny: 0.4, cloudy: 0.3, rainy: 0.3 } // 雨水多
    },
    summer: {
        name: "夏季",
        weather: { sunny: 0.8, cloudy: 0.2, rainy: 0.0 } // 极热，不下雨
    },
    autumn: {
        name: "秋季",
        weather: { sunny: 0.5, cloudy: 0.4, rainy: 0.1 } // 舒适
    },
    winter: {
        name: "冬季",
        weather: { sunny: 0.3, cloudy: 0.5, rainy: 0.2 } // 阴冷 (这里的rainy可以理解为雪)
    }
};
// data.js -> 添加在文件末尾

const FARM_UPGRADES = {
    sprinkler: { 
        name: "应急喷淋系统", 
        cost: 2000, 
        desc: "安全第一！当水分低于10%时自动补水，防止植物干死。", 
        icon: "fa-faucet" 
    },
    scarecrow: { 
        name: "生态驱虫塔", 
        cost: 1500, 
        desc: "高科技声波驱逐野猪和害虫，免疫相关负面事件。", 
        icon: "fa-shield-alt" 
    },
    fertilizer: { 
        name: "高级土壤改良", 
        cost: 3000, 
        desc: "提升地力。收获时评分加成，更容易获得高品质果实。", 
        icon: "fa-leaf" 
    },
    greenhouse: { 
        name: "恒温大棚", 
        cost: 5000, 
        desc: "无视季节限制！允许在冬季种植任何葡萄，且不会冻死。", 
        icon: "fa-warehouse" 
    }
};
