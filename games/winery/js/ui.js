// === 界面渲染逻辑 (UI.js V11.0 完整功能版) ===

const UI = {
    currentTab: 'farm',
    shopTab: 'seeds',
    cellarTab: 'seeds',
    handbookTab: 'grapes',
    currentShopTopic: 'welcome', 

    init() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // --- 给金币栏添加点击事件 (显示财报) ---
        const moneyEl = document.querySelector('.status-left .status-item:first-child');
        if (moneyEl) {
            moneyEl.style.cursor = 'pointer'; 
            moneyEl.onclick = () => this.showFinanceModal(); 
        }
        
        this.updateStatusBar();
    },
        // ui.js -> UI 对象内

    // 辅助：渲染帮助按钮
    renderHelpBtn(tabName) {
        return `<div class="help-btn" onclick="UI.showHelpModal('${tabName}')">?</div>`;
    },

    // 显示帮助弹窗
    showHelpModal(tabName) {
        // 确保 Guide.HELP_TEXTS 存在，防止报错
        const content = (Guide.HELP_TEXTS && Guide.HELP_TEXTS[tabName]) ? Guide.HELP_TEXTS[tabName] : "暂无说明";
        
        const html = `
            <div class="modal-overlay fade-in">
                <div class="modal-box scale-up" style="text-align:left;">
                    <h3 style="text-align:center; color:#e6a23c; margin-top:0;">功能说明</h3>
                    <div class="help-content">${content}</div>
                    <button class="action-btn" style="margin-top:20px; width:100%;" onclick="this.closest('.modal-overlay').remove()">明白了</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },


    // --- 显示财务报表 ---
    showFinanceModal() {
        const s = State.statistics.weekly;
        const totalEarned = s.earned.sales + s.earned.commissions + s.earned.bailout + s.earned.misc;
        const totalSpent = s.spent.seeds + s.spent.upgrades + s.spent.maintenance + s.spent.misc;
        const profit = totalEarned - totalSpent;
        const profitColor = profit >= 0 ? '#2ecc71' : '#e74c3c';

        const html = `
            <div class="modal-overlay fade-in">
                <div class="modal-box scale-up" style="text-align:left;">
                    <h3 style="text-align:center; color:#e6a23c; margin-bottom:20px;">本周财务报表</h3>
                    
                    <div style="margin-bottom:15px;">
                        <div style="color:#2ecc71; font-weight:bold; border-bottom:1px solid #555; margin-bottom:5px;">收入 (+${totalEarned})</div>
                        <div style="display:flex; justify-content:space-between; font-size:13px;"><span>销售收入:</span> <span>${s.earned.sales}</span></div>
                        <div style="display:flex; justify-content:space-between; font-size:13px;"><span>委托奖励:</span> <span>${s.earned.commissions}</span></div>
                        ${s.earned.bailout > 0 ? `<div style="display:flex; justify-content:space-between; font-size:13px;"><span>特别资助:</span> <span>${s.earned.bailout}</span></div>` : ''}
                        ${s.earned.misc > 0 ? `<div style="display:flex; justify-content:space-between; font-size:13px;"><span>杂项收入:</span> <span>${s.earned.misc}</span></div>` : ''}
                    </div>

                    <div style="margin-bottom:15px;">
                        <div style="color:#e74c3c; font-weight:bold; border-bottom:1px solid #555; margin-bottom:5px;">支出 (-${totalSpent})</div>
                        <div style="display:flex; justify-content:space-between; font-size:13px;"><span>购买种子:</span> <span>${s.spent.seeds}</span></div>
                        <div style="display:flex; justify-content:space-between; font-size:13px;"><span>设施升级:</span> <span>${s.spent.upgrades}</span></div>
                        <div style="display:flex; justify-content:space-between; font-size:13px;"><span>生产维护:</span> <span>${s.spent.maintenance}</span></div>
                        ${s.spent.misc > 0 ? `<div style="display:flex; justify-content:space-between; font-size:13px;"><span>杂项支出:</span> <span>${s.spent.misc}</span></div>` : ''}
                    </div>

                    <div style="text-align:right; font-size:16px; font-weight:bold; margin-top:20px; border-top:2px solid #8a7a68; padding-top:10px;">
                        本周净利: <span style="color:${profitColor}">${profit > 0 ? '+' : ''}${profit}</span>
                    </div>

                    <button class="action-btn" style="margin-top:20px; width:100%;" onclick="this.closest('.modal-overlay').remove()">关闭</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
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

        setTimeout(() => {
            if (tab === 'shop' && !State.storyFlags.firstShopSeen) { Guide.start('firstShop'); State.storyFlags.firstShopSeen = true; State.save(); }
            else if (tab === 'cellar' && !State.storyFlags.firstCellarSeen) { Guide.start('firstCellar'); State.storyFlags.firstCellarSeen = true; State.save(); }
            else if (tab === 'winery' && !State.storyFlags.firstWinerySeen) { Guide.start('firstWinery'); State.storyFlags.firstWinerySeen = true; State.save(); }
            else if (tab === 'handbook' && !State.storyFlags.firstHandbookSeen) { Guide.start('firstHandbook'); State.storyFlags.firstHandbookSeen = true; State.save(); }
        }, 300);
    },

    updateStatusBar() {
        const moneyEl = document.getElementById('money-display');
        if (moneyEl && moneyEl.innerText != State.money) {
            moneyEl.style.color = '#fff';
            setTimeout(() => moneyEl.style.color = '', 200);
        }
        if (moneyEl) moneyEl.innerText = State.money;
        
        const dayEl = document.getElementById('day-display');
        if(dayEl) {
            const date = State.getCalendarDate();
            dayEl.innerHTML = `<span style="font-size:12px;">${date.season}</span> ${date.dayInSeason}日 <span style="font-size:10px; color:#95a5a6;">(周${date.weekDay})</span>`;
        }
        
        const weatherIcons = { 'sunny': 'fa-sun', 'cloudy': 'fa-cloud', 'rainy': 'fa-cloud-rain' };
        const wIcon = document.getElementById('weather-icon');
        if(wIcon) wIcon.className = `fas ${weatherIcons[State.weather]}`;
        
        const fDisp = document.getElementById('forecast-display');
        if(fDisp) fDisp.innerHTML = `明日: <i class="fas ${weatherIcons[State.nextWeather]}"></i>`;
    },

    // --- 1. 农场界面 (支持单块地升级显示) ---
    renderFarm() {
        const container = document.getElementById('scene-content');
        let html = `<div class="farm-grid" onclick="game.deselectPlot(event)">`;
        html += this.renderHelpBtn('farm');

        for (let i = 0; i < 9; i++) {
            const isLocked = i >= State.unlockedPlots;
            const isSelected = i === State.selectedPlotIndex;
            const plot = State.plots[i]; // 对象 {plant, upgrades}
            const plant = plot.plant;
            
            let classes = 'plot-cell';
            if (isLocked) classes += ' locked';
            if (isSelected) classes += ' selected';
            
            // 视觉效果：肥料 (深色土)
            let style = '';
            if (plot.upgrades.includes('fertilizer')) {
                style += 'background-color: #3e2723; border-color: #5d4037;';
            }

            html += `<div class="${classes}" style="${style}" onclick="event.stopPropagation(); game.selectPlot(${i})">`;
            
            // 视觉效果：大棚 (玻璃罩)
            if (plot.upgrades.includes('greenhouse')) {
                html += `<div style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.3); pointer-events:none; z-index:2;"></div>`;
                html += `<i class="fas fa-warehouse" style="position:absolute; top:2px; right:2px; font-size:10px; color:rgba(255,255,255,0.5); z-index:3;"></i>`;
            }

            if (isLocked) {
                html += `<i class="fas fa-lock" style="color:#5d4037; font-size:20px;"></i>`;
            } else if (plant) {
                let stage = 1;
                let imgSrc = '';

                if (plant.isDead) {
                    stage = 5;
                    imgSrc = `images/${plant.grapeKey}_5.png`;
                } else {
                    if (plant.maturity >= 80) stage = 4;      
                    else if (plant.maturity >= 50) stage = 3; 
                    else if (plant.maturity >= 20) stage = 2; 
                    imgSrc = `images/${plant.grapeKey}_${stage}.png`;
                }
                
                let waterColor = '#3498db';
                if (plant.water < 30) waterColor = '#e74c3c'; 
                else if (plant.water > 80) waterColor = '#2980b9'; 
                if (plant.isDead) waterColor = '#7f8c8d';

                html += `
                    <div class="water-indicator"><div class="water-bar" style="height:${plant.water}%; background-color:${waterColor}"></div></div>
                    <img src="${imgSrc}" class="crop-image" alt="${GRAPES[plant.grapeKey].name}" style="${plant.isDead ? 'filter:grayscale(0.8);' : ''}">
                `;
            } else {
                html += `<span style="font-size:10px; color:#6d4c41;">空地</span>`;
            }
            html += `</div>`;
        }
        html += `</div>`;

        // --- 浮动菜单 ---
        if (State.selectedPlotIndex !== -1 && State.selectedPlotIndex < State.unlockedPlots) {
            const currentPlot = State.plots[State.selectedPlotIndex];
            if (!currentPlot) return; 
            const currentPlant = currentPlot.plant;
            
            html += `<div class="floating-controls slide-up" onclick="event.stopPropagation()">`;
            
            // 1. 如果有植物
            if (currentPlant) {
                const g = GRAPES[currentPlant.grapeKey];
                
                if (currentPlant.isDead) {
                    html += `
                        <div class="plot-info-card" style="border:1px solid #c0392b;">
                            <div class="info-title" style="color:#c0392b;">${g.name} (已死亡)</div>
                            <div class="info-row"><span style="color:#e74c3c;">死因: ${currentPlant.deathReason}</span></div>
                            <div class="info-row"><span>只能铲除清理</span></div>
                        </div>
                        <div class="control-buttons-row">
                            <button class="control-btn" onclick="game.actionShovel()" style="color:#e74c3c; width:100%; border-radius:8px;">
                                <i class="fas fa-trash"></i> 清理枯枝
                            </button>
                        </div>
                    `;
                } else {
                    const canHarvest = currentPlant.maturity >= 50;
                    let statusText = "发芽期";
                    if (currentPlant.maturity >= 80) statusText = "完全成熟";
                    else if (currentPlant.maturity >= 50) statusText = "转色期";
                    else if (currentPlant.maturity >= 20) statusText = "生长期";

                    const hbData = State.handbook[currentPlant.grapeKey];
                    const isWaterKnown = hbData && hbData.silver; 
                    const idealWaterText = isWaterKnown 
                        ? `<span style="color:#2ecc71; font-weight:bold;">${g.idealWater}左右</span>` 
                        : `<span style="color:#95a5a6; font-style:italic;">??? (需银星解锁)</span>`;

                    html += `
                        <div class="plot-info-card">
                            <div class="info-title" style="color:${g.color}">${g.name}</div>
                            <div class="info-row"><span>生长:</span> <span>${statusText} (${Math.floor(currentPlant.maturity)}%)</span></div>
                            <div class="info-row"><span>水分:</span> <span>${Math.floor(currentPlant.water)} / 100</span></div>
                            <div class="info-row"><span>适宜水分:</span> <span>${idealWaterText}</span></div>
                        </div>
                        <div class="control-buttons-row">
                            <button class="control-btn" onclick="game.actionWater()"><i class="fas fa-tint"></i></button>
                            <button class="control-btn" onclick="game.actionPrune()"><i class="fas fa-cut"></i></button>
                            ${canHarvest 
                                ? `<button class="control-btn" onclick="game.actionHarvest()" style="color:#e74c3c"><i class="fas fa-hand-holding"></i></button>`
                                : `<button class="control-btn" onclick="game.actionShovel()" style="color:#95a5a6"><i class="fas fa-trash"></i></button>`
                            }
                        </div>
                    `;
                }
            } 
            // 2. 如果是空地
            else {
                html += `
                    <div class="plot-info-card">
                        <div class="info-title">空闲地块</div>
                        <div class="info-row"><span>状态:</span> <span>待种植</span></div>
                    </div>
                    <div class="control-buttons-row">
                        <button class="control-btn" onclick="game.goToCellarToPlant()" style="width:100%; border-radius:8px;">
                            <i class="fas fa-seedling"></i> 去仓库选种
                        </button>
                    </div>
                `;
            }

            // --- 3. 土地升级区域 (无论有无植物都显示) ---
            const availableUpgrades = [];
            if (!currentPlot.upgrades.includes('fertilizer')) availableUpgrades.push('fertilizer');
            if (!currentPlot.upgrades.includes('greenhouse')) availableUpgrades.push('greenhouse');

            if (availableUpgrades.length > 0) {
                html += `<div style="margin-top:10px; border-top:1px solid rgba(255,255,255,0.1); padding-top:5px;">`;
                html += `<div style="font-size:10px; color:#95a5a6; margin-bottom:5px;">地块升级:</div>`;
                
                availableUpgrades.forEach(id => {
                    const item = FARM_UPGRADES[id];
                    html += `
                        <button class="action-btn secondary" style="width:100%; margin-bottom:5px; font-size:11px; display:flex; justify-content:space-between;" onclick="game.buyPlotUpgrade('${id}')">
                            <span><i class="fas ${item.icon}"></i> ${item.name}</span>
                            <span>$${item.cost}</span>
                        </button>
                    `;
                });
                html += `</div>`;
            }
            // ---------------------------------------

            html += `</div>`;
        }
        container.innerHTML = html;
        
        const hasDead = State.plots.some(p => p.plant && p.plant.isDead);
        if (hasDead && !State.storyFlags.firstDeathSeen) {
            Guide.start('plantDead');
            State.storyFlags.firstDeathSeen = true;
            State.save();
        }
    },

    // --- 2. 商店界面 ---
    renderShop() {
        const container = document.getElementById('scene-content');
        
        if (container.querySelector('.shop-container')) {
            this.renderShopList();
            return;
        }

        const dialogue = { face: 'normal', text: "欢迎光临！" };
        const config = Guide.SHOP_CONFIG['normal']; 
        const imgStyle = `transform: scale(${config.scale}) translate(${config.x}px, ${config.y}px);`;

        let topHtml = `
            <div class="shop-top-section">
            ${this.renderHelpBtn('shop')}
                <img id="shop-img" class="shop-portrait-img" src="images/gong_normal.png" style="${imgStyle}" onclick="UI.clickShopKeeper()">
                <div id="shop-bubble" class="shop-bubble">
                    ${dialogue.text}
                </div>
            </div>
        `;
        
        let bottomHtml = `
            <div class="shop-bottom-section">
                <div class="tab-header">
                    <button class="${this.shopTab === 'seeds' ? 'active' : ''}" onclick="UI.setShopTab('seeds')">种子</button>
                    <button class="${this.shopTab === 'upgrades' ? 'active' : ''}" onclick="UI.setShopTab('upgrades')">升级</button>
                    <button class="${this.shopTab === 'commissions' ? 'active' : ''}" onclick="UI.setShopTab('commissions')">委托</button>
                </div>
                <div id="shop-list" class="list-container"></div>
            </div>
        `;

        container.innerHTML = `<div class="shop-container">${topHtml}${bottomHtml}</div>`;
        this.renderShopList();
    },

    clickShopKeeper() {
        const imgEl = document.getElementById('shop-img');
        const bubbleEl = document.getElementById('shop-bubble');
        
        if (imgEl) {
            imgEl.classList.add('bump');
            setTimeout(() => imgEl.classList.remove('bump'), 150); 
        }

        const dialogue = Guide.getRandomShopQuote();
        const faceKey = dialogue.face;
        const imgSrc = faceKey === 'diff' ? 'images/gong_diff.png' : 'images/gong_normal.png';
        const config = Guide.SHOP_CONFIG[faceKey] || { scale: 1, x: 0, y: 0 };

        if (imgEl) {
            if (!imgEl.src.includes(imgSrc)) imgEl.src = imgSrc;
            imgEl.style.transform = `scale(${config.scale}) translate(${config.x}px, ${config.y}px)`;
        }
        
        if (bubbleEl) {
            bubbleEl.innerHTML = dialogue.text;
            bubbleEl.style.animation = 'none';
            bubbleEl.offsetHeight; 
            bubbleEl.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
    },

    updateShopContent() {
        const dialogue = Guide.getShopResponse(this.currentShopTopic);
        const faceKey = dialogue.face;
        const imgSrc = faceKey === 'diff' ? 'images/gong_diff.png' : 'images/gong_normal.png';
        const config = Guide.SHOP_CONFIG[faceKey] || { scale: 1, x: 0, y: 0 };

        const imgEl = document.getElementById('shop-img');
        const bubbleEl = document.getElementById('shop-bubble');

        if (imgEl) {
            if (!imgEl.src.includes(imgSrc)) imgEl.src = imgSrc;
            imgEl.style.transform = `scale(${config.scale}) translate(${config.x}px, ${config.y}px)`;
        }
        if (bubbleEl) {
            bubbleEl.innerHTML = dialogue.text;
            bubbleEl.style.animation = 'none';
            bubbleEl.offsetHeight; 
            bubbleEl.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
    },

    renderShopList() {
        const listContainer = document.getElementById('shop-list');
        if (!listContainer) return;

        let html = '';
        if (this.shopTab === 'seeds') {
            listContainer.style.gridTemplateColumns = ''; 
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
        } else if (this.shopTab === 'upgrades') {
            listContainer.style.gridTemplateColumns = ''; 
            
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

            // --- 农场全局升级 (只显示全局的) ---
            ['sprinkler', 'scarecrow'].forEach(key => {
                const item = FARM_UPGRADES[key];
                if (!State.unlockedUpgrades.includes(key)) {
                    html += `
                        <div class="card-item upgrade-card">
                            <div class="card-title"><i class="fas ${item.icon}"></i> ${item.name}</div>
                            <div class="card-desc">${item.desc}</div>
                            <div class="card-price">💰${item.cost}</div>
                            <button class="action-btn" onclick="game.buyFarmUpgrade('${key}')">购买</button>
                        </div>`;
                }
            });
            // -------------------------------

            
            
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
            
            for (let key in VESSELS) {
                const item = VESSELS[key];
                if (item.unlockCost > 0 && !State.unlockedCrafts.vessels.includes(key)) {
                    html += `
                        <div class="card-item upgrade-card">
                            <div class="card-title"><i class="fas fa-wine-bottle"></i> 容器: ${item.name}</div>
                            <div class="card-desc">${item.desc}</div>
                            <div class="card-price">💰${item.unlockCost}</div>
                            <button class="action-btn" onclick="game.buyCraft('vessels', '${key}')">购买</button>
                        </div>`;
                }
            }

            for (let key in CRUSH_METHODS) {
                const item = CRUSH_METHODS[key];
                if (item.unlockCost > 0 && !State.unlockedCrafts.crush.includes(key)) {
                    html += `
                        <div class="card-item upgrade-card">
                            <div class="card-title"><i class="fas fa-mortar-pestle"></i> 工艺: ${item.name}</div>
                            <div class="card-desc">${item.desc}</div>
                            <div class="card-price">💰${item.unlockCost}</div>
                            <button class="action-btn" onclick="game.buyCraft('crush', '${key}')">学习</button>
                        </div>`;
                }
            }

            for (let key in YEAST_TYPES) {
                const item = YEAST_TYPES[key];
                if (item.unlockCost > 0 && !State.unlockedCrafts.yeast.includes(key)) {
                    html += `
                        <div class="card-item upgrade-card">
                            <div class="card-title"><i class="fas fa-vial"></i> 酵母: ${item.name}</div>
                            <div class="card-desc">${item.desc}</div>
                            <div class="card-price">💰${item.unlockCost}</div>
                            <button class="action-btn" onclick="game.buyCraft('yeast', '${key}')">研发</button>
                        </div>`;
                }
            }

        }
        else if (this.shopTab === 'commissions') {
            listContainer.style.gridTemplateColumns = '1fr'; 
            
            const accepted = State.activeCommissions.filter(c => c.status === 'accepted');
            const news = State.activeCommissions.filter(c => c.status === 'new');

            if (accepted.length > 0) {
                html += `<h4 style="color:#e6a23c; margin-bottom:10px;">进行中的委托</h4>`;
                accepted.forEach(c => {
                    html += this.renderCommissionCard(c);
                });
            }

            html += `<h4 style="color:#e6a23c; margin: 20px 0 10px 0;">今日新委托</h4>`;
            if (news.length > 0) {
                news.forEach(c => {
                    html += this.renderCommissionCard(c);
                });
            } else {
                html += `<p style="font-size:12px; color:#95a5a6;">今天没有新的委托了。</p>`;
            }
        }
        listContainer.innerHTML = html;
    },

    setShopTab(tab) {
        this.shopTab = tab;
        const header = document.querySelector('.shop-bottom-section .tab-header');
        if (header) {
            header.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        }
        const activeBtn = header ? header.querySelector(`button[onclick="UI.setShopTab('${tab}')"]`) : null;
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        this.renderShopList();
    },

    askShop(topic) {
        this.currentShopTopic = topic;
        this.updateShopContent(); 
    },

    // --- 3. 工坊界面 ---
    renderWinery() {
        const container = document.getElementById('scene-content');
        let html = `<div style="padding:20px; display:flex; flex-direction:column; gap:15px;">`;
        html += this.renderHelpBtn('winery');
        html += `<h3 style="color:#e6a23c; margin:0 0 10px 0; text-align:center;">酿造工坊 </h3>`;
        
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
        
        html += `</div>`;
        container.innerHTML = html;
    },

    // --- 4. 仓库界面 ---
    renderCellar() {
        const container = document.getElementById('scene-content');
        let html = `
            <div class="tab-header">
                <button class="${this.cellarTab === 'wines' ? 'active' : ''}" onclick="UI.setCellarTab('wines')">美酒</button>
                <button class="${this.cellarTab === 'fruits' ? 'active' : ''}" onclick="UI.setCellarTab('fruits')">果实</button>
                <button class="${this.cellarTab === 'seeds' ? 'active' : ''}" onclick="UI.setCellarTab('seeds')">种子</button>
            </div>
        `;

        if (this.cellarTab === 'wines') {
            const agingWines = State.inventory.filter(i => i.type === 'wine' && i.isAging);
            const newWines = State.inventory.filter(i => i.type === 'wine' && !i.isAging);

            html += `<div style="padding: 15px; overflow-y: auto; height: calc(100% - 50px);">`; 
            
            html += `<h3 style="color:#e6a23c; margin:0 0 10px 0; border-bottom:1px solid #8a7a68; padding-bottom:5px;"><i class="fas fa-hourglass-half"></i> 陈年酒架</h3>`;
            if (agingWines.length > 0) {
                html += `<div class="list-container" style="padding:0; grid-template-columns: 1fr; gap: 10px;">`; 
                agingWines.forEach(item => {
                    const index = State.inventory.indexOf(item);
                    const qualityColor = QUALITY_LEVELS[item.quality].color;
                    const age = item.bottleAge || 0;
                    html += `
                        <div class="card-item" style="text-align:left; display:flex; flex-direction:column; gap:8px;">
                            <div class="card-title" style="color:${qualityColor};">[${QUALITY_LEVELS[item.quality].name}] ${item.name}</div>
                            <div class="card-desc" style="height:auto;">
                                <div>已陈年: <span style="font-weight:bold; color:#fff;">${age}</span> 天</div>
                                <div>陈年潜力: ${Math.round(GRAPES[item.id].agingPotential * 100)}%</div>
                            </div>
                            <div style="display:flex; gap:10px; margin-top:auto;">
                                <button class="action-btn" onclick="UI.showSellQuantityModal(${index})">出售</button>
                                <button class="action-btn secondary" onclick="game.toggleWineAging(${index})">取出</button>
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
            } else {
                html += `<p style="font-size:12px; color:#95a5a6; text-align:center; margin: 15px 0;">暂无陈年中的酒。</p>`;
            }

            html += `<h3 style="color:#e6a23c; margin:20px 0 10px 0; border-bottom:1px solid #8a7a68; padding-bottom:5px;"><i class="fas fa-box-open"></i> 新酒仓库</h3>`;
            if (newWines.length > 0) {
                html += `<div class="list-container" style="padding:0;">`;
                newWines.forEach(item => {
                    const index = State.inventory.indexOf(item);
                    const qualityColor = QUALITY_LEVELS[item.quality].color;
                    html += `
                        <div class="card-item">
                            <div class="card-title" style="color:${qualityColor};">[${QUALITY_LEVELS[item.quality].name}] ${item.name}</div>
                            <div class="card-desc">数量: ${item.count || 1}</div>
                            <div style="display:flex; gap:5px; margin-top: 8px;">
                                <button class="action-btn" style="flex:1;" onclick="UI.showSellQuantityModal(${index})">售卖</button>
                                <button class="action-btn" style="flex:1;" onclick="game.toggleWineAging(${index})">陈年</button>
                            </div>
                            <button class="action-btn secondary" style="margin-top:5px;" onclick="UI.showWineDetail(${index})">品鉴</button>
                        </div>
                    `;
                });
                html += `</div>`;
            } else {
                html += `<p style="font-size:12px; color:#95a5a6; text-align:center; margin: 15px 0;">暂无新酿的酒。</p>`;
            }
            html += `</div>`;

        } 
        else { 
            html += `<div class="list-container">`;
            const items = State.inventory.filter(item => {
                if (this.cellarTab === 'fruits') return item.type === 'fruit';
                if (this.cellarTab === 'seeds') return item.type === 'seed';
            });

            if (items.length === 0) {
                html += `<div style="grid-column:1/-1; text-align:center; margin-top:20px; color:#95a5a6;">暂无物品</div>`;
            } else {
                items.forEach(item => {
                    const realIndex = State.inventory.indexOf(item);
                    const isSeed = item.type === 'seed';
                    
                    const qualityName = QUALITY_LEVELS[item.quality].name;
                    const qualityInfo = isSeed ? '' : `<span style="color:${QUALITY_LEVELS[item.quality].color}">[${qualityName}]</span>`;
                    
                    let actionBtns = '';
                    if (isSeed) {
                        actionBtns = `<button class="action-btn" onclick="game.plantFromInventory('${item.id}')">种植</button>`;
                    } else { 
                        actionBtns = `<button class="action-btn" onclick="UI.showSellQuantityModal(${realIndex})">售卖</button>`;
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
        }
        html += this.renderHelpBtn('cellar');
        container.innerHTML = html;
    },

    showSellQuantityModal(inventoryIndex) {
        const item = State.inventory[inventoryIndex];
        if (!item) return;

        const maxQuantity = item.count;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay fade-in';
        overlay.innerHTML = `
            <div class="modal-box scale-up">
                <h3 style="margin-top:0;">出售 ${item.name}</h3>
                <p>请选择要出售的数量 (最多 ${maxQuantity})</p>
                <input type="number" id="sell-quantity-input" value="1" min="1" max="${maxQuantity}" 
                    style="width:100%; padding:10px; background:#3c322a; border:1px solid #8a7a68; color:white; text-align:center; font-size:16px;"
                    oninput="if(this.value > ${maxQuantity}) this.value = ${maxQuantity}; if(this.value < 1 && this.value !== '') this.value = 1;"
                >
                <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
                    <button class="action-btn" id="confirm-sell-btn">确认出售</button>
                    <button class="action-btn secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                </div>
            </div>`;
        
        document.body.appendChild(overlay);

        document.getElementById('confirm-sell-btn').onclick = () => {
            const quantity = parseInt(document.getElementById('sell-quantity-input').value);
            if (quantity > 0 && quantity <= maxQuantity) {
                game.sellItem(inventoryIndex, quantity); 
                overlay.remove();
            } else {
                alert("请输入有效的数量！");
            }
        };
    },

    // --- 5. 图鉴界面 ---
        // --- 5. 百科全书 (V12.0 书本样式) ---
        // ui.js -> renderHandbook (修复版：显示详细攻略)

    renderHandbook() {
        const container = document.getElementById('scene-content');
        if (!this.handbookTab) this.handbookTab = 'grapes';

        let html = `
            <div class="handbook-layout">
                <div class="hb-sidebar">
                    <button class="hb-tab-btn ${this.handbookTab === 'grapes' ? 'active' : ''}" onclick="UI.setHandbookTab('grapes')"><i class="fas fa-wine-glass-alt"></i> 葡萄图鉴</button>
                    <button class="hb-tab-btn ${this.handbookTab === 'crafts' ? 'active' : ''}" onclick="UI.setHandbookTab('crafts')"><i class="fas fa-flask"></i> 酿造工艺</button>
                    <button class="hb-tab-btn ${this.handbookTab === 'terms' ? 'active' : ''}" onclick="UI.setHandbookTab('terms')"><i class="fas fa-book"></i> 酿酒词典</button>
                </div>
                <div class="hb-content-area">
        `;

        if (this.handbookTab === 'grapes') {
            html += `<div class="hb-page-title">葡萄品种名录</div>`;
            
            for (let key in GRAPES) {
                const g = GRAPES[key];
                const isKnown = State.unlockedGrapes.includes(key);
                
                if (!isKnown) {
                    html += `<div class="hb-card locked"><div class="hb-card-header"><span>???</span> <i class="fas fa-lock"></i></div><div class="hb-desc">该品种尚未解锁。</div></div>`;
                    continue;
                }

                const progress = State.handbook[key];
                
                // --- 修复：构建详细攻略 HTML ---
                let loreHtml = '';
                ['normal', 'bronze', 'silver', 'gold'].forEach(q => {
                    if (progress[q]) { // 只有解锁了才显示
                        const qName = QUALITY_LEVELS[q].name;
                        const qColor = QUALITY_LEVELS[q].color;
                        // 从 LORE 对象中获取文本
                        const text = LORE[key] ? LORE[key][q] : "暂无记录";
                        
                        loreHtml += `
                            <div style="margin-top:8px; padding:8px; background:rgba(255,255,255,0.4); border-radius:4px; border-left:3px solid ${qColor};">
                                <div style="font-weight:bold; font-size:11px; color:${qColor}; margin-bottom:3px;">${qName}记录</div>
                                <div style="font-size:12px; color:#5d4037; white-space: pre-wrap;">${text}</div>
                            </div>`;
                    }
                });
                // ---------------------------

                html += `
                    <div class="hb-card">
                        <div class="hb-card-header" style="color:${g.color}">
                            <span>${g.name}</span>
                            <span class="hb-tag">${g.type === 'red' ? '红葡萄' : '白葡萄'}</span>
                        </div>
                        <div class="hb-desc">
                            <p><strong>风味:</strong> ${g.flavorProfile.fruit.join('、')}</p>
                            <p><strong>特性:</strong> ${g.desc}</p>
                            <p style="font-size:11px; color:#8d6e63; margin-top:5px;">
                                喜好水分: ${progress.silver ? g.idealWater : '???'} | 
                                成熟期: ${progress.silver ? g.idealHarvestDay + '天' : '???'}
                            </p>
                        </div>
                        
                        <!-- 显示详细攻略 -->
                        <div style="margin-top:10px; border-top:1px dashed #c0b088; padding-top:5px;">
                            ${loreHtml || '<div style="font-size:11px; color:#95a5a6; font-style:italic;">暂无详细记录，请尝试种植并收获不同品质的果实。</div>'}
                        </div>
                    </div>`;
            }
        } 
        // ... (crafts 和 terms 部分保持不变) ...
        else if (this.handbookTab === 'crafts') {
             html += `<div class="hb-page-title">酿造工艺指南</div>`;
            html += `<h4 style="color:#5d4037; border-bottom:1px dashed #c0b088; margin-top:20px;">发酵容器</h4>`;
            for (let key in VESSELS) {
                const item = VESSELS[key];
                const isUnlocked = State.unlockedCrafts.vessels.includes(key);
                html += UI.renderHandbookCard(item.name, item.desc, isUnlocked);
            }
            html += `<h4 style="color:#5d4037; border-bottom:1px dashed #c0b088; margin-top:20px;">破碎工艺</h4>`;
            for (let key in CRUSH_METHODS) {
                const item = CRUSH_METHODS[key];
                const isUnlocked = State.unlockedCrafts.crush.includes(key);
                html += UI.renderHandbookCard(item.name, item.desc, isUnlocked);
            }
            html += `<h4 style="color:#5d4037; border-bottom:1px dashed #c0b088; margin-top:20px;">酵母类型</h4>`;
            for (let key in YEAST_TYPES) {
                const item = YEAST_TYPES[key];
                const isUnlocked = State.unlockedCrafts.yeast.includes(key);
                html += UI.renderHandbookCard(item.name, item.desc, isUnlocked);
            }
        }
        else if (this.handbookTab === 'terms') {
            html += `<div class="hb-page-title">酿酒师词典</div>`;
            for (let key in DICTIONARY) {
                const term = DICTIONARY[key];
                const isUnlocked = State.unlockedTerms.includes(key);
                html += UI.renderHandbookCard(term.title, term.desc, isUnlocked);
            }
        }

        html += `</div></div>`;
        html += this.renderHelpBtn('handbook');
        container.innerHTML = html;
    },

        // ui.js -> UI 对象内

    // 辅助：渲染帮助按钮
    renderHelpBtn(tabName) {
        return `<div class="help-btn" onclick="UI.showHelpModal('${tabName}')">?</div>`;
    },

    // 显示帮助弹窗
    showHelpModal(tabName) {
        const content = Guide.HELP_TEXTS[tabName] || "暂无说明";
        const html = `
            <div class="modal-overlay fade-in">
                <div class="modal-box scale-up" style="text-align:left;">
                    <h3 style="text-align:center; color:#e6a23c; margin-top:0;">功能说明</h3>
                    <div class="help-content">${content}</div>
                    <button class="action-btn" style="margin-top:20px; width:100%;" onclick="this.closest('.modal-overlay').remove()">明白了</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },




    // 辅助函数：渲染通用卡片
    renderHandbookCard(title, desc, isUnlocked) {
        if (!isUnlocked) {
            return `
                <div class="hb-card locked">
                    <div class="hb-card-header"><span>???</span> <i class="fas fa-lock"></i></div>
                    <div class="hb-desc">继续探索以解锁此知识。</div>
                </div>`;
        }
        return `
            <div class="hb-card">
                <div class="hb-card-header"><span>${title}</span> <i class="fas fa-check-circle" style="color:#8d6e63; font-size:12px;"></i></div>
                <div class="hb-desc">${desc}</div>
            </div>`;
    },

    // 切换标签页
    setHandbookTab(tab) {
        this.handbookTab = tab;
        this.renderHandbook();
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
             ${this.renderHelpBtn('settings')}
        `;
    },

    renderCommissionCard(commission) {
        const req = commission.requirements;
        let reqText = '要求: ';
        if (req.grape) reqText += `[${GRAPES[req.grape].name}] `;
        if (req.quality) reqText += `[${QUALITY_LEVELS[req.quality].name}品质] `;
        if (req.minAge) reqText += `[陈年≥${req.minAge}天] `;
        if (req.settings) {
            if(req.settings.vessel) reqText += `[${VESSELS[req.settings.vessel].name}] `;
            if(req.settings.crush) reqText += `[${CRUSH_METHODS[req.settings.crush].name}] `;
            if(req.settings.yeast) reqText += `[${YEAST_TYPES[req.settings.yeast].name}] `;
        }

        let buttonHtml = '';
        if (commission.status === 'new') {
            buttonHtml = `<button class="action-btn" onclick="game.acceptCommission('${commission.id}')">接受</button>`;
        } else {
            buttonHtml = `<button class="action-btn" onclick="UI.showDeliveryModal('${commission.id}')">交付</button>`;
        }

        return `
            <div class="card-item" style="text-align:left;">
                <p style="font-size:14px; color:#d7c8b8;">“${commission.text}”</p>
                <p style="font-size:12px; color:#e6a23c; margin-top:10px;">${reqText}</p>
                <div style="margin-top:15px;">${buttonHtml}</div>
            </div>
        `;
    },

    showDeliveryModal(commissionId) {
        const commission = State.activeCommissions.find(c => c.id === commissionId);
        const req = commission.requirements;
        
        const availableWines = State.inventory
            .map((item, index) => ({ item, index })) 
            .filter(obj => obj.item.type === 'wine');

        if (availableWines.length === 0) {
            UI.showModal("仓库里没有酒可以交付！");
            return;
        }

        let optionsHtml = '';
        availableWines.forEach(obj => {
            const { item, index } = obj;
            let wineDesc = `[${QUALITY_LEVELS[item.quality].name}] ${item.name}`;
            if (item.bottleAge > 0) wineDesc += ` (已陈年${item.bottleAge}天)`;
            optionsHtml += `<option value="${index}">${wineDesc}</option>`;
        });

        let html = `
            <div class="modal-overlay fade-in">
                <div class="brew-modal-content">
                    <h3>选择要交付的酒</h3>
                    <p style="font-size:12px; color:#95a5a6; margin-bottom:15px;">“${commission.text}”</p>
                    <select id="delivery-wine-select" style="width:100%; padding:10px;">
                        ${optionsHtml}
                    </select>
                    <div style="display:flex; gap:10px; margin-top:20px;">
                        <button class="action-btn" style="flex:1;" onclick="game.tryCompleteCommission('${commissionId}', document.getElementById('delivery-wine-select').value); this.closest('.modal-overlay').remove();">确认交付</button>
                        <button class="action-btn secondary" style="flex:1;" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },

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

        let grapeSelectHtml = `
            <div class="step-box"><label>1. 原料选择</label>
                <select id="brew-grape-select">
                    ${fruits.map((f, idx) => `<option value="${idx}">${f.name} (${QUALITY_LEVELS[f.quality].name})</option>`).join('')}
                </select>
            </div>`;

        let yeastHtml = `<div class="step-box"><label>2. 酵母选择</label><div class="radio-group">`;
        for (let key in YEAST_TYPES) {
            const y = YEAST_TYPES[key];
            const isUnlocked = State.unlockedCrafts.yeast.includes(key);
            const disabled = isUnlocked ? '' : 'disabled';
            const color = isUnlocked ? '#d7c8b8' : '#5d4037';
            const label = isUnlocked ? `${y.name} (成本$${y.cost})` : `${y.name} (未解锁)`;
            const checked = key === 'wild' ? 'checked' : ''; 
            
            yeastHtml += `<label style="color:${color}"><input type="radio" name="yeast" value="${key}" ${disabled} ${checked}> ${label}</label>`;
        }
        yeastHtml += `</div></div>`;

        let crushHtml = `<div class="step-box"><label>3. 破碎工艺</label><div class="radio-group">`;
        for (let key in CRUSH_METHODS) {
            const c = CRUSH_METHODS[key];
            const isUnlocked = State.unlockedCrafts.crush.includes(key);
            const disabled = isUnlocked ? '' : 'disabled';
            const color = isUnlocked ? '#d7c8b8' : '#5d4037';
            const label = isUnlocked ? c.name : `${c.name} (未解锁)`;
            const checked = key === 'light' ? 'checked' : '';
            
            crushHtml += `<label style="color:${color}"><input type="radio" name="crush" value="${key}" ${disabled} ${checked}> ${label}</label>`;
        }
        crushHtml += `</div></div>`;

        let vesselHtml = `<div class="step-box"><label>4. 酿造容器</label><div class="radio-group">`;
        for (let key in VESSELS) {
            const v = VESSELS[key];
            const isUnlocked = State.unlockedCrafts.vessels.includes(key);
            const disabled = isUnlocked ? '' : 'disabled';
            const color = isUnlocked ? '#d7c8b8' : '#5d4037';
            let label = v.name;
            if (key === 'new_oak' && isUnlocked) label += ` (维护费$50)`;
            if (!isUnlocked) label += ` (未解锁)`;
            const checked = key === 'stainless' ? 'checked' : '';

            vesselHtml += `<label style="color:${color}"><input type="radio" name="vessel" value="${key}" ${disabled} ${checked}> ${label}</label>`;
        }
        vesselHtml += `</div></div>`;

        let finalHtml = `
            <div class="modal-overlay fade-in">
                <div class="brew-modal-content">
                    <h3>工序选择</h3>
                    ${grapeSelectHtml}
                    ${yeastHtml}
                    ${crushHtml}
                    ${vesselHtml}
                    <div class="step-footer" style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
                        <button class="action-btn" onclick="game.confirmBrew(${slotIndex})">开始酿造</button>
                        <button class="action-btn secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    </div>
                </div>
            </div>`;
        
        document.body.insertAdjacentHTML('beforeend', finalHtml);
    },

    showToast(msg) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast-msg slide-in-right';
        toast.innerHTML = `
            <div class="toast-content">${msg}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('fade-out');
                setTimeout(() => toast.remove(), 500);
            }
        }, 5000);
    },

    showWineDetail(index) {
        const item = State.inventory[index];
        if (!item) return;

        const id = item.id;
        const quality = item.quality;
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
                    <button class="action-btn" onclick="game.sellItem(${index}, 1); document.querySelector('.modal-overlay').remove();">售卖</button>
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
