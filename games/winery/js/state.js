// === 游戏状态管理 (State.js V11.0 单块土地升级版) ===

const State = {
    money: 1000,
    day: 1,
    weather: 'sunny',
    nextWeather: 'cloudy',
    
    // 季节系统
    dayInSeason: 1,
    season: 'spring', // spring, summer, autumn, winter

    // 财务统计
    statistics: {
        totalEarned: 0,
        totalSpent: 0,
        weekly: {
            earned: { sales: 0, commissions: 0, bailout: 0, misc: 0 },
            spent: { seeds: 0, upgrades: 0, maintenance: 0, misc: 0 }
        }
    },

    activeCommissions: [],
    completedCommissionIds: [],
    
    inventory: [], 
    
    // --- 核心结构变更：地块现在是对象数组 ---
    // 结构: { plant: {grapeKey, water...} | null, upgrades: ['greenhouse', ...] }
    plots: [], 
    
    unlockedPlots: 3, 
    selectedPlotIndex: -1, 
    plantingTargetIndex: -1,

    brewingSlots: Array(6).fill(null),
    maxBarrels: 3,

    unlockedGrapes: ['cabernet', 'merlot'], 
    unlockedDevices: [], 
    
    // 全局升级 (喷淋、驱虫) 存在这里
    unlockedUpgrades: [], 
    
    handbook: {}, 
    unlockedTerms: [],
    unlockedCrafts: {vessels: ['stainless'], crush: ['light'], yeast: ['wild']},

    storyFlags: {
        introSeen: false,
        firstShopSeen: false,
        firstDeathSeen: false,
        firstCellarSeen: false,
        firstWinerySeen: false,
        firstHandbookSeen: false,
        bailoutGiven: false
    },

    init() {
        if (!this.load()) this.resetData();
    },

    resetData() {
        this.money = 1000;
        this.day = 1;
        this.dayInSeason = 1;
        this.season = 'spring';
        this.weather = 'sunny';
        this.nextWeather = 'cloudy';
        
        this.inventory = [];
        
        // --- 初始化 9 个新结构地块 ---
        this.plots = Array(9).fill(0).map(() => ({ plant: null, upgrades: [] }));
        
        this.unlockedPlots = 3;
        this.brewingSlots = Array(6).fill(null);
        this.maxBarrels = 3;
        this.unlockedGrapes = ['cabernet', 'merlot'];
        this.unlockedDevices = [];
        this.unlockedUpgrades = []; // 重置全局升级
        this.selectedPlotIndex = -1;
        this.plantingTargetIndex = -1;
        this.unlockedTerms = [];
        this.handbook = {};
        this.unlockedCrafts = {vessels: ['stainless'], crush: ['light'], yeast: ['wild']};
        this.activeCommissions = [];
        this.completedCommissionIds = [];
        
        this.statistics = {
            totalEarned: 0,
            totalSpent: 0,
            weekly: {
                earned: { sales: 0, commissions: 0, bailout: 0, misc: 0 },
                spent: { seeds: 0, upgrades: 0, maintenance: 0, misc: 0 }
            }
        };

        this.storyFlags = { 
            introSeen: false, firstShopSeen: false, firstDeathSeen: false,
            firstCellarSeen: false, firstWinerySeen: false, firstHandbookSeen: false,
            bailoutGiven: false
        };

        for(let key in GRAPES) {
            this.handbook[key] = { normal: false, bronze: false, silver: false, gold: false };
        }
    },

    save() {
        const data = {
            money: this.money,
            day: this.day,
            dayInSeason: this.dayInSeason,
            season: this.season,
            weather: this.weather,
            nextWeather: this.nextWeather,
            inventory: this.inventory,
            plots: this.plots,
            brewingSlots: this.brewingSlots,
            maxBarrels: this.maxBarrels,
            unlockedPlots: this.unlockedPlots,
            unlockedGrapes: this.unlockedGrapes,
            unlockedDevices: this.unlockedDevices,
            unlockedUpgrades: this.unlockedUpgrades, // 保存全局升级
            unlockedCrafts: this.unlockedCrafts,
            handbook: this.handbook,
            unlockedTerms: this.unlockedTerms,
            activeCommissions: this.activeCommissions,
            completedCommissionIds: this.completedCommissionIds,
            storyFlags: this.storyFlags,
            statistics: this.statistics,
        };
        localStorage.setItem('winery_save_v1', JSON.stringify(data));
    },

    load() {
        const json = localStorage.getItem('winery_save_v1');
        if (!json) return false;
        try {
            const data = JSON.parse(json);
            Object.assign(this, data);
            
            // --- 土地结构兼容性修复 ---
            if (this.plots) {
                this.plots = this.plots.map(p => {
                    // 旧存档: null -> 新空地
                    if (p === null) return { plant: null, upgrades: [] };
                    // 旧存档: 植物对象 -> 包裹进 plant
                    if (p && !p.plant && !Array.isArray(p.upgrades)) return { plant: p, upgrades: [] };
                    // 新存档: 保持原样
                    return p;
                });
            } else {
                this.plots = Array(9).fill(0).map(() => ({ plant: null, upgrades: [] }));
            }

            if (!this.brewingSlots) this.brewingSlots = Array(6).fill(null);
            while(this.brewingSlots.length < 6) this.brewingSlots.push(null);
            
            if (!this.unlockedCrafts) {
                this.unlockedCrafts = { vessels: ['stainless', 'used_oak', 'new_oak'], crush: ['light', 'medium', 'deep'], yeast: ['wild'] };
            }
            
            if (!this.unlockedUpgrades) this.unlockedUpgrades = [];

            if (this.dayInSeason === undefined) {
                this.dayInSeason = (this.day % 28) + 1;
                const seasonIndex = Math.floor(this.day / 28) % 4;
                this.season = ['spring', 'summer', 'autumn', 'winter'][seasonIndex];
            }

            if (!this.handbook) this.handbook = {};
            for (const grapeKey in GRAPES) {
                if (!this.handbook[grapeKey]) {
                    this.handbook[grapeKey] = { normal: false, bronze: false, silver: false, gold: false };
                }
            }
            
            if (!this.statistics.weekly.earned.misc) this.statistics.weekly.earned.misc = 0;

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
    
    unlockCraft(category, id) {
        if (!this.unlockedCrafts[category]) this.unlockedCrafts[category] = [];
        if (!this.unlockedCrafts[category].includes(id)) {
            this.unlockedCrafts[category].push(id);
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
        let existing = null;
        
        // 我们定义：新加入仓库的物品，陈年时间默认为 0。
        // 只有当仓库里也有一堆“陈年时间为 0”的同类物品时，才允许合并。
        const newAge = 0; 

        // --- 查找逻辑升级 ---
        existing = this.inventory.find(i => {
            // 1. 基础属性必须匹配 (类型、ID、品质)
            const basicMatch = i.type === type && i.id === id && i.quality === quality;
            
            // 2. 配方数据必须匹配 (酿造工艺)
            // 如果新物品没data，旧物品也不能有；如果有，必须转成字符串对比
            const dataMatch = !data ? !i.data : JSON.stringify(i.data) === JSON.stringify(data);
            
            // 3. 【关键】陈年时间必须匹配
            // i.bottleAge || 0 意思是：如果物品没有这个属性(比如种子)，就当做0处理
            const ageMatch = (i.bottleAge || 0) === newAge;

            return basicMatch && dataMatch && ageMatch;
        });
        // ------------------

        if (existing) {
            existing.count += count;
        } else {
            let suffix = type === 'seed' ? '种子' : '';
            if (type === 'wine') suffix = '葡萄酒';
            
            // 创建新物品时，显式初始化 bottleAge 和 isAging
            this.inventory.push({
                type, id, quality, count, data,
                name: GRAPES[id].name + suffix,
                bottleAge: 0, // 新物品永远是 0 天
                isAging: false // 默认不在陈年状态
            });
        }
        this.save();
    },

    removeItem(type, id, quality = 'normal', count = 1) {
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

    removeItemByIndex(index, count = 1) {
        if (!this.inventory[index]) return false;
        this.inventory[index].count -= count;
        if (this.inventory[index].count <= 0) {
            this.inventory.splice(index, 1);
        }
        this.save();
        return true;
    },

    plantSeed(plotIndex, grapeId) {
        if (this.removeItem('seed', grapeId)) {
            // 修改：只更新 plant 属性，保留 upgrades
            this.plots[plotIndex].plant = {
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

    // --- 季节与天气核心 ---
    nextDay() {
        this.day++;
        
        // 1. 计算季节
        const daysPerSeason = 28;
        const seasonOrder = ['spring', 'summer', 'autumn', 'winter'];
        
        this.dayInSeason = ((this.day - 1) % daysPerSeason) + 1;
        const seasonIndex = Math.floor((this.day - 1) / daysPerSeason) % 4;
        const currentSeasonKey = seasonOrder[seasonIndex];
        this.season = currentSeasonKey;
        
        let seasonChanged = false;
        if (this.dayInSeason === 1 && this.day > 1) {
            seasonChanged = true;
            if (currentSeasonKey === 'winter') {
                this.killNonHardyPlants();
            }
        }

        // 2. 生成天气
        this.weather = this.nextWeather;
        const rules = (typeof SEASONS !== 'undefined') ? SEASONS[currentSeasonKey].weather : { sunny: 0.5, cloudy: 0.3, rainy: 0.2 };
        
        const rand = Math.random();
        if (rand < rules.sunny) {
            this.nextWeather = 'sunny';
        } else if (rand < rules.sunny + rules.cloudy) {
            this.nextWeather = 'cloudy';
        } else {
            this.nextWeather = 'rainy';
        }

        // 3. 其他更新
        this.updateAgingWines();
        this.refreshCommissions();

        let event = null;
        if (seasonChanged) {
            const sName = (typeof SEASONS !== 'undefined') ? SEASONS[currentSeasonKey].name : currentSeasonKey;
            event = { text: `季节更替！现在是${sName}了。`, effect: 'season_change' };
        } 
        else if (Math.random() < 0.08) {
            event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
            this.handleEvent(event);
        }
        
        this.save();
        return event;
    },

    handleEvent(event) {
        // 驱虫塔拦截 (全局升级)
        if (this.unlockedUpgrades.includes('scarecrow')) {
            if (event.effect === 'money_loss' || event.effect === 'growth_stunt') return;
        }

        // 注意：这里需要遍历 plot.plant
        if (event.effect === 'rain') {
            this.plots.forEach(p => { if(p.plant && !p.plant.isDead) p.plant.water += 20; });
        } else if (event.effect === 'drought') { 
            this.plots.forEach(p => { if(p.plant && !p.plant.isDead) p.plant.water -= 20; });
        } else if (event.effect === 'growth_boost') { 
            this.plots.forEach(p => { if(p.plant && !p.plant.isDead) p.plant.maturity += 15; });
        } else if (event.effect === 'growth_stunt') { 
            this.plots.forEach(p => { if(p.plant && !p.plant.isDead) p.plant.maturity = Math.max(0, p.plant.maturity - 10); });
        } else if (event.effect === 'money_gain') { 
            this.recordIncome(event.value, 'misc'); 
        } else if (event.effect === 'money_loss') { 
            this.money -= event.value;
            this.recordExpense(event.value, 'misc'); 
        }
    },

    killNonHardyPlants() {
        this.plots.forEach(plot => {
            // 检查单块地的大棚升级 (greenhouse)
            if (plot.upgrades.includes('greenhouse')) return;

            if (plot.plant && !plot.plant.isDead) {
                const grape = GRAPES[plot.plant.grapeKey];
                if (!grape.isHardy) {
                    plot.plant.isDead = true;
                    plot.plant.deathReason = "冻死";
                }
            }
        });
    },

    updateAllPlots() {
        this.plots.forEach((plot, index) => {
            if (index < this.unlockedPlots) {
                const plant = plot.plant;
                // 如果没有植物或已死，跳过
                if (!plant || plant.isDead) return;

                plant.daysPlanted++;

                let evaporation = 0;
                if (this.weather === 'sunny') evaporation = 15; 
                else if (this.weather === 'cloudy') evaporation = 5;
                else if (this.weather === 'rainy') evaporation = -20; 

                if (this.season === 'summer' && evaporation > 0) {
                    evaporation *= 2;
                }

                plant.water -= evaporation;
                
                // 喷淋系统 (全局升级)
                if (this.unlockedUpgrades.includes('sprinkler') && plant.water < 10) {
                    plant.water = 10;
                }

                plant.water = Math.max(0, Math.min(100, plant.water));

                if (plant.water <= 0) {
                    plant.isDead = true;
                    plant.deathReason = "干枯";
                    return;
                }
                if (plant.water >= 100) {
                    plant.isDead = true;
                    plant.deathReason = "烂根";
                    return;
                }

                let growth = 10;
                if (plant.water < 20 || plant.water > 80) growth = 5;
                
                if (this.season === 'summer') growth = Math.floor(growth * 1.2);

                plant.maturity += growth;

                if (plant.maturity >= 120) {
                    plant.isDead = true;
                    plant.deathReason = "腐烂";
                }
            }
        });
    },

    updateAgingWines() {
        this.inventory.forEach(item => {
            if (item.type === 'wine' && item.isAging) {
                if (!item.bottleAge) item.bottleAge = 0;
                item.bottleAge++;
            }
        });
    },

    refreshCommissions() {
        this.activeCommissions = this.activeCommissions.filter(c => c.status === 'accepted');
        let availablePool = [];
        if (this.day > 20) availablePool = COMMISSIONS.filter(c => c.id.startsWith('c2'));
        else if (this.day > 8) availablePool = COMMISSIONS.filter(c => c.id.startsWith('c1'));
        else availablePool = COMMISSIONS.filter(c => c.id.startsWith('c0'));

        availablePool = availablePool.filter(c => 
            !this.completedCommissionIds.includes(c.id) && 
            !this.activeCommissions.some(ac => ac.id === c.id)
        );
        
        const numToRefresh = Math.min(availablePool.length, 2);
        for (let i = 0; i < numToRefresh; i++) {
            if (this.activeCommissions.length >= 3) break; 
            const randomIndex = Math.floor(Math.random() * availablePool.length);
            const newCommission = { ...availablePool[randomIndex], status: 'new' }; 
            this.activeCommissions.push(newCommission);
            availablePool.splice(randomIndex, 1); 
        }
        this.save();
    },

    // --- 财务记账 ---
    recordIncome(amount, source) { 
        this.money += amount;
        this.statistics.totalEarned += amount;
        if (this.statistics.weekly.earned[source] !== undefined) {
            this.statistics.weekly.earned[source] += amount;
        }
        this.save();
    },

    recordExpense(amount, category) { 
        this.statistics.totalSpent += amount;
        if (this.statistics.weekly.spent[category] !== undefined) {
            this.statistics.weekly.spent[category] += amount;
        }
        this.save();
    },

    resetWeeklyStats() {
        this.statistics.weekly = {
            earned: { sales: 0, commissions: 0, bailout: 0, misc: 0 },
            spent: { seeds: 0, upgrades: 0, maintenance: 0, misc: 0 }
        };
        this.save();
    },

    getCalendarDate() {
        const day = this.day;
        const daysPerSeason = 28;
        const seasons = ['春', '夏', '秋', '冬'];
        
        const year = Math.floor((day - 1) / (daysPerSeason * 4)) + 1;
        const seasonIndex = Math.floor((day - 1) / daysPerSeason) % 4;
        const seasonName = seasons[seasonIndex];
        const dayInSeason = ((day - 1) % daysPerSeason) + 1;
        
        const weekDayNum = ((day - 1) % 7) + 1;
        const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
        const weekDayName = weekDays[weekDayNum - 1];
        
        return {
            year,
            season: seasonName,
            dayInSeason,
            weekDay: weekDayName,
            fullStr: `第${year}年 ${seasonName} ${dayInSeason}日 (周${weekDayName})`
        };
    },
};
