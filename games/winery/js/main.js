// === 游戏主控制器 (Main.js - V12.0 最终整合版) ===

const game = {
    init() {
        console.log("Game Initializing...");
        
        const hasSave = localStorage.getItem('winery_save_v1');
        const startScreen = document.getElementById('start-screen');
        
        let menuBox = startScreen.querySelector('.menu-box');
        if (!menuBox) {
            const oldBtnContainer = startScreen.querySelector('.start-buttons');
            if(oldBtnContainer) oldBtnContainer.remove();
            
            menuBox = document.createElement('div');
            menuBox.className = 'menu-box';
            const titleArea = startScreen.querySelector('.title-area');
            if(titleArea) titleArea.after(menuBox);
            else startScreen.appendChild(menuBox);
        }

        let html = '';
        if (hasSave) {
            html += `<button class="start-btn" onclick="game.loadAndStart()">继续游戏</button>`;
            html += `<button class="start-btn secondary" onclick="game.confirmNewGame()">开始新游戏</button>`;
        } else {
            html += `<button class="start-btn" onclick="game.startNewGame()">开始游戏</button>`;
        }
        menuBox.innerHTML = html;

        UI.init();
    },

    // === 流程控制 ===
    loadAndStart() {
        if (State.load()) {
            this.enterGame();
        } else {
            UI.showModal("存档读取失败，将开始新游戏");
            this.startNewGame();
        }
    },

    confirmNewGame() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay fade-in';
        overlay.innerHTML = `
            <div class="modal-box scale-up" style="border-color:#c0392b;">
                <h3 style="color:#c0392b;">⚠️ 警告</h3>
                <p>开始新游戏将覆盖当前的存档。</p>
                <p>确定要重新开始吗？</p>
                <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
                    <button class="action-btn danger" onclick="game.startNewGame(); this.closest('.modal-overlay').remove()">确定覆盖</button>
                    <button class="action-btn secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
    },

    startNewGame() {
        State.resetData();
        State.refreshCommissions(); 
        State.save();
        this.enterGame();
    },

    enterGame() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-interface').classList.remove('hidden');
        UI.updateStatusBar();
        UI.renderFarm();

        if (!State.storyFlags.introSeen) {
            setTimeout(() => {
                Guide.start('intro');
                State.storyFlags.introSeen = true;
                State.save();
            }, 500);
        }
    },

    // === 游戏操作 ===
    selectPlot(index) {
        if (index >= State.unlockedPlots) return;
        State.selectedPlotIndex === index ? this.deselectPlot() : (State.selectedPlotIndex = index, UI.renderFarm());
    },
    deselectPlot() { State.selectedPlotIndex = -1; UI.renderFarm(); },

    actionNextDay() {
        const event = State.nextDay();
        
        if (State.day % 7 === 1) {
            State.resetWeeklyStats();
            UI.showToast("新的一周开始了，财务报表已重置。");
        }

        State.updateAllPlots();
        State.updateBrewing();
        
        State.refreshCommissions(); 
        UI.updateStatusBar();
        
        if(UI.currentTab === 'farm') UI.renderFarm();
        else if(UI.currentTab === 'winery') UI.renderWinery();
        else if(UI.currentTab === 'shop') UI.renderShopList(); // 注意是 renderShopList
        else if(UI.currentTab === 'cellar') UI.renderCellar();
        
        if (event) {
            let icon = '📰';
            if(event.effect === 'rain') icon = '🌧️';
            if(event.effect === 'growth') icon = '✨';
            if(event.effect === 'season_change') icon = '📅';
            UI.showToast(`<strong>${icon} 消息</strong><br>${event.text}`);
        }
    },

    // --- 农场基础操作 (已修复：访问 plot.plant) ---
    actionWater() {
        if(State.selectedPlotIndex !== -1) {
            const plot = State.plots[State.selectedPlotIndex];
            if(plot && plot.plant && !plot.plant.isDead) { 
                plot.plant.water = Math.min(100, plot.plant.water + 30); 
                UI.renderFarm(); 
            }
        }
    },
    actionPrune() {
        if(State.selectedPlotIndex !== -1) {
            const plot = State.plots[State.selectedPlotIndex];
            if(plot && plot.plant && !plot.plant.isDead) { 
                plot.plant.maturity = Math.max(0, plot.plant.maturity - 5); 
                UI.showToast("修剪完成，葡萄更健康了。");
                UI.renderFarm(); 
            }
        }
    },
    
    actionShovel() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay fade-in';
        overlay.innerHTML = `
            <div class="modal-box scale-up">
                <h3 style="margin-top:0;">确认操作</h3>
                <p>确定要铲除这株植物吗？此操作无法撤销。</p>
                <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
                    <button class="action-btn danger" id="confirm-shovel-btn">确定铲除</button>
                    <button class="action-btn secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                </div>
            </div>`;
        
        document.body.appendChild(overlay);

        document.getElementById('confirm-shovel-btn').onclick = () => {
            if (State.plots[State.selectedPlotIndex]) {
                State.plots[State.selectedPlotIndex].plant = null; // 只清空植物
            }
            overlay.remove(); 
            this.deselectPlot(); 
            UI.showToast("植物已清理。"); 
        };
    },

    // --- 收获操作 (已修复：访问 plot.plant) ---
    actionHarvest() {
        const plot = State.plots[State.selectedPlotIndex];
        if(!plot || !plot.plant) return;
        
        const plant = plot.plant;

        if(plant.maturity < 50) { 
            UI.showModal("没熟不能摘！"); 
            return; 
        }

        const g = GRAPES[plant.grapeKey];
        let score = 100 - Math.abs(plant.water - g.idealWater) - Math.abs(plant.daysPlanted - g.idealHarvestDay) * 5;
        if(plant.maturity < 80) score -= 30;
        
        // 土壤改良加分
        if (plot.upgrades.includes('fertilizer')) {
            score += 10;
        }

        let quality = 'normal';
        if (score > 90) quality = 'gold'; else if (score > 75) quality = 'silver'; else if (score > 60) quality = 'bronze';

        State.addItem('fruit', plant.grapeKey, quality, 1);
        
        const isNewLore = State.unlockLore(plant.grapeKey, quality);
        let newTerms = [];
        if (g.type === 'white') {
            if (State.unlockTerm('white_grape')) newTerms.push("白葡萄");
        } else {
            if (State.unlockTerm('red_grape')) newTerms.push("红葡萄");
        }

        plot.plant = null; // 清空植物
        State.save();

        this.deselectPlot();
        
        let msg = `采摘成功！<br>获得: ${QUALITY_LEVELS[quality].name} ${g.name}`;
        if(isNewLore) msg += `<br><span style="font-size:12px; color:#e6a23c;">✨ 品种图鉴已更新 ✨</span>`;
        if(newTerms.length > 0) msg += `<br><span style="font-size:12px; color:#e6a23c;">📚 解锁百科：${newTerms.join(', ')}</span>`;

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
        const yeast = document.querySelector('input[name="yeast"]:checked').value;

        let totalCost = 0;
        if (vessel === 'new_oak') totalCost += 50;
        totalCost += YEAST_TYPES[yeast].cost;

        if (!this.spendMoney(totalCost, 'maintenance')) {
            return; 
        }

        if (State.startBrewing(slotIndex, fruitItem.id, fruitItem.quality, { vessel, crush, yeast })) {
            document.querySelector('.modal-overlay').remove();
            
            let unlocks = [];
            if (crush === 'light' && State.unlockTerm('crush_light')) unlocks.push("轻度破碎");
            if (crush === 'deep' && State.unlockTerm('crush_deep')) unlocks.push("深度浸渍");
            if ((vessel === 'new_oak' || vessel === 'used_oak') && State.unlockTerm('vessel_oak')) unlocks.push("橡木桶");
            if (vessel === 'stainless' && State.unlockTerm('vessel_stainless')) unlocks.push("惰性容器");
            if (yeast === 'wild' && State.unlockTerm('yeast_wild')) unlocks.push("野生酵母");
            if (yeast === 'cultured' && State.unlockTerm('yeast_cultured')) unlocks.push("商业酵母");

            UI.updateStatusBar();
            UI.renderWinery();
            
            let msg = "开始酿造！";
            if (totalCost > 0) msg += `<br><span style="font-size:12px; color:#e74c3c;">- $${totalCost}</span>`;
            if (unlocks.length > 0) msg += `<br><span style="font-size:12px; color:#e6a23c;">📚 解锁百科：${unlocks.join(', ')}</span>`;
            
            UI.showToast(msg);
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
        if (score >= 140) finalQuality = 'iridium'; 
        else if (score >= 110) finalQuality = 'gold';
        else if (score >= 80) finalQuality = 'silver';
        else if (score < 30) finalQuality = 'normal';

        State.addItem('wine', slot.grapeKey, finalQuality, 1, slot.settings);
        State.brewingSlots[slotIndex] = null;
        State.save();

        let itemName = `${QUALITY_LEVELS[finalQuality].name} ${GRAPES[slot.grapeKey].name}葡萄酒`;
        let msg = `装瓶成功！<br>获得: ${itemName}<br>评分: ${Math.floor(score)}`;
        
        UI.showModal(msg);
        UI.renderWinery();
    },

    // --- 核心花钱函数 ---
    spendMoney(amount, category = 'misc') { 
        if (State.money < amount) {
            UI.showModal("金币不足！");
            return false; 
        }
        
        State.money -= amount;
        State.recordExpense(amount, category); 
        UI.updateStatusBar();

        // 破产检查 (剧情版)
        if (State.money < 100 && !State.storyFlags.bailoutGiven) {
            State.recordIncome(1000, 'bailout'); 
            State.storyFlags.bailoutGiven = true;
            State.save();
            
            Guide.start('bailout'); // 触发剧情
            UI.updateStatusBar();
            UI.showToast("获得了宫的资助：$1000");
        }
        
        return true; 
    },

    // --- 商店与交易 ---
    buySeed(id) {
        const cost = GRAPES[id].cost;
        if (this.spendMoney(cost, 'seeds')) { 
            State.addItem('seed', id);
            UI.showToast("购买成功");
        }
    },

    buyLand() {
        const cost = State.getNextLandCost();
        if (this.spendMoney(cost, 'upgrades')) {
            State.unlockedPlots++;
            State.save();
            UI.renderShop();
            UI.showModal("扩建成功");
        }
    },

    buyCraft(category, id) {
        let item;
        if (category === 'vessels') item = VESSELS[id];
        else if (category === 'crush') item = CRUSH_METHODS[id];
        else if (category === 'yeast') item = YEAST_TYPES[id];

        if (this.spendMoney(item.unlockCost, 'upgrades')) {
            State.unlockCraft(category, id);
            UI.renderShop();
            UI.showModal(`成功解锁：${item.name}`);
        }
    },

    buyWineryUpgrade() {
        const cost = State.getNextBarrelCost();
        if (this.spendMoney(cost, 'upgrades')) {
            State.maxBarrels++;
            State.save();
            UI.renderShop();
            UI.showModal(`工坊已扩建至 ${State.maxBarrels} 槽位`);
        }
    },

    unlockGrape(id) {
        if (this.spendMoney(GRAPES[id].unlockCost, 'upgrades')) {
            State.unlockGrape(id);
            UI.renderShop();
            UI.showModal("配方解锁成功");
        }
    },

    unlockDevice(id) {
        const cost = VESSELS[id].unlockCost;
        if (this.spendMoney(cost, 'upgrades')) {
            State.unlockDevice(id);
            UI.renderShop();
            UI.showModal("设备解锁成功！");
        }
    },

    // --- 新增：购买单块地升级 (解决报错) ---
    buyPlotUpgrade(upgradeId) {
        const plotIndex = State.selectedPlotIndex;
        if (plotIndex === -1) return;
        
        const plot = State.plots[plotIndex];
        if (plot.upgrades.includes(upgradeId)) {
            UI.showModal("这块地已经安装了该设施！");
            return;
        }

        const item = FARM_UPGRADES[upgradeId];
        if (this.spendMoney(item.cost, 'upgrades')) {
            plot.upgrades.push(upgradeId);
            State.save();
            UI.renderFarm(); 
            UI.showToast(`成功安装：${item.name}`);
        }
    },
    
    // --- 新增：购买全局农场升级 ---
    buyFarmUpgrade(id) {
        const item = FARM_UPGRADES[id];
        if (this.spendMoney(item.cost, 'upgrades')) {
            State.unlockedUpgrades.push(id);
            State.save();
            UI.renderShop();
            UI.showModal(`升级成功：${item.name}`);
        }
    },

    sellItem(inventoryIndex, quantity) { 
        const item = State.inventory[inventoryIndex];
        if (!item) return;

        let basePrice = GRAPES[item.id].sellPrice;
        if(item.type === 'wine') basePrice *= 3;
        else if(item.type === 'fruit') basePrice *= 1; 
        else basePrice = 0; 
        
        let singlePrice = Math.floor(basePrice * QUALITY_LEVELS[item.quality].multiplier);

                if (item.type === 'wine' && item.isAging && item.bottleAge > 0) {
            const grape = GRAPES[item.id];
            
            // 新公式
            let multiplier = 1 + (grape.agingPotential * (item.bottleAge / 60));
        
            // 限制最高倍率 (比如最高 3.0 倍)
            if (multiplier > 2.5) multiplier = 2.5;
        
            // 应用新价格
            singlePrice = Math.floor(singlePrice * multiplier);

            // --- 旧代码已删除 ---

            if (State.unlockTerm('bottle_aging')) UI.showToast("解锁百科：瓶中陈年");
            if (State.unlockTerm('aging_curve')) UI.showToast("解锁百科：陈年曲线");
        }

        
        const totalPrice = singlePrice * quantity;

        State.removeItemByIndex(inventoryIndex, quantity);
        
        State.recordIncome(totalPrice, 'sales');
        State.money += totalPrice;
        State.save();

        UI.updateStatusBar();
        UI.renderCellar();
        UI.showToast(`售出 ${quantity}份 ${item.name} 获利 <span style="color:#ffd700;">$${totalPrice}</span>`);
    },

    goToCellarToPlant() {
        State.plantingTargetIndex = State.selectedPlotIndex;
        UI.setCellarTab('seeds');
        UI.switchTab('cellar');
    },
    plantFromInventory(id) {
        let idx = State.plantingTargetIndex;
        if(idx === -1 || idx >= State.unlockedPlots) { UI.showModal("请选择有效空地"); return; }
        
        // 修复：检查 plot.plant
        if(State.plots[idx].plant) { UI.showModal("已有植物"); return; }
        
        if(State.plantSeed(idx, id)) {
            UI.showToast("种植成功");
            State.plantingTargetIndex = -1;
            State.selectedPlotIndex = -1;
            UI.switchTab('farm');
        }
    },
    toggleWineAging(inventoryIndex) {
        const item = State.inventory[inventoryIndex];
        if (item && item.type === 'wine') {
            item.isAging = !item.isAging;
            if (item.isAging && !item.bottleAge) {
                item.bottleAge = 0;
            }
            State.save();
            UI.renderCellar();
        }
    },

    acceptCommission(commissionId) {
        const commission = State.activeCommissions.find(c => c.id === commissionId);
        if (commission && commission.status === 'new') {
            commission.status = 'accepted';
            State.save();
            UI.renderShopList();
            UI.showToast("已接受委托！");
        }
    },

    tryCompleteCommission(commissionId, inventoryIndex) {
        const commission = State.activeCommissions.find(c => c.id === commissionId);
        const item = State.inventory[inventoryIndex];
        if (!commission || !item) return;
        
        const req = commission.requirements;

        let satisfied = true;
        if (req.grape && item.id !== req.grape) satisfied = false;
        if (req.quality) {
            const qualityLevels = ['normal', 'bronze', 'silver', 'gold', 'iridium'];
            if (qualityLevels.indexOf(item.quality) < qualityLevels.indexOf(req.quality)) {
                satisfied = false;
            }
        }
        if (req.minAge && (!item.bottleAge || item.bottleAge < req.minAge)) satisfied = false;
        if (req.settings) {
            for (const key in req.settings) {
                if (!item.data || item.data[key] !== req.settings[key]) {
                    satisfied = false;
                    break;
                }
            }
        }
        
        if (!satisfied) {
            UI.showModal("这瓶酒不符合委托要求！");
            return;
        }

        let basePrice = GRAPES[item.id].sellPrice * 3;
        let finalPrice = Math.floor(basePrice * QUALITY_LEVELS[item.quality].multiplier);
        const reward = Math.floor(finalPrice * commission.rewardMultiplier);

        State.inventory.splice(inventoryIndex, 1);
        State.recordIncome(reward, 'commissions');
        State.money += reward;

        State.completedCommissionIds.push(commission.id);
        State.activeCommissions = State.activeCommissions.filter(c => c.id !== commissionId);
        
        State.save();

        UI.updateStatusBar();
        UI.renderShopList();
        UI.showModal(`<h3>委托完成！</h3><p>${commission.text}</p><p style="margin-top:15px;">获得报酬: <span style="color:#ffd700; font-weight:bold;">$${reward}</span></p>`);
    },

    manualSave() { State.save(); UI.showToast("已存档"); },
    manualLoad() { State.load() ? (UI.updateStatusBar(), UI.showModal("读取成功"), UI.switchTab(UI.currentTab)) : UI.showModal("无存档"); },
    resetGame() { if(confirm("确定重置？")) { State.clearSave(); location.reload(); } }
};

window.onload = () => game.init();
