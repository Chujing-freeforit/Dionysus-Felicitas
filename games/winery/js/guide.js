// === 剧情与向导系统 (Guide.js V3.0 调试版) ===

const Guide = {
    // 【重要】调试开关：调好后记得改成 false 关闭面板
    //debugMode: true, 

    isTalking: false,
    currentScript: [],
    currentIndex: 0,

    // === 1. 立绘配置 (在这里填入你调试好的数值) ===
    CHAR_CONFIG: {
        normal: { scale: 1.7, x: 0, y: 0 }, 
        diff:   { scale: 1.7, x: 0, y: 29 } 
    },
     // === 新增：商店立绘配置 (在这里调整商店里的样子) ===
    SHOP_CONFIG: {
        normal: { scale: 1.2, x: -20, y: 10 }, // 举例：商店里可能需要小一点
        diff:   { scale: 1.2, x: -10, y: 11 }
    },

    // === 4. 功能说明文本 (新增) ===
    HELP_TEXTS: {
        farm: `
            <h4>农场经营指南</h4>
            <ul>
                <li><strong>种植</strong>：点击空地，从仓库选择种子种下。</li>
                <li><strong>浇水</strong>：保持水分在适宜范围。水分过低会干死，过高会烂根。</li>
                <li><strong>修剪</strong>：如果葡萄生长过快（成熟度过高），可以修剪以降低成熟度，防止腐烂。</li>
                <li><strong>收获</strong>：成熟度达到 100% 左右时收获品质最佳。</li>
                <li><strong>季节</strong>：注意季节变化！冬季大部分葡萄会冻死（大棚可免疫）。</li>
                <li><strong>财报</strong>：点击左上角的金钱栏可以查看当周财报。</li>
            </ul>
        `,
        shop: `
            <h4>杂货铺指南</h4>
            <ul>
                <li><strong>种子</strong>：购买各种葡萄种子。注意查看种子的耐寒性。</li>
                <li><strong>升级</strong>：购买土地扩建、工坊扩建、以及农场设施（如喷淋、大棚）。</li>
                <li><strong>委托</strong>：接受村民的订单，完成后可获得高额报酬。</li>
                <li><strong>提示</strong>：点击老板娘可以和她聊天哦！</li>
            </ul>
        `,
        winery: `
            <h4>酿造工坊指南</h4>
            <ul>
                <li><strong>酿造</strong>：点击空桶，选择果实、酵母、工艺和容器。</li>
                <li><strong>工艺</strong>：不同的组合会影响酒的风味和评分。参考图鉴来寻找最佳配方。</li>
                <li><strong>陈酿</strong>：酒在桶里时间越长，风味越复杂。但要注意不要过度氧化（变成醋）。</li>
                <li><strong>装瓶</strong>：在最佳赏味期点击酒桶进行装瓶。</li>
            </ul>
        `,
        cellar: `
            <h4>地下仓库指南</h4>
            <ul>
                <li><strong>美酒</strong>：存放酿好的酒。酒可以在这里继续“瓶中陈年”，提升价值。</li>
                <li><strong>果实</strong>：存放收获的葡萄。可以直接出售，或用于酿酒。</li>
                <li><strong>种子</strong>：存放购买的种子。</li>
                <li><strong>批量出售</strong>：点击“出售”按钮可以选择数量。</li>
            </ul>
        `,
        handbook: `
            <h4>百科全书指南</h4>
            <ul>
                <li><strong>葡萄图鉴</strong>：记录你种植过的葡萄品种和特性。</li>
                <li><strong>酿造工艺</strong>：介绍各种酿酒设备和技术。</li>
                <li><strong>酿酒词典</strong>：解释专业术语。</li>
                <li><strong>解锁</strong>：通过种植、酿造和购买来解锁更多条目。</li>
            </ul>
        `,
        settings: `
            <h4>系统设置</h4>
            <ul>
                <li><strong>存档</strong>：手动保存当前进度。每天的进度会自动保存，以便下次进入继续游玩。</li>
                <li><strong>重置</strong>：删除存档，重新开始游戏。</li>
            </ul>
        `
    },


    // === 2. 剧本配置区 ===
    SCRIPTS: {
        intro: [
            { face: 'normal', name: '宫', text: "你好呀！欢迎来到这座荒废已久的酒庄。" },
            { face: 'diff',   name: '宫', text: "我是这里的向导，你可以叫我“宫”。" },
            { face: 'normal', name: '宫', text: "希望你玩的开心！" },
        ],
        firstShop: [
            { face: 'normal', name: '宫', text: "这里是我的杂货铺。" },
            { face: 'diff',   name: '宫', text: "等你赚了钱，我会进货更多稀有品种的！" }
        ],
        plantDead: [
            { face: 'normal',   name: '宫', text: "哎呀！这株葡萄枯萎了..." },
            { face: 'normal',   name: '宫', text: "没关系，总会有失败的。多注意成熟度和水分！" }
        ],
        firstCellar: [
            { face: 'normal', name: '宫', text: "这是你的地下仓库。这里很凉快，适合存放种子和酿好的酒。" },
            { face: 'normal', name: '宫', text: "记得经常来看看，别让好酒放过期了哦。" }
        ],
        firstWinery: [
            { face: 'diff',   name: '宫', text: "这里就是酿造工坊！空气中弥漫着发酵的香气。" },
            { face: 'normal', name: '宫', text: "点击空桶就可以开始酿造。记得根据葡萄的特性选择工艺，这可是门大学问。" }
        ],
        firstHandbook: [
            { face: 'normal', name: '宫', text: "这本笔记记录了所有的葡萄知识。" },
            { face: 'diff',   name: '宫', text: "当你种出高品质的葡萄，或者酿出好酒时，这里的内容会自动解锁。嗯嗯..说不定你会是成就党。" }
        ],
        bailout: [
            { face: 'diff',   name: '宫', text: "哎呀...我看你的账本，情况好像不太妙呢。" },
            { face: 'normal', name: '宫', text: "别灰心，经营酒庄起步总是最难的。" },
            { face: 'normal', name: '宫', text: "这点钱你先拿去周转，就当是我对未来大酒庄主的投资啦！" },
            { face: 'diff',   name: '宫', text: "加油哦，我看好你！" }
        ],

    },
        // ... (SCRIPTS 部分结束)

    // === 3. 商店随机对话池 (V4.0) ===
    // 格式：{ face: 'normal/diff', text: '...' }
    SHOP_QUOTES: [
        { face: 'normal', text: "欢迎光临！今天想买点什么？" },
        { face: 'normal', text: "赤霞珠虽然便宜，但只要用心也能酿出好酒。" },
        { face: 'diff',   text: "最近天气真不错，适合葡萄生长呢。" },
        { face: 'diff',   text: "听说城里的贵族很喜欢陈酿的黑皮诺，价格炒得很高。" },
        { face: 'normal', text: "如果不小心把葡萄种死了，记得用铲子清理掉哦。" },
        { face: 'normal', text: "酿酒的时候，容器的选择会极大影响风味，要慎重哦。" },
        { face: 'diff',   text: "哎呀，你一直盯着我看，我会不好意思的..." }, // 彩蛋
        { face: 'normal', text: "缺钱的话，也可以将果实单独售出，虽然可惜，但为了生存嘛。" },
        { face: 'normal', text: "种植葡萄是一门艺术，要时刻掌握水分，天气和季节也会对葡萄有影响。水分过高或者过低都会导致葡萄死亡。" },
        { face: 'normal', text: "想要控制葡萄的成熟度吗？试试剪枝功能，可以让葡萄成熟晚一些。" },
        { face: 'diff',   text: "苦恼水分控制不好，总是干死吗？来试试购买升级应急喷淋系统！" },
        { face: 'normal', text: "不耐寒的葡萄种会在冬天枯萎，记得及时收获哦。" },
        { face: 'normal', text: "春天多雨，不必总是浇水了。" },
        { face: 'normal', text: "夏季炎热，注意水分！" },
        { face: 'normal', text: "秋季是万物成熟的季节，这个季节的葡萄总是品貌更好一点。" },
        { face: 'diff',   text: "加装温室大棚之后的土地可以在冬季种植其他不耐寒的葡萄！" },
        { face: 'diff',   text: "希望葡萄的品质更好？来试试土壤改良吧。" },


    ],

    // 随机获取一句台词
    getRandomShopQuote() {
        const index = Math.floor(Math.random() * this.SHOP_QUOTES.length);
        return this.SHOP_QUOTES[index];
    },



    // === 核心功能 ===
    start(scriptKey) {
        if (!this.SCRIPTS[scriptKey]) return;
        this.currentScript = this.SCRIPTS[scriptKey];
        this.currentIndex = 0;
        this.isTalking = true;
        this.renderDialog();
    },

    next() {
        this.currentIndex++;
        if (this.currentIndex >= this.currentScript.length) {
            this.close();
        } else {
            this.renderDialog();
        }
    },

    close() {
        this.isTalking = false;
        const dialog = document.getElementById('guide-overlay');
        if (dialog) dialog.remove();
        // 关闭时同时也移除调试面板
        const debugPanel = document.getElementById('guide-debug-panel');
        if (debugPanel) debugPanel.remove();
    },

    renderDialog() {
        let overlay = document.getElementById('guide-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'guide-overlay';
            // 点击遮罩继续剧情
            overlay.onclick = (e) => {
                // 防止点击调试面板时触发下一句
                if(e.target.closest('#guide-debug-panel')) return;
                this.next();
            };
            document.body.appendChild(overlay);
        }

        const line = this.currentScript[this.currentIndex];
        const faceKey = line.face;
        const imgSrc = faceKey === 'diff' ? 'images/gong_diff.png' : 'images/gong_normal.png';
        
        // 读取商店专用配置
        const config = Guide.SHOP_CONFIG[faceKey] || { scale: 1, x: 0, y: 0 };
        const imgStyle = `transform: scale(${config.scale}) translate(${config.x}px, ${config.y}px);`;

        overlay.innerHTML = `
            <div class="char-portrait">
                <img id="guide-char-img" src="${imgSrc}" style="${imgStyle}">
            </div>
            <div class="dialog-box">
                <div class="text-area">
                    <div class="char-name">${line.name}</div>
                    <div class="char-text">${line.text}</div>
                    <div class="click-tip">点击空白处继续...</div>
                </div>
            </div>
        `;

        // 如果开启了调试模式，渲染调试面板
        if (this.debugMode) {
            this.renderDebugPanel(faceKey, config);
        }
    },

    // === 调试面板逻辑 ===
    renderDebugPanel(faceKey, config) {
        let panel = document.getElementById('guide-debug-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'guide-debug-panel';
            // 样式直接写在这里方便
            panel.style.cssText = `
                position: fixed; top: 10px; right: 10px; width: 220px;
                background: rgba(0,0,0,0.8); color: #fff; padding: 10px;
                border: 1px solid #e6a23c; border-radius: 8px; z-index: 9999;
                font-family: sans-serif; font-size: 12px;
            `;
            document.body.appendChild(panel);
        }

        // 渲染滑块
        panel.innerHTML = `
            <div style="color:#e6a23c; font-weight:bold; margin-bottom:5px;">立绘调试: ${faceKey}</div>
            
            <div style="margin-bottom:5px;">
                缩放 (Scale): <span id="val-scale">${config.scale.toFixed(2)}</span><br>
                <input type="range" min="0.5" max="2.0" step="0.01" value="${config.scale}" 
                oninput="Guide.updatePreview('${faceKey}', 'scale', this.value)">
            </div>

            <div style="margin-bottom:5px;">
                X轴偏移: <span id="val-x">${config.x}</span> px<br>
                <input type="range" min="-200" max="200" step="1" value="${config.x}" 
                oninput="Guide.updatePreview('${faceKey}', 'x', this.value)">
            </div>

            <div style="margin-bottom:10px;">
                Y轴偏移: <span id="val-y">${config.y}</span> px<br>
                <input type="range" min="-200" max="200" step="1" value="${config.y}" 
                oninput="Guide.updatePreview('${faceKey}', 'y', this.value)">
            </div>

            <div style="background:#333; padding:5px; word-break:break-all; user-select:text;">
                <code id="config-output">${faceKey}: { scale: ${config.scale}, x: ${config.x}, y: ${config.y} },</code>
            </div>
            <div style="color:#aaa; margin-top:5px;">*调整完请复制上方代码回 guide.js</div>
        `;
    },

    // 实时更新立绘样式
    updatePreview(faceKey, prop, value) {
        // 更新内存中的配置
        if(!this.CHAR_CONFIG[faceKey]) this.CHAR_CONFIG[faceKey] = { scale:1, x:0, y:0 };
        this.CHAR_CONFIG[faceKey][prop] = parseFloat(value);

        const cfg = this.CHAR_CONFIG[faceKey];
        
        // 更新图片样式
        const img = document.getElementById('guide-char-img');
        if(img) {
            img.style.transform = `scale(${cfg.scale}) translate(${cfg.x}px, ${cfg.y}px)`;
        }

        // 更新面板数值显示
        document.getElementById(`val-${prop}`).innerText = value;
        
        // 更新复制代码区域
        document.getElementById('config-output').innerText = 
            `${faceKey}: { scale: ${cfg.scale}, x: ${cfg.x}, y: ${cfg.y} },`;
    }
};
