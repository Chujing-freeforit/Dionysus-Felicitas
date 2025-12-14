// === 界面渲染逻辑 (UI.js V8.2 Fixed) ===

const UI = {
    currentTab: 'farm',
    shopTab: 'seeds',
    cellarTab: 'seeds',
    handbookTab: 'grapes',

    init() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
        this.updateStatusBar();
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const btn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
        if (btn) btn.classList.add('active');

        if (tab !== 'farm') State.selectedPlotIndex = -1;

        if (tab === 'farm') this.renderFarm();
        else if (tab === 'winery') this.renderWinery();
        else if (tab === 'shop') this.renderShop();
        else if (tab === 'cellar') this.renderCellar();
        else if (tab === 'handbook') this.renderHandbook();
        else if (tab === 'settings') this.renderSettings();
    },

    updateStatusBar() {
        const moneyEl = document.getElementById('money-display');
        if (moneyEl && moneyEl.innerText != State.money) {
            moneyEl.style.color = '#fff';
            setTimeout(() => moneyEl.style.color = '', 200);
        }
        if (moneyEl) moneyEl.innerText = State.money;
        
        const dayEl = document.getElementById('day-display');
        if(dayEl) dayEl.innerText = `Day ${State.day}`;
        
        const weatherIcons = { 'sunny': 'fa-sun', 'cloudy': 'fa-cloud', 'rainy': 'fa-cloud-rain' };
        const wIcon = document.getElementById('weather-icon');
        if(wIcon) wIcon.className = `fas ${weatherIcons[State.weather]}`;
        
        const fDisp = document.getElementById('forecast-display');
        if(fDisp) fDisp.innerHTML = `明日: <i class="fas ${weatherIcons[State.nextWeather]}"></i>`;
    },

    // --- 1. 农场界面 ---
    renderFarm() {
        const container = document.getElementById('scene-content');
        let html = `<div class="farm-grid" onclick="game.deselectPlot(event)">`;
        
        for (let i = 0; i < 9; i++) {
            const isLocked = i >= State.unlockedPlots;
            const isSelected = i === State.selectedPlotIndex;
            const plot = State.plots[i];
            
            let classes = 'plot-cell';
            if (isLocked) classes += ' locked';
            if (isSelected) classes += ' selected';

            html += `<div class="${classes}" onclick="event.stopPropagation(); game.selectPlot(${i})">`;
            if (isLocked) {
                html += `<i class="fas fa-lock" style="color:#5d4037; font-size:20px;"></i>`;
            } else if (plot) {
                let height = 10 + (plot.maturity / 100) * 40;
                let color = GRAPES[plot.grapeKey].color;
                let waterColor = '#3498db';
                if (plot.water < 30) waterColor = '#e74c3c';
                else if (plot.water > 80) waterColor = '#2980b9';

                html += `
                    <div class="water-indicator"><div class="water-bar" style="height:${plot.water}%; background-color:${waterColor}"></div></div>
                    <div class="vine-stem" style="height:${height}%; background-color:${color}"></div>
                    ${plot.maturity > 80 ? `<div class="vine-grape" style="background-color:${color}"></div>` : ''}
                `;
            } else {
                html += `<span style="font-size:10px; color:#6d4c41;">空地</span>`;
            }
            html += `</div>`;
        }
        html += `</div>`;

        if (State.selectedPlotIndex !== -1 && State.selectedPlotIndex < State.unlockedPlots) {
            const currentPlot = State.plots[State.selectedPlotIndex];
            html += `<div class="floating-controls slide-up" onclick="event.stopPropagation()">`;
            if (currentPlot) {
                const canHarvest = currentPlot.maturity >= 50;
                html += `
                    <button class="control-btn" onclick="game.actionWater()"><i class="fas fa-tint"></i></button>
                    <button class="control-btn" onclick="game.actionPrune()"><i class="fas fa-cut"></i></button>
                    ${canHarvest 
                        ? `<button class="control-btn" onclick="game.actionHarvest()" style="color:#e74c3c"><i class="fas fa-hand-holding"></i></button>`
                        : `<button class="control-btn" onclick="game.actionShovel()" style="color:#95a5a6"><i class="fas fa-trash"></i></button>`
                    }
                `;
            } else {
                html += `
                    <button class="control-btn" onclick="game.goToCellarToPlant()"><i class="fas fa-seedling"></i></button>
                    <div style="color:#d7c8b8; font-size:12px; display:flex; align-items:center;">去仓库选种</div>
                `;
            }
            html += `</div>`;
        }
        container.innerHTML = html;
    },

    // --- 2. 商店界面 ---
    renderShop() {
        const container = document.getElementById('scene-content');
        let html = `
            <div class="tab-header">
                <button class="${this.shopTab === 'seeds' ? 'active' : ''}" onclick="UI.setShopTab('seeds')">种子</button>
                <button class="${this.shopTab === 'upgrades' ? 'active' : ''}" onclick="UI.setShopTab('upgrades')">升级</button>
            </div>
            <div class="list-container">
        `;

        if (this.shopTab === 'seeds') {
            for (let key in GRAPES) {
                const g = GRAPES[key];
                if (State.unlockedGrapes.includes(key)) {
                    html += `
                        <div class="card-item">
                            <div class="card-title" style="color:${g.color}">${g.name}</div>
                            <div class="card-desc">${g.desc}</div>
                            <div class="card-price">💰${g.cost}</div>
                            <button class="action-btn" onclick="game.buySeed('${key}')">购买</button>
                        </div>`;
                }
            }
        } else {
            // 土地升级
            if (State.unlockedPlots < 9) {
                const landCost = State.getNextLandCost();
                html += `
                    <div class="card-item upgrade-card">
                        <div class="card-title"><i class="fas fa-layer-group"></i> 扩建土地</div>
                        <div class="card-desc">解锁第 ${State.unlockedPlots + 1} 块用地</div>
                        <div class="card-price">💰${landCost}</div>
                        <button class="action-btn" onclick="game.buyLand()">扩建</button>
                    </div>`;
            } else {
                html += `<div class="card-item disabled"><div class="card-title">土地已满</div></div>`;
            }

            // 工坊升级
            if (State.maxBarrels < WINERY_UPGRADES.maxSlots) {
                const barrelCost = State.getNextBarrelCost();
                html += `
                    <div class="card-item upgrade-card">
                        <div class="card-title"><i class="fas fa-dungeon"></i> 扩建工坊</div>
                        <div class="card-desc">增加第 ${State.maxBarrels + 1} 个酿酒槽位</div>
                        <div class="card-price">💰${barrelCost}</div>
                        <button class="action-btn" onclick="game.buyWineryUpgrade()">扩建</button>
                    </div>`;
            }

            // 设备解锁 (新橡木桶)
            if (!State.unlockedDevices.includes('new_oak')) {
                html += `
                    <div class="card-item upgrade-card">
                        <div class="card-title"><i class="fas fa-box"></i> 设备: 新橡木桶</div>
                        <div class="card-desc">解锁顶级陈酿容器</div>
                        <div class="card-price">💰${VESSELS.new_oak.unlockCost}</div>
                        <button class="action-btn" onclick="game.unlockDevice('new_oak')">购买</button>
                    </div>`;
            }

            // 配方解锁
            for (let key in GRAPES) {
                const g = GRAPES[key];
                if (!State.unlockedGrapes.includes(key)) {
                    html += `
                        <div class="card-item upgrade-card">
                            <div class="card-title"><i class="fas fa-scroll"></i> 配方: ${g.name}</div>
                            <div class="card-desc">解锁 ${g.name} 权限</div>
                            <div class="card-price">💰${g.unlockCost}</div>
                            <button class="action-btn" onclick="game.unlockGrape('${key}')">学习</button>
                        </div>`;
                }
            }
        }
        html += `</div>`;
        container.innerHTML = html;
    },

    // --- 3. 工坊界面 ---
    renderWinery() {
        const container = document.getElementById('scene-content');
        let html = `<div style="padding:20px; display:flex; flex-direction:column; gap:15px;">`;
        html += `<h3 style="color:#e6a23c; margin:0 0 10px 0; text-align:center;">酿造工坊 (${State.maxBarrels}槽位)</h3>`;
        
        for (let i = 0; i < State.maxBarrels; i++) {
            const slot = State.brewingSlots[i];
            html += `<div class="barrel-slot" onclick="game.clickBarrel(${i})">`;
            
            if (slot) {
                const g = GRAPES[slot.grapeKey];
                const age = slot.daysAged;
                const guide = BREWING_GUIDE[slot.grapeKey];
                let statusText = "发酵中...";
                let barColor = "#3498db";
                
                if (age < guide.minAging) { statusText = `陈酿不足 (Day ${age})`; barColor = "#e67e22"; }
                else if (age > guide.maxAging) { statusText = `过度氧化! (Day ${age})`; barColor = "#c0392b"; }
                else { statusText = `最佳赏味期 (Day ${age})`; barColor = "#2ecc71"; }

                html += `
                    <div class="barrel-icon working"><i class="fas fa-wine-bottle"></i></div>
                    <div class="barrel-info">
                        <div style="font-weight:bold; color:${g.color}">${g.name}</div>
                        <div style="font-size:10px; color:#95a5a6;">${VESSELS[slot.settings.vessel].name}</div>
                        <div style="font-size:12px; margin-top:2px; font-weight:bold; color:${barColor}">${statusText}</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="barrel-icon empty"><i class="fas fa-plus"></i></div>
                    <div class="barrel-info" style="color:#5d4037">空酿酒桶<br><span style="font-size:10px;">点击酿造</span></div>
                `;
            }
            html += `</div>`;
        }
        
        if (State.maxBarrels < WINERY_UPGRADES.maxSlots) {
            html += `<button class="action-btn" onclick="UI.setShopTab('upgrades'); UI.switchTab('shop');">扩建工坊</button>`;
        }
        
        html += `<button onclick="game.actionNextDay()" class="next-day-btn">下一天 <i class="fas fa-forward"></i></button>`;
        html += `</div>`;
        container.innerHTML = html;
    },

    // --- 4. 仓库界面 (修复：使用索引传递) ---
    renderCellar() {
        const container = document.getElementById('scene-content');
        let html = `
            <div class="tab-header">
                <button class="${this.cellarTab === 'seeds' ? 'active' : ''}" onclick="UI.setCellarTab('seeds')">种子</button>
                <button class="${this.cellarTab === 'fruits' ? 'active' : ''}" onclick="UI.setCellarTab('fruits')">果实</button>
                <button class="${this.cellarTab === 'wines' ? 'active' : ''}" onclick="UI.setCellarTab('wines')">美酒</button>
            </div>
            <div class="list-container">
        `;

        // 过滤数据
        const items = State.inventory.filter(item => {
            if (this.cellarTab === 'seeds') return item.type === 'seed';
            if (this.cellarTab === 'fruits') return item.type === 'fruit';
            if (this.cellarTab === 'wines') return item.type === 'wine';
        });

        if (items.length === 0) {
            html += `<div style="grid-column:1/-1; text-align:center; margin-top:20px; color:#95a5a6;">暂无物品</div>`;
        } else {
            items.forEach(item => {
                // 获取该物品在 State.inventory 中的真实索引，用于传参
                const realIndex = State.inventory.indexOf(item);

                const isSeed = item.type === 'seed';
                const isWine = item.type === 'wine';
                
                let nameStyle = `color:${QUALITY_LEVELS[item.quality].color}`;
                if(isWine && item.quality === 'iridium') nameStyle = `color:#e1bee7; text-shadow:0 0 5px #9c27b0;`;

                const qualityName = QUALITY_LEVELS[item.quality].name;
                const qualityInfo = isSeed ? '' : `<span style="${nameStyle}">[${qualityName}]</span>`;
                
                let actionBtns = '';
                if (isSeed) {
                    actionBtns = `<button class="action-btn" onclick="game.plantFromInventory('${item.id}')">种植</button>`;
                } else if (isWine) {
                    // 葡萄酒：显示两个按钮，传递 realIndex 给 showWineDetail
                    actionBtns = `
                        <div style="display:flex; gap:5px;">
                            <button class="action-btn" style="flex:1;" onclick="UI.showWineDetail(${realIndex})">品鉴</button>
                            <button class="action-btn" style="flex:1;" onclick="game.sellItem('${item.id}', '${item.quality}', '${item.type}')">售卖</button>
                        </div>
                    `;
                } else {
                    // 果实
                    actionBtns = `<button class="action-btn" onclick="game.sellItem('${item.id}', '${item.quality}', '${item.type}')">售卖</button>`;
                }

                html += `
                    <div class="card-item">
                        <div class="card-title">${qualityInfo} ${item.name}</div>
                        <div class="card-desc">数量: ${item.count}</div>
                        ${actionBtns}
                    </div>`;
            });
        }
        html += `</div>`;
        container.innerHTML = html;
    },

    // --- 5. 图鉴界面 ---
    renderHandbook() {
        const container = document.getElementById('scene-content');
        let html = `
            <div class="tab-header">
                <button class="${this.handbookTab === 'grapes' ? 'active' : ''}" onclick="UI.setHandbookTab('grapes')">葡萄品种</button>
                <button class="${this.handbookTab === 'terms' ? 'active' : ''}" onclick="UI.setHandbookTab('terms')">酿酒百科</button>
            </div>
            <div class="handbook-container">
        `;

        if (this.handbookTab === 'grapes') {
            for (let key in GRAPES) {
                const g = GRAPES[key];
                const progress = State.handbook[key];
                const isKnown = State.unlockedGrapes.includes(key);
                if (!isKnown) {
                    html += `<div class="handbook-entry locked"><div class="hb-header">??? (未解锁)</div></div>`;
                    continue;
                }
                html += `<div class="handbook-entry"><div class="hb-header" style="color:${g.color}">${g.name}</div><div class="hb-content">`;
                ['normal', 'bronze', 'silver', 'gold'].forEach(q => {
                    const unlocked = progress[q];
                    const loreText = LORE[key][q];
                    const qName = QUALITY_LEVELS[q].name;
                    const qColor = QUALITY_LEVELS[q].color;
                    html += `<div class="lore-row ${unlocked ? '' : 'locked'}"><span class="lore-badge" style="color:${qColor}">${unlocked ? '<i class="fas fa-check"></i>' : '<i class="fas fa-lock"></i>'} ${qName}</span><div class="lore-text">${unlocked ? loreText : '???'}</div></div>`;
                });
                html += `</div></div>`;
            }
        } else {
            for (let key in DICTIONARY) {
                const term = DICTIONARY[key];
                const isUnlocked = State.unlockedTerms.includes(key);
                html += `
                    <div class="handbook-entry ${isUnlocked ? '' : 'locked'}">
                        <div class="hb-header" style="color:${isUnlocked ? '#e6a23c' : '#5d4037'}">
                            ${isUnlocked ? term.title : '??? (未解锁)'}
                        </div>
                        <div class="hb-content">
                            <div class="lore-text" style="font-style:${isUnlocked ? 'normal' : 'italic'}">
                                ${isUnlocked ? term.desc : '继续经营酒庄，触发特定事件解锁此知识。'}
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        html += `</div>`;
        container.innerHTML = html;
    },

    // --- 6. 设置界面 ---
    renderSettings() {
        const container = document.getElementById('scene-content');
        container.innerHTML = `
            <div class="settings-container">
                <div class="setting-row"><span class="setting-label">手动存档</span><button class="action-btn" style="width:auto;" onclick="game.manualSave()">保存</button></div>
                <div class="setting-row"><span class="setting-label">读取存档</span><button class="action-btn" style="width:auto;" onclick="game.manualLoad()">读取</button></div>
                <div class="setting-row"><span class="setting-label">重置进度</span><button class="action-btn danger" style="width:auto;" onclick="game.resetGame()">重置</button></div>
                <div class="setting-row"><span class="setting-label">退出游戏</span><a href="../../index.html" class="action-btn" style="width:auto; text-decoration:none; text-align:center;">退出</a></div>
            </div>
        `;
    },

    // --- 弹窗相关 ---
    setShopTab(tab) { this.shopTab = tab; this.renderShop(); },
    setCellarTab(tab) { this.cellarTab = tab; this.renderCellar(); },
    setHandbookTab(tab) { this.handbookTab = tab; this.renderHandbook(); },

    showModal(msg) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay fade-in';
        overlay.innerHTML = `<div class="modal-box scale-up"><p>${msg}</p><button class="action-btn" onclick="this.parentElement.parentElement.remove()">确定</button></div>`;
        document.body.appendChild(overlay);
    },

    showBrewModal(slotIndex) {
        const fruits = State.inventory.filter(i => i.type === 'fruit');
        if (fruits.length === 0) { this.showModal("仓库里没有果实！"); return; }

        // 检查新橡木桶是否解锁
        const oakLocked = !State.unlockedDevices.includes('new_oak');
        const oakLabel = oakLocked ? `新橡木桶 (未解锁)` : `新橡木桶 ($${VESSELS.new_oak.cost})`;
        const oakDisabled = oakLocked ? 'disabled' : '';

        let html = `
            <div class="brew-modal-content">
                <h3>工序选择</h3>
                <div class="step-box"><label>1. 原料</label>
                    <select id="brew-grape-select" style="width:100%; padding:8px; background:#2c241e; color:#d7c8b8; border:1px solid #8a7a68;">
                        ${fruits.map((f, idx) => `<option value="${idx}">${f.name} (${QUALITY_LEVELS[f.quality].name})</option>`).join('')}
                    </select>
                </div>
                <div class="step-box"><label>2. 破碎</label>
                    <div class="radio-group">
                        <label><input type="radio" name="crush" value="light" checked> 轻度破碎</label>
                        <label><input type="radio" name="crush" value="medium"> 标准压榨</label>
                        <label><input type="radio" name="crush" value="deep"> 深度浸渍</label>
                    </div>
                </div>
                <div class="step-box"><label>3. 容器</label>
                    <div class="radio-group">
                        <label><input type="radio" name="vessel" value="stainless" checked> 不锈钢</label>
                        <label><input type="radio" name="vessel" value="used_oak"> 旧橡木</label>
                        <label style="color:${oakLocked ? '#5d4037' : '#d7c8b8'}"><input type="radio" name="vessel" value="new_oak" ${oakDisabled}> ${oakLabel}</label>
                    </div>
                </div>
                <div class="step-footer">
                    <button class="action-btn" onclick="game.confirmBrew(${slotIndex})">开始</button>
                    <button class="action-btn danger" onclick="document.querySelector('.modal-overlay').remove()">取消</button>
                </div>
            </div>`;
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay fade-in';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
    },

    // 修复：接收 index，从 State 中读取数据
    showWineDetail(index) {
        const item = State.inventory[index];
        if (!item) return;

        const id = item.id;
        const quality = item.quality;
        // 兼容旧存档：如果没有 data，给一个默认值
        const data = item.data || { vessel: 'stainless', crush: 'medium' };

        const g = GRAPES[id];
        const q = QUALITY_LEVELS[quality];
        const vessel = VESSELS[data.vessel];
        const crush = CRUSH_METHODS[data.crush];

        let notes = `这款酒呈现出${g.colorName}的色泽。`;
        notes += `初闻有${g.flavorProfile.fruit.join('、')}的香气。`;
        notes += `<br><br>工艺影响：<br>- ${crush.flavorMod}<br>- ${vessel.flavorMod}`;
        
        if (quality === 'iridium') notes += `<br><br><strong>大师评价：</strong><br>完美的平衡！这是神之水滴，展现了${g.name}的极致风土。`;
        else if (quality === 'gold') notes += `<br><br><strong>大师评价：</strong><br>一款杰出的葡萄酒，典型性极强。`;

        let html = `
            <div class="wine-detail-card">
                <h2 style="color:${q.color}">${q.name} ${g.name}</h2>
                <div class="wine-tags">
                    <span>酒体: ${g.flavorProfile.body}</span>
                    <span>酸度: ${g.flavorProfile.acidity}</span>
                </div>
                <div class="tasting-notes">${notes}</div>
                <div class="wine-footer">
                    <button class="action-btn" onclick="game.sellItem('${id}', '${quality}', 'wine'); document.querySelector('.modal-overlay').remove();">售卖</button>
                    <button class="action-btn secondary" onclick="document.querySelector('.modal-overlay').remove()">关闭</button>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay fade-in';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
    },

    updateBrewCost() {}
};
