function initChristmasFeatures() {
    // ==========================================
    // === 1. 原料区 ===
    // ==========================================

    const xmasDialogueData = {
        'sheep': {
            dialogues: [ "圣诞快乐！我希望你们能喜欢这里！", "电脑差点要爆炸了...可恶好想换新。。", "嗯嗯...好喜欢节日...","在此再次感谢褚静同学、蜥蜴同学、宫同学为网站建立的的付出——" ],
            userChoice: "也祝你圣诞快乐！"
        },
        'chu': {
            dialogues: [ "你就过圣诞节吧，鲨鱼在海里一点也不落泪，吴京在坦克里不会看后视镜，孙悟空在天宫上不会伤心，哪吒在炉子里好香想吃莲藕汤。" ],
            userChoice: "哦哦...哦哦哦..."
        },
        'fox': {
            dialogues: [ "咳咳，祝你圣诞快乐，祝你圣诞快乐……哦不对不对唱错了，耶稣娶老婆……也不对也不对。不管了，总之祝你圣诞快乐——！" ],
            userChoice: "哈哈哈，干杯！"
        },
        'crow': {
            dialogues: [ "祝广大上班的不上班的克苏诞节快乐，什么，什么叫是圣诞节，总之Merry Cthulmas！" ],
            userChoice: "辛苦了，打工人！圣诞节快乐！"
        },
        'lizard': {
            dialogues: [ "圣诞约不出去的朋友们，看朋友圈原来是要去约会。" ],
            userChoice: "嗯嗯...lonely Cristmas..."
        },
        'marten': {
            dialogues: [ "圣诞节要一起跑团吗？元旦呢？春节呢？情人节呢？👁️👁️👁️👁️👁️好吧，我会一直等着你的…一直……" ],
            userChoice: "会有的（会有的）"
        },
        'feng': {
            dialogues: [ "圣诞送自己，离职大礼包。" ],
            userChoice: "恭喜恭喜，下家会更好！"
        }
    };

    const stickerAssets = [
        { type: 'emoji', src: '🎅' }, { type: 'image', src: 'images/hat.png' },
        { type: 'image', src: 'images/hat2.png' }, { type: 'image', src: 'images/zhuangshi.png' },
        { type: 'image', src: 'images/bell.png' }, { type: 'emoji', src: '🎄' },
        { type: 'emoji', src: '🎁' }, { type: 'emoji', src: '🦌' }
    ];
    
    let isLocked = false;
    let selectedSticker = null;

    // ==========================================
    // === 2. 圣诞对话插件核心 ===
    // ==========================================
    const XmasDialogueAddon = {
        state: 'inactive',
        xmasDialogueIndex: 0,
        currentCharacterId: null,
        btnXmasStart: null,
        btnUserChoice: null,

        init() {
            if (typeof characterData === 'undefined') return;

            // 注入数据
            for (const charId in xmasDialogueData) {
                if (characterData[charId]) {
                    characterData[charId].xmasData = xmasDialogueData[charId];
                }
            }

            const dialogueBox = document.querySelector('.dialogue-box');
            if (!dialogueBox) return;

            // --- 创建“圣诞快乐”入口按钮 ---
            this.btnXmasStart = document.createElement('button');
            this.btnXmasStart.id = 'btn-xmas-start';
            this.btnXmasStart.className = 'xmas-dialogue-btn';
            this.btnXmasStart.innerText = '圣诞快乐！';
            this.btnXmasStart.onclick = (e) => { e.stopPropagation(); this.start(); };

            // --- 创建“用户选项”按钮 ---
            this.btnUserChoice = document.createElement('button');
            this.btnUserChoice.id = 'btn-user-choice';
            this.btnUserChoice.className = 'xmas-dialogue-btn';
            // 【修改点】：点击后直接关闭对话框
            this.btnUserChoice.onclick = (e) => { 
                e.stopPropagation(); 
                window.closeCharacter(); // 直接调用关闭函数
            };

            dialogueBox.appendChild(this.btnXmasStart);
            dialogueBox.appendChild(this.btnUserChoice);

            this.wrapFunctions();
        },

        wrapFunctions() {
            const self = this;
            
            const originalOpenCharacter = window.openCharacter;
            window.openCharacter = function(charId) {
                self.reset(); 
                self.currentCharacterId = charId;
                originalOpenCharacter.apply(this, arguments);

                if (typeof characterData !== 'undefined' && characterData[charId]?.xmasData) {
                    self.btnXmasStart.style.display = 'block';
                }
            };

            const originalCloseCharacter = window.closeCharacter;
            window.closeCharacter = function() {
                self.reset();
                originalCloseCharacter.apply(this, arguments);
            };

            const originalNextDialogue = window.nextDialogue;
            window.nextDialogue = function() {
                if (self.state === 'active') {
                    self.playXmasDialogue();
                } else if (self.state === 'inactive') {
                    originalNextDialogue.apply(this, arguments);
                }
            };
        },

        start() {
            this.state = 'active';
            this.xmasDialogueIndex = 0;
            this.btnXmasStart.style.display = 'none';
            this.playXmasDialogue();
        },

        playXmasDialogue() {
            if (typeof characterData === 'undefined') return;
            
            const charData = characterData[this.currentCharacterId];
            const xmasDialogues = charData?.xmasData?.dialogues;

            if (!xmasDialogues) { this.revert(); return; }

            const dialogueTextEl = document.getElementById('dialogue-text');
            
            if (this.xmasDialogueIndex < xmasDialogues.length) {
                if (window.typewriterEffect) {
                    window.typewriterEffect(dialogueTextEl, xmasDialogues[this.xmasDialogueIndex]);
                } else {
                    dialogueTextEl.innerText = xmasDialogues[this.xmasDialogueIndex];
                }
                this.xmasDialogueIndex++;
            } else {
                // 对话结束，显示选项
                this.state = 'finished';
                dialogueTextEl.style.visibility = 'hidden'; 
                this.btnUserChoice.innerText = charData.xmasData.userChoice;
                this.btnUserChoice.style.display = 'block';
            }
        },

        revert() {
            this.reset();
            if (typeof characterData !== 'undefined' && window.currentDialogueIndex !== undefined) {
                window.currentDialogueIndex = 0;
                const charData = characterData[this.currentCharacterId];
                const dialogueTextEl = document.getElementById('dialogue-text');
                if (window.typewriterEffect) {
                    window.typewriterEffect(dialogueTextEl, charData.dialogues[0]);
                }
            }
        },

        reset() {
            this.state = 'inactive';
            this.xmasDialogueIndex = 0;
            if (this.btnXmasStart) this.btnXmasStart.style.display = 'none';
            if (this.btnUserChoice) this.btnUserChoice.style.display = 'none';
            
            const dialogueTextEl = document.getElementById('dialogue-text');
            if(dialogueTextEl) dialogueTextEl.style.visibility = 'visible';
        }
    };

    // ==========================================
    // === 3. 功能模块函数定义区 ===
    // ==========================================

    function observeDialogueOverlay() {
        const dialogueOverlay = document.getElementById('overlay');
        if (!dialogueOverlay) return;
        const observer = new MutationObserver(() => {
            const isHidden = dialogueOverlay.classList.contains('hidden');
            document.body.classList.toggle('dialogue-mode-active', !isHidden);
        });
        observer.observe(dialogueOverlay, { attributes: true, attributeFilter: ['class'] });
    }

    function observeGameOverlay() {
        const gameOverlay = document.getElementById('fullscreen-game-overlay');
        if (!gameOverlay) return;
        const observer = new MutationObserver(() => {
            const isHidden = gameOverlay.classList.contains('hidden');
            document.body.classList.toggle('game-mode-active', !isHidden);
        });
        observer.observe(gameOverlay, { attributes: true, attributeFilter: ['class'] });
        document.body.classList.toggle('game-mode-active', !gameOverlay.classList.contains('hidden'));
    }

    function updateUIVisibility() {
        const uiContainer = document.querySelector('.xmas-ui-container');
        if (!uiContainer) return;
        const activePage = document.querySelector('.page.active');
        if (!activePage || activePage.id === 'page-tavern') {
            uiContainer.classList.remove('minimized');
        } else {
            uiContainer.classList.add('minimized');
            const menu = uiContainer.querySelector('.asset-menu');
            if (menu) menu.classList.remove('show');
        }
    }

    function observePageChanges() {
        const mainContainer = document.getElementById('main-container');
        if (!mainContainer) return;
        updateUIVisibility();
        const observer = new MutationObserver(() => updateUIVisibility());
        observer.observe(mainContainer, { attributes: true, childList: true, subtree: true, attributeFilter: ['class'] });
    }

    function initDeveloperDecorations() {
        const borderLeft = document.createElement('img');
        borderLeft.src = 'images/zhuangshi2.png';
        borderLeft.className = 'fixed-side-border left';
        document.body.prepend(borderLeft);
        const borderRight = document.createElement('img');
        borderRight.src = 'images/zhuangshi1.png';
        borderRight.className = 'fixed-side-border right';
        document.body.prepend(borderRight);
    }

    function initSnow() {
        const canvas = document.createElement('canvas');
        canvas.id = 'xmas-snow-canvas';
        const ctx = canvas.getContext('2d');
        document.body.prepend(canvas);
        let snowflakes = [];
        const snowflakeCount = 150;
        function onResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            snowflakes = [];
            for (let i = 0; i < snowflakeCount; i++) {
                snowflakes.push({
                    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1, speed: Math.random() * 1 + 0.5,
                    opacity: Math.random() * 0.5 + 0.5
                });
            }
        }
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < snowflakes.length; i++) {
                const flake = snowflakes[i];
                flake.y += flake.speed;
                if (flake.y > canvas.height) {
                    flake.y = -flake.radius;
                    flake.x = Math.random() * canvas.width;
                }
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
                ctx.fill();
            }
            requestAnimationFrame(draw);
        }
        window.addEventListener('resize', onResize);
        onResize();
        draw();
    }

    function initChristmasLights() {
        const header = document.querySelector('.top-header');
        if(!header) return;
        const box = document.createElement('div');
        box.className = 'christmas-lights';
        for(let i=0; i<8; i++){
            const b = document.createElement('div');
            b.className = 'light-bulb';
            box.appendChild(b);
        }
        header.appendChild(box);
    }

    function initStickerUI() {
        const container = document.createElement('div');
        container.className = 'xmas-ui-container';
        const menu = document.createElement('div');
        menu.className = 'asset-menu';
        stickerAssets.forEach(asset => {
            const item = document.createElement('div');
            item.className = 'asset-item';
            item.innerHTML = asset.type === 'image' ? `<img src="${asset.src}" />` : `<span>${asset.src}</span>`;
            item.onclick = () => { createSticker(asset); menu.classList.remove('show'); };
            menu.appendChild(item);
        });
        container.appendChild(menu);
        const mainBtn = document.createElement('div');
        mainBtn.className = 'xmas-btn';
        mainBtn.innerHTML = '🎅';
        mainBtn.onclick = (e) => { e.stopPropagation(); if(isLocked) toggleLockMode(); menu.classList.toggle('show'); };
        container.appendChild(mainBtn);
        const finishBtn = document.createElement('div');
        finishBtn.id = 'btn-finish';
        finishBtn.className = 'xmas-btn';
        finishBtn.innerText = '✔';
        finishBtn.onclick = toggleLockMode;
        container.appendChild(finishBtn);
        document.body.appendChild(container);
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.xmas-ui-container') && !e.target.closest('.sticker-wrapper')) {
                menu.classList.remove('show');
                if(!isLocked) deselectSticker();
            }
        });
    }

    function createSticker(asset) {
        document.getElementById('btn-finish').style.display = 'flex';
        const wrapper = document.createElement('div');
        wrapper.className = 'sticker-wrapper';
        wrapper.style.left = window.innerWidth / 2 + 'px';
        wrapper.style.top = window.innerHeight / 2 + 'px';
        wrapper.dataset.rot = 0;
        const content = document.createElement('div');
        content.className = 'sticker-content';
        content.innerHTML = asset.type === 'image' ? `<img src="${asset.src}" />` : `<span>${asset.src}</span>`;
        wrapper.appendChild(content);
        const handle = document.createElement('div');
        handle.className = 'sticker-handle';
        wrapper.appendChild(handle);
        const delBtn = document.createElement('div');
        delBtn.className = 'sticker-delete';
        delBtn.onclick = (e) => { e.stopPropagation(); wrapper.remove(); checkIfEmpty(); };
        wrapper.appendChild(delBtn);
        bindInteraction(wrapper, handle);
        document.body.appendChild(wrapper);
        selectSticker(wrapper);
    }

    function checkIfEmpty() {
        const remaining = document.querySelectorAll('body > .sticker-wrapper');
        if(remaining.length === 0 && !isLocked) {
            document.getElementById('btn-finish').style.display = 'none';
        }
    }

    function bindInteraction(wrapper, handle) {
        wrapper.addEventListener('touchstart', (e) => {
            if(e.target === handle || e.target.classList.contains('sticker-delete')) return;
            e.preventDefault();
            selectSticker(wrapper);
            const touch = e.touches[0];
            const rect = wrapper.getBoundingClientRect();
            const offsetX = touch.clientX - (rect.left + rect.width/2);
            const offsetY = touch.clientY - (rect.top + rect.height/2);
            const move = (ev) => {
                const t = ev.touches[0];
                wrapper.style.left = (t.clientX - offsetX) + 'px';
                wrapper.style.top = (t.clientY - offsetY) + 'px';
            };
            const end = () => { document.removeEventListener('touchmove', move); document.removeEventListener('touchend', end); };
            document.addEventListener('touchmove', move, {passive: false});
            document.addEventListener('touchend', end);
        }, {passive: false});
        handle.addEventListener('touchstart', (e) => {
            e.preventDefault(); e.stopPropagation();
            const rect = wrapper.getBoundingClientRect();
            const cx = rect.left + rect.width/2;
            const cy = rect.top + rect.height/2;
            const move = (ev) => {
                const t = ev.touches[0];
                const dx = t.clientX - cx;
                const dy = t.clientY - cy;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const rotation = angle - 45;
                const dist = Math.hypot(dx, dy);
                const size = Math.max(40, dist * 2);
                wrapper.style.width = size + 'px';
                wrapper.style.height = size + 'px';
                wrapper.dataset.rot = rotation;
                wrapper.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            };
            const end = () => { document.removeEventListener('touchmove', move); document.removeEventListener('touchend', end); };
            document.addEventListener('touchmove', move, {passive: false});
            document.addEventListener('touchend', end);
        }, {passive: false});
    }

    function selectSticker(el) {
        if(isLocked) return;
        if(selectedSticker) selectedSticker.classList.remove('selected');
        selectedSticker = el;
        el.classList.add('selected');
    }
    function deselectSticker() {
        if(selectedSticker) { selectedSticker.classList.remove('selected'); selectedSticker = null; }
    }

    function toggleLockMode() {
        isLocked = !isLocked;
        const btn = document.getElementById('btn-finish');
        const activePage = document.querySelector('.page.active');
        let targetContainer = document.body;
        if (activePage) {
            targetContainer = activePage.id === 'page-tavern' ? (document.getElementById('scroll-content') || activePage) : activePage;
        }
        if (isLocked) {
            deselectSticker();
            btn.innerText = '✏️';
            btn.classList.add('mode-locked');
            const activeStickers = document.querySelectorAll('body > .sticker-wrapper');
            activeStickers.forEach(el => {
                el.classList.add('locked');
                const rect = el.getBoundingClientRect();
                const contRect = targetContainer.getBoundingClientRect();
                let relLeft = rect.left - contRect.left + (rect.width/2);
                let relTop = rect.top - contRect.top + (rect.height/2);
                if(targetContainer !== document.body) {
                    relTop += targetContainer.scrollTop;
                    relLeft += targetContainer.scrollLeft;
                }
                targetContainer.appendChild(el);
                el.style.left = relLeft + 'px';
                el.style.top = relTop + 'px';
            });
        } else {
            btn.innerText = '✔';
            btn.classList.remove('mode-locked');
            const lockedStickers = targetContainer.querySelectorAll('.sticker-wrapper.locked');
            lockedStickers.forEach(el => {
                el.classList.remove('locked');
                const rect = el.getBoundingClientRect();
                document.body.appendChild(el);
                el.style.left = (rect.left + rect.width/2) + 'px';
                el.style.top = (rect.top + rect.height/2) + 'px';
            });
        }
    }

    // ==========================================
    // === 4. 启动区 ===
    // ==========================================
    initSnow();
    initChristmasLights();
    initDeveloperDecorations();
    initStickerUI();
    
    observePageChanges();
    observeGameOverlay();
    observeDialogueOverlay();

    XmasDialogueAddon.init();
}
