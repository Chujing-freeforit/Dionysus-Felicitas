// === 游戏状态管理 (State.js V8.0 Final) ===

const State = {
    money: 1000,
    day: 1,
    weather: 'sunny',
    nextWeather: 'cloudy',
    
    inventory: [], 
    plots: Array(9).fill(null), 
    unlockedPlots: 3, 
    selectedPlotIndex: -1, 
    plantingTargetIndex: -1,

    // 酿造系统
    brewingSlots: [null, null, null, null, null, null],
    maxBarrels: 3,

    // 解锁系统
    unlockedGrapes: ['cabernet', 'merlot'], 
    unlockedDevices: [], // 新增：已解锁的设备 (如 'new_oak')
    
    // 图鉴与百科
    handbook: {}, 
    unlockedTerms: [],

    init() {
        // 尝试自动加载，失败则重置
        if (!this.load()) this.resetData();
    },

    resetData() {
        this.money = 1000;
        this.day = 1;
        this.weather = 'sunny';
        this.nextWeather = 'cloudy';
        this.inventory = [];
        this.plots = Array(9).fill(null);
        this.unlockedPlots = 3;
        this.brewingSlots = Array(6).fill(null);
        this.maxBarrels = 3;
        this.unlockedGrapes = ['cabernet', 'merlot'];
        this.unlockedDevices = [];
        this.selectedPlotIndex = -1;
        this.plantingTargetIndex = -1;
        this.unlockedTerms = [];
        this.handbook = {};
        for(let key in GRAPES) {
            this.handbook[key] = { normal: false, bronze: false, silver: false, gold: false };
        }
    },

    save() {
        const data = {
            money: this.money,
            day: this.day,
            weather: this.weather,
            nextWeather: this.nextWeather,
            inventory: this.inventory,
            plots: this.plots,
            brewingSlots: this.brewingSlots,
            maxBarrels: this.maxBarrels,
            unlockedPlots: this.unlockedPlots,
            unlockedGrapes: this.unlockedGrapes,
            unlockedDevices: this.unlockedDevices,
            handbook: this.handbook,
            unlockedTerms: this.unlockedTerms
        };
        localStorage.setItem('winery_save_v1', JSON.stringify(data));
    },

    load() {
        const json = localStorage.getItem('winery_save_v1');
        if (!json) return false;
        try {
            const data = JSON.parse(json);
            Object.assign(this, data);
            
            // 兼容性修补
            if (!this.brewingSlots) this.brewingSlots = Array(6).fill(null);
            else {
                while(this.brewingSlots.length < 6) this.brewingSlots.push(null);
            }
            if (!this.maxBarrels) this.maxBarrels = 3;
            if (!this.unlockedTerms) this.unlockedTerms = [];
            if (!this.unlockedDevices) this.unlockedDevices = [];

            this.selectedPlotIndex = -1;
            this.plantingTargetIndex = -1;
            return true;
        } catch (e) {
            console.error("存档损坏", e);
            return false;
        }
    },

    clearSave() {
        localStorage.removeItem('winery_save_v1');
    },

    // --- 核心计算 ---
    getNextLandCost() {
        const upgradeCount = this.unlockedPlots - 3;
        return LAND_UPGRADE.baseCost * Math.pow(LAND_UPGRADE.multiplier, upgradeCount);
    },

    getNextBarrelCost() {
        const upgradeCount = this.maxBarrels - 3;
        return Math.floor(WINERY_UPGRADES.baseCost * Math.pow(WINERY_UPGRADES.multiplier, upgradeCount));
    },

    unlockGrape(id) {
        if (!this.unlockedGrapes.includes(id)) {
            this.unlockedGrapes.push(id);
            this.save();
            return true;
        }
        return false;
    },

    unlockDevice(id) {
        if (!this.unlockedDevices.includes(id)) {
            this.unlockedDevices.push(id);
            this.save();
            return true;
        }
        return false;
    },

    unlockLore(grapeId, qualityKey) {
        if (this.handbook[grapeId] && !this.handbook[grapeId][qualityKey]) {
            this.handbook[grapeId][qualityKey] = true;
            this.save();
            return true;
        }
        return false;
    },

    unlockTerm(termKey) {
        if (!this.unlockedTerms.includes(termKey)) {
            this.unlockedTerms.push(termKey);
            this.save();
            return true;
        }
        return false;
    },

    // --- 酿造核心 ---
    startBrewing(slotIndex, grapeId, quality, settings) {
        if (this.removeItem('fruit', grapeId, quality, 1)) {
            this.brewingSlots[slotIndex] = {
                grapeKey: grapeId,
                quality: quality,
                settings: settings, 
                daysAged: 0,
                startDay: this.day
            };
            this.save();
            return true;
        }
        return false;
    },

    updateBrewing() {
        this.brewingSlots.forEach(slot => {
            if (slot) slot.daysAged++;
        });
    },

    // --- 库存核心 ---
    addItem(type, id, quality = 'normal', count = 1, data = null) {
        // 如果有额外数据(如酿造参数)，则不堆叠，直接新增条目
        // 或者简单点：只有酒不堆叠？为了简化，我们假设同品质同类型的酒可以堆叠，但这样会丢失每瓶酒独特的酿造数据。
        // 为了实现“每瓶酒都有独特信息”，酒类物品不应该堆叠，或者只堆叠完全一样的。
        // 这里采用简化方案：酒类物品如果 data 不同，则不堆叠。
        
        let existing = null;
        if (!data) {
            existing = this.inventory.find(i => i.type === type && i.id === id && i.quality === quality && !i.data);
        } else {
            // 深度比较 data
            existing = this.inventory.find(i => i.type === type && i.id === id && i.quality === quality && JSON.stringify(i.data) === JSON.stringify(data));
        }

        if (existing) {
            existing.count += count;
        } else {
            let suffix = type === 'seed' ? '种子' : '';
            if (type === 'wine') suffix = '葡萄酒';
            this.inventory.push({
                type, id, quality, count, data,
                name: GRAPES[id].name + suffix
            });
        }
        this.save();
    },

    removeItem(type, id, quality = 'normal', count = 1) {
        // 移除时优先移除没有 data 的，或者简单处理：找到第一个匹配的
        const index = this.inventory.findIndex(i => i.type === type && i.id === id && i.quality === quality);
        if (index !== -1) {
            this.inventory[index].count -= count;
            if (this.inventory[index].count <= 0) {
                this.inventory.splice(index, 1);
            }
            this.save();
            return true;
        }
        return false;
    },

    plantSeed(plotIndex, grapeId) {
        if (this.removeItem('seed', grapeId)) {
            this.plots[plotIndex] = {
                grapeKey: grapeId,
                water: 50,
                maturity: 0,
                daysPlanted: 0
            };
            this.save();
            return true;
        }
        return false;
    },

    nextDay() {
        this.day++;
        this.weather = this.nextWeather;
        const rand = Math.random();
        if (rand < 0.4) this.nextWeather = 'sunny';
        else if (rand < 0.7) this.nextWeather = 'cloudy';
        else this.nextWeather = 'rainy';

        let event = null;
        if (Math.random() < 0.2) {
            event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
            this.handleEvent(event);
        }
        this.save();
        return event;
    },

    handleEvent(event) {
        if (event.effect === 'rain') {
            this.plots.forEach(p => { if(p) p.water += 30; });
        } else if (event.effect === 'growth') {
            this.plots.forEach(p => { if(p) p.maturity += 10; });
        }
    },

    updateAllPlots() {
        this.plots.forEach((plot, index) => {
            if (index < this.unlockedPlots && plot) {
                plot.daysPlanted++;
                if (this.weather === 'sunny') plot.water -= 10;
                else if (this.weather === 'cloudy') plot.water -= 5;
                else if (this.weather === 'rainy') plot.water += 20;
                plot.water = Math.max(0, Math.min(100, plot.water));

                let growth = 10;
                if (plot.water < 20 || plot.water > 80) growth = 5;
                plot.maturity = Math.min(100, plot.maturity + growth);
            }
        });
    }
};
