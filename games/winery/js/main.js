// === 游戏主控制器 (Main.js V8.0 Final) ===

const game = {
    init() {
        State.init();
        UI.init();
    },

    startGame() { State.resetData(); this.enterGame(); },
    loadAndStart() { State.load() ? this.enterGame() : alert("没有存档"); },
    enterGame() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-interface').classList.remove('hidden');
        UI.updateStatusBar();
        UI.renderFarm();
    },

    selectPlot(index) {
        if (index >= State.unlockedPlots) return;
        State.selectedPlotIndex === index ? this.deselectPlot() : (State.selectedPlotIndex = index, UI.renderFarm());
    },
    deselectPlot() { State.selectedPlotIndex = -1; UI.renderFarm(); },

    actionNextDay() {
        const event = State.nextDay();
        State.updateAllPlots();
        State.updateBrewing();
        UI.updateStatusBar();
        if(UI.currentTab === 'farm') UI.renderFarm();
        else if(UI.currentTab === 'winery') UI.renderWinery();
        
        if (event) UI.showModal(`【随机事件】<br>${event.text}`);
    },

    // 农场基础操作
    actionWater() {
        if(State.selectedPlotIndex !== -1) {
            const plot = State.plots[State.selectedPlotIndex];
            if(plot) { plot.water = Math.min(100, plot.water + 30); UI.renderFarm(); }
        }
    },
    actionPrune() {
        if(State.selectedPlotIndex !== -1) {
            const plot = State.plots[State.selectedPlotIndex];
            if(plot) { plot.maturity = Math.max(0, plot.maturity - 5); UI.showModal("修剪完成，葡萄更健康了。"); UI.renderFarm(); }
        }
    },
    actionShovel() {
        if(confirm("确定铲除？")) { State.plots[State.selectedPlotIndex] = null; this.deselectPlot(); }
    },

    actionHarvest() {
        const plot = State.plots[State.selectedPlotIndex];
        if(!plot) return;
        if(plot.maturity < 50) { UI.showModal("没熟不能摘！"); return; }

        const g = GRAPES[plot.grapeKey];
        let score = 100 - Math.abs(plot.water - g.idealWater) - Math.abs(plot.daysPlanted - g.idealHarvestDay) * 5;
        if(plot.maturity < 80) score -= 30;
        
        let quality = 'normal';
        if (score > 90) quality = 'gold'; else if (score > 75) quality = 'silver'; else if (score > 60) quality = 'bronze';

        State.addItem('fruit', plot.grapeKey, quality, 1);
        const isNewLore = State.unlockLore(plot.grapeKey, quality);
        State.plots[State.selectedPlotIndex] = null;
        this.deselectPlot();
        
        let msg = `采摘成功！<br>获得: ${QUALITY_LEVELS[quality].name} ${g.name}`;
        if(isNewLore) msg += `<br><span style="font-size:12px; color:#e6a23c;">✨ 图鉴已更新 ✨</span>`;
        UI.showModal(msg);
        UI.renderFarm();
    },

    // 酿造
    clickBarrel(index) {
        const slot = State.brewingSlots[index];
        slot ? this.tryBottleWine(index) : UI.showBrewModal(index);
    },

    confirmBrew(slotIndex) {
        const grapeIdx = document.getElementById('brew-grape-select').value;
        const fruits = State.inventory.filter(i => i.type === 'fruit');
        const fruitItem = fruits[grapeIdx];
        if(!fruitItem) return;

        const vessel = document.querySelector('input[name="vessel"]:checked').value;
        const crush = document.querySelector('input[name="crush"]:checked').value;

        if (vessel === 'new_oak' && State.money < 50) { alert("金币不足！"); return; }
        if (vessel === 'new_oak') State.money -= 50; // 维护费

        if (State.startBrewing(slotIndex, fruitItem.id, fruitItem.quality, { vessel, crush })) {
            document.querySelector('.modal-overlay').remove();
            
            let unlocks = [];
            if (crush === 'deep' && State.unlockTerm('maceration')) unlocks.push("浸渍");
            if (vessel === 'new_oak' && State.unlockTerm('oak')) unlocks.push("橡木桶");
            if (vessel === 'stainless' && State.unlockTerm('stainless')) unlocks.push("不锈钢");

            UI.updateStatusBar();
            UI.renderWinery();
            let msg = "开始酿造！";
            if (unlocks.length > 0) msg += `<br><span style="color:#e6a23c">解锁新知识：${unlocks.join(', ')}</span>`;
            UI.showModal(msg);
        }
    },

    tryBottleWine(slotIndex) {
        const slot = State.brewingSlots[slotIndex];
        const guide = BREWING_GUIDE[slot.grapeKey];
        const age = slot.daysAged;

        if (age < 1) { UI.showModal("时间太短，不能装瓶。"); return; }

        let score = 50 * QUALITY_LEVELS[slot.quality].multiplier;
        if (slot.settings.vessel === guide.idealVessel) score += 20;
        if (slot.settings.crush === guide.idealCrush) score += 20;
        if (age >= guide.minAging && age <= guide.maxAging) score += 30;
        else if (age < guide.minAging) score -= 20;
        else score -= 50;

        let finalQuality = 'normal';
        let isVinegar = false;
        if (score >= 140) finalQuality = 'iridium'; 
        else if (score >= 110) finalQuality = 'gold';
        else if (score >= 80) finalQuality = 'silver';
        else if (score < 30) { isVinegar = true; finalQuality = 'normal'; }

        // 解锁词条判定
        let unlocks = [];
        if (isVinegar && State.unlockTerm('oxidation')) unlocks.push("氧化");
        if (!isVinegar && slot.grapeKey === 'cabernet' && State.unlockTerm('tannin')) unlocks.push("单宁");
        if (score >= 110 && State.unlockTerm('terroir')) unlocks.push("风土");

        State.addItem('wine', slot.grapeKey, finalQuality, 1, slot.settings);
        State.brewingSlots[slotIndex] = null;
        State.save();

        let itemName = isVinegar ? "醋" : `${QUALITY_LEVELS[finalQuality].name} ${GRAPES[slot.grapeKey].name}葡萄酒`;
        let msg = isVinegar ? `时间太长氧化了！<br>获得: 醋` : `装瓶成功！<br>获得: ${itemName}<br>评分: ${Math.floor(score)}`;
        
        if (unlocks.length > 0) msg += `<br><span style="color:#e6a23c">解锁百科：${unlocks.join(', ')}</span>`;
        UI.showModal(msg);
        UI.renderWinery();
    },

    // 商店与交易
    buySeed(id) {
        if (State.money >= GRAPES[id].cost) {
            State.money -= GRAPES[id].cost;
            State.addItem('seed', id);
            UI.updateStatusBar();
            UI.showModal("购买成功");
        } else UI.showModal("金币不足");
    },
    buyLand() {
        const cost = State.getNextLandCost();
        if (State.money >= cost) {
            State.money -= cost;
            State.unlockedPlots++;
            State.save();
            UI.updateStatusBar();
            UI.renderShop();
            UI.showModal("扩建成功");
        } else UI.showModal("金币不足");
    },
    buyWineryUpgrade() {
        const cost = State.getNextBarrelCost();
        if (State.money >= cost) {
            State.money -= cost;
            State.maxBarrels++;
            State.save();
            UI.updateStatusBar();
            UI.renderShop();
            UI.showModal(`工坊已扩建至 ${State.maxBarrels} 槽位`);
        } else UI.showModal("金币不足");
    },
    unlockGrape(id) {
        if (State.money >= GRAPES[id].unlockCost) {
            State.money -= GRAPES[id].unlockCost;
            State.unlockGrape(id);
            UI.updateStatusBar();
            UI.renderShop();
            UI.showModal("配方解锁成功");
        } else UI.showModal("金币不足");
    },
    unlockDevice(id) {
        const cost = VESSELS[id].unlockCost;
        if (State.money >= cost) {
            State.money -= cost;
            State.unlockDevice(id);
            UI.updateStatusBar();
            UI.renderShop();
            UI.showModal("设备解锁成功！");
        } else UI.showModal("金币不足");
    },
    sellItem(id, quality, type) {
        let price = GRAPES[id].sellPrice;
        if(type === 'wine') price *= 3;
        price = Math.floor(price * QUALITY_LEVELS[quality].multiplier);
        
        if(State.removeItem(type, id, quality, 1)) {
            State.money += price;
            State.save();
            UI.updateStatusBar();
            UI.renderCellar();
            UI.showModal(`售出获利 ${price}`);
        }
    },

    // 导航跳转
    goToCellarToPlant() {
        State.plantingTargetIndex = State.selectedPlotIndex;
        UI.setCellarTab('seeds');
        UI.switchTab('cellar');
    },
    plantFromInventory(id) {
        let idx = State.plantingTargetIndex;
        if(idx === -1 || idx >= State.unlockedPlots) { UI.showModal("请选择有效空地"); return; }
        if(State.plots[idx]) { UI.showModal("已有植物"); return; }
        if(State.plantSeed(idx, id)) {
            UI.showModal("种植成功");
            State.plantingTargetIndex = -1;
            State.selectedPlotIndex = -1;
            UI.switchTab('farm');
        }
    },

    // 设置
    manualSave() { State.save(); UI.showModal("已存档"); },
    manualLoad() { State.load() ? (UI.updateStatusBar(), UI.showModal("读取成功"), UI.switchTab(UI.currentTab)) : UI.showModal("无存档"); },
    resetGame() { if(confirm("确定重置？")) { State.clearSave(); location.reload(); } }
};

window.onload = () => game.init();
