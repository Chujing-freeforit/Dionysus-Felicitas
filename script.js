/* =========================================
   === 1. 导航与页面切换 (Navigation) ===
   ========================================= */

/**
 * 切换底部导航栏和页面显示
 * @param {string} tabName - 目标页面的ID后缀 (如 'tavern', 'gallery')
 * @param {HTMLElement} clickedNav - 被点击的导航按钮元素 (可选)
 */
function switchTab(tabName, clickedNav) {
    // 1. 切换前先关闭可能打开的弹窗
    closeImageViewer();
    closeDicePanel();

    // 2. 隐藏所有页面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // 3. 取消所有底部按钮的高亮
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // 4. 显示目标页面
    const targetPage = document.getElementById('page-' + tabName);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 5. 高亮被点击的按钮 (如果有传这个参数)
    if (clickedNav) {
        clickedNav.classList.add('active');
    }

    // 6. 控制骰子按钮样式 (只在酒馆显示完整版，其他页面变迷你)
    const fateBtn = document.querySelector('.fate-trigger');
    if (fateBtn) {
        if (tabName === 'tavern') {
            fateBtn.classList.remove('mini');
        } else {
            fateBtn.classList.add('mini');
        }
    }
}

/* =========================================
   === 2. 角色对话系统 (Dialogue System) ===
   ========================================= */

let currentCharacterId = null; // 当前正在对话的角色ID
let currentDialogueIndex = 0;  // 当前说到第几句了
let typewriterInterval = null; // 打字机计时器

/**
 * 打开角色对话界面
 * @param {string} charId - 角色ID (对应 data.js 中的 key)
 */
function openCharacter(charId) {
    // 安全检查：确保数据存在
    if (typeof characterData === 'undefined' || !characterData[charId]) {
        console.error("角色数据不存在:", charId);
        return;
    }

    currentCharacterId = charId;
    currentDialogueIndex = 0;

    const character = characterData[charId];
    const overlay = document.getElementById('overlay');
    const dialogueText = document.getElementById('dialogue-text');
    const bigCharImg = document.getElementById('big-char-img');

    // 设置立绘图片
    bigCharImg.src = character.big_img;

    // 设置立绘位置
    bigCharImg.style.bottom = character.big_bottom + 'px';
    if (character.big_offset_x) {
        bigCharImg.style.marginLeft = character.big_offset_x + 'px';
    } else {
        bigCharImg.style.marginLeft = '0px';
    }

    // 播放第一句对话 (打字机效果)
    typewriterEffect(dialogueText, character.dialogues[0]);
    
    // 显示遮罩层
    overlay.classList.remove('hidden');
}

/**
 * 关闭角色界面
 */
function closeCharacter(event) {
    // 如果点击的是对话框本身，不要关闭 (通过 event.target 判断)
    // 但我们在 HTML 里已经用了 stopPropagation，这里直接关就行
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hidden');
    
    // 关闭时停止打字机
    if (typewriterInterval) clearInterval(typewriterInterval);
}

/**
 * 切换下一句对话
 */
function nextDialogue() {
    if (!currentCharacterId || typeof characterData === 'undefined') return;

    const dialogues = characterData[currentCharacterId].dialogues;
    currentDialogueIndex++;

    // 循环对话：如果说完了，回到第一句
    if (currentDialogueIndex >= dialogues.length) {
        currentDialogueIndex = 0;
    }

    const dialogueText = document.getElementById('dialogue-text');
    typewriterEffect(dialogueText, dialogues[currentDialogueIndex]);
}

/**
 * 打字机效果工具函数
 */
function typewriterEffect(element, text) {
    if (typewriterInterval) clearInterval(typewriterInterval);

    let i = 0;
    element.innerHTML = '';
    element.style.visibility = 'visible';

    typewriterInterval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typewriterInterval);
            typewriterInterval = null;
        }
    }, 50); // 速度调整为 50ms，稍微快一点更流畅
}

/* =========================================
   === 3. 酒馆背景滚动 (Background Scroll) ===
   ========================================= */

let currentBgPosition = 0;
const scrollStep = 150; // 每次滚动的像素

function scrollBackground(direction) {
    const scrollContent = document.getElementById('scroll-content');
    if (!scrollContent) return;

    const container = scrollContent.parentElement;
    // 计算最大可滚动距离 (负值)
    const maxScroll = scrollContent.scrollWidth - container.clientWidth;

    if (maxScroll <= 0) return; // 内容不够宽，不需要滚动

    if (direction === 'left') {
        currentBgPosition += scrollStep;
        if (currentBgPosition > 0) currentBgPosition = 0; // 左边界限制
    } else if (direction === 'right') {
        currentBgPosition -= scrollStep;
        if (currentBgPosition < -maxScroll) currentBgPosition = -maxScroll; // 右边界限制
    }

    scrollContent.style.transform = `translateX(${currentBgPosition}px)`;
}

/* =========================================
   === 4. 画廊功能 (Gallery) ===
   ========================================= */

/**
 * 初始化画廊：生成缩略图
 */
function initGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    // 安全检查
    if (typeof galleryData === 'undefined') {
        console.warn("画廊数据未加载");
        grid.innerHTML = '<p style="color:#999;text-align:center;">暂无画作数据</p>';
        return;
    }

    grid.innerHTML = ''; // 清空现有内容

    galleryData.forEach(art => {
        const thumbElement = document.createElement('div');
        thumbElement.className = 'gallery-thumbnail';
        thumbElement.setAttribute('data-id', art.id);
        thumbElement.innerHTML = `<img src="${art.thumb_src}" alt="${art.name}" loading="lazy">`; // 懒加载优化
        thumbElement.onclick = () => openImageViewer(art.id);
        grid.appendChild(thumbElement);
    });
}

/**
 * 打开图片查看器
 */
function openImageViewer(artId) {
    if (typeof galleryData === 'undefined') return;
    
    const art = galleryData.find(item => item.id === artId);
    if (!art) return;

    const viewer = document.getElementById('image-viewer');
    document.getElementById('viewer-image').src = art.full_src;
    document.getElementById('viewer-name').innerText = art.name;
    
    // 设置作者信息及点击搜索事件
    const authorEl = document.getElementById('viewer-author');
    authorEl.innerText = art.author;
    authorEl.onclick = () => searchByTerm(art.author);

    // 设置元数据
    document.getElementById('viewer-platform').innerHTML = `<i class="fas fa-globe"></i> ${art.platform}`;
    document.getElementById('viewer-date').innerHTML = `<i class="far fa-calendar-alt"></i> ${art.date}`;

    // 生成标签
    const tagsContainer = document.getElementById('viewer-tags');
    tagsContainer.innerHTML = '';
    art.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.innerText = `#${tag}`;
        tagElement.onclick = () => searchByTerm(tag);
        tagsContainer.appendChild(tagElement);
    });

    viewer.classList.remove('hidden');
}

function closeImageViewer() {
    document.getElementById('image-viewer').classList.add('hidden');
}

/**
 * 搜索/过滤画廊
 */
function filterGallery() {
    if (typeof galleryData === 'undefined') return;

    const searchInput = document.getElementById('gallery-search');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');

    thumbnails.forEach(thumb => {
        const artId = thumb.getAttribute('data-id');
        const art = galleryData.find(item => item.id === artId);
        if (!art) return;

        const nameMatch = art.name.toLowerCase().includes(searchTerm);
        const tagMatch = art.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        const authorMatch = art.author.toLowerCase().includes(searchTerm);

        if (nameMatch || tagMatch || authorMatch) {
            thumb.style.display = 'block';
        } else {
            thumb.style.display = 'none';
        }
    });
}

/**
 * 点击标签快捷搜索
 */
function searchByTerm(term) {
    // 1. 切换到画廊页面
    const galleryNavItem = Array.from(document.querySelectorAll('.nav-item'))
        .find(item => item.textContent.includes('画廊'));
    if (galleryNavItem) {
        switchTab('gallery', galleryNavItem);
    }
    
    // 2. 填入搜索词并执行
    const searchInput = document.getElementById('gallery-search');
    searchInput.value = term;
    filterGallery();
    
    // 3. 关闭查看器
    closeImageViewer();
}

/* =========================================
   === 5. 音乐播放器 (Music Player) - 升级版 ===
   ========================================= */

let currentTrackIndex = 0;
let isPlaying = false;
let isRandomMode = false;   // 是否随机播放
let isFavOnlyMode = false;  // 是否只播收藏
let favorites = [];         // 收藏列表 (存歌曲标题)

const audioPlayer = document.getElementById('bgm-player');
const musicDisc = document.getElementById('music-disc');
const musicCover = document.getElementById('music-cover');

// 初始化音乐
function initMusic() {
    // === 新增：防双重播放检测 ===
    // 检查当前页面是否被嵌套在 iframe 中
    // window.self 是当前窗口，window.top 是最顶层窗口
    // 如果它们不相等，说明当前页面是在 iframe 里运行的
    if (window.self !== window.top) {
        console.log("检测到在 iframe 中运行，已禁用背景音乐功能，防止双重播放。");
        // 隐藏 iframe 里的悬浮唱片机，避免误触
        const widget = document.getElementById('music-widget');
        if (widget) widget.style.display = 'none';
        return; // 直接结束函数，不再执行后面的播放逻辑！
    }
    // ============================

    if (typeof musicPlaylist === 'undefined' || musicPlaylist.length === 0) return;
    
    // 1. 读取本地存储的收藏列表
    const savedFavs = localStorage.getItem('my_music_favs');
    if (savedFavs) {
        favorites = JSON.parse(savedFavs);
    }

    // 2. 渲染播放列表
    renderPlaylist();

    // 3. 加载第一首歌 (不自动播放)
    loadTrack(0);
    
    // 4. 监听播放结束，自动下一首
    if (audioPlayer) {
        audioPlayer.addEventListener('ended', () => {
            nextTrack(true); 
        });
    }
}


// 渲染播放列表 UI
function renderPlaylist() {
    const listEl = document.getElementById('mp-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    musicPlaylist.forEach((track, index) => {
        // 如果开启了“只看收藏”，且这首歌不在收藏里，就跳过不显示
        if (isFavOnlyMode && !favorites.includes(track.title)) {
            return; 
        }

        const li = document.createElement('li');
        li.className = 'mp-item';
        if (index === currentTrackIndex) li.classList.add('playing');

        // 判断是否收藏
        const isFav = favorites.includes(track.title);
        const heartClass = isFav ? 'fas fa-heart is-fav' : 'far fa-heart';

        li.innerHTML = `
            <span onclick="playSpecificTrack(${index})">${track.title}</span>
            <i class="mp-fav-btn ${heartClass}" onclick="toggleFavorite('${track.title}', event)"></i>
        `;
        listEl.appendChild(li);
    });
}

// 加载歌曲
function loadTrack(index) {
    if (typeof musicPlaylist === 'undefined') return;
    
    // 边界检查
    if (index >= musicPlaylist.length) index = 0;
    if (index < 0) index = musicPlaylist.length - 1;

    currentTrackIndex = index;
    const track = musicPlaylist[index];

    // 更新音频源和封面
    audioPlayer.src = track.src;
    musicCover.src = track.cover;
    
    // 更新面板上的标题
    const titleEl = document.getElementById('mp-title');
    if (titleEl) titleEl.innerText = track.title;

    // 更新列表的高亮状态
    renderPlaylist();

    // 如果正在播放状态，切歌后继续播放
    if (isPlaying) {
        audioPlayer.play().catch(e => console.log("播放失败:", e));
        musicDisc.classList.add('rotating');
        musicDisc.classList.remove('paused');
        updatePlayPauseIcon(true);
    } else {
        updatePlayPauseIcon(false);
    }
}

// 播放/暂停开关
function toggleMusic() {
    if (typeof musicPlaylist === 'undefined' || musicPlaylist.length === 0) return;

    if (isPlaying) {
        audioPlayer.pause();
        musicDisc.classList.add('paused');
        isPlaying = false;
        updatePlayPauseIcon(false);
    } else {
        audioPlayer.play().then(() => {
            musicDisc.classList.add('rotating');
            musicDisc.classList.remove('paused');
            isPlaying = true;
            updatePlayPauseIcon(true);
        }).catch(error => {
            console.log("播放被阻止:", error);
            alert("请先点击页面任意位置，再尝试播放音乐");
        });
    }
}

// 更新面板上的播放/暂停图标
function updatePlayPauseIcon(playing) {
    const btn = document.getElementById('btn-play-pause');
    if (!btn) return;
    if (playing) {
        btn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        btn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// 下一首逻辑 (核心逻辑)
function nextTrack(isAuto = false) {
    let nextIndex = currentTrackIndex;

    // 1. 获取当前有效的播放列表 (如果是只播收藏模式，候选池会变小)
    let candidates = musicPlaylist.map((_, i) => i); // 默认所有歌曲索引 [0, 1, 2...]
    if (isFavOnlyMode) {
        candidates = candidates.filter(i => favorites.includes(musicPlaylist[i].title));
        if (candidates.length === 0) {
            alert("没有收藏的歌曲哦！");
            return;
        }
    }

    // 2. 根据模式决定下一首
    if (isRandomMode) {
        // 随机模式：从候选池里随机选一个
        const randomPos = Math.floor(Math.random() * candidates.length);
        nextIndex = candidates[randomPos];
    } else {
        // 顺序模式：找当前歌曲在候选池的位置，然后+1
        // 如果当前歌不在候选池里(比如取消收藏了)，就播候选池第一首
        const currentPosInCandidates = candidates.indexOf(currentTrackIndex);
        if (currentPosInCandidates === -1 || currentPosInCandidates === candidates.length - 1) {
            nextIndex = candidates[0]; // 回到开头
        } else {
            nextIndex = candidates[currentPosInCandidates + 1];
        }
    }

    loadTrack(nextIndex);
}

// 上一首逻辑
function prevTrack() {
    // 简单处理：上一首就不搞随机了，直接按顺序倒退，或者按列表倒退
    // 这里为了简单，直接按原始列表倒退，如果遇到不喜欢的再切
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = musicPlaylist.length - 1;
    loadTrack(prevIndex);
}

// 播放指定歌曲 (点击列表时)
function playSpecificTrack(index) {
    isPlaying = true; // 点击列表直接播放
    loadTrack(index);
}

// 切换收藏状态
function toggleFavorite(title, event) {
    if (event) event.stopPropagation(); // 防止触发播放

    const index = favorites.indexOf(title);
    if (index > -1) {
        favorites.splice(index, 1); // 取消收藏
    } else {
        favorites.push(title); // 添加收藏
    }

    // 保存到本地
    localStorage.setItem('my_music_favs', JSON.stringify(favorites));
    
    // 重新渲染列表
    renderPlaylist();
}

// 切换播放模式 (顺序 <-> 随机)
function togglePlayMode() {
    isRandomMode = !isRandomMode;
    const btn = document.getElementById('btn-mode');
    if (isRandomMode) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-random"></i>'; // 随机图标
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-repeat"></i>'; // 循环图标
    }
}

// 切换“只播收藏”模式
function toggleFavOnly() {
    isFavOnlyMode = !isFavOnlyMode;
    const btn = document.getElementById('btn-fav-only');
    
    if (isFavOnlyMode) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-heart"></i>'; // 实心心
        // 如果当前歌不在收藏里，自动切到下一首收藏歌
        if (!favorites.includes(musicPlaylist[currentTrackIndex].title)) {
            nextTrack();
        }
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-heart"></i>'; // 空心心
    }
    renderPlaylist(); // 重新渲染列表，隐藏/显示非收藏歌曲
}

// 打开/关闭面板
function openMusicPanel() {
    document.getElementById('music-panel-overlay').classList.remove('hidden');
    renderPlaylist(); // 打开时刷新一下列表状态
}
function closeMusicPanel() {
    document.getElementById('music-panel-overlay').classList.add('hidden');
}

/* =========================================
   === 6. 命运投掷系统 (Dice System) ===
   ========================================= */

const diceOverlay = document.getElementById('dice-overlay');
const formulaDisplay = document.getElementById('dice-formula-display');
const totalDisplay = document.getElementById('dice-total-display');
let diceFormula = []; 

function openDicePanel() {
    if (diceOverlay) {
        diceOverlay.classList.remove('hidden');
        clearFormula();
    }
}

function closeDicePanel() {
    if (diceOverlay) diceOverlay.classList.add('hidden');
}

function addDice(sides) {
    diceFormula.push({ type: 'dice', val: sides });
    updateDiceDisplay();
}

function addMod(value) {
    diceFormula.push({ type: 'mod', val: value });
    updateDiceDisplay();
}

function clearFormula() {
    diceFormula = [];
    if (formulaDisplay) formulaDisplay.innerText = "请选择骰子...";
    if (totalDisplay) totalDisplay.innerText = "";
}

function updateDiceDisplay() {
    if (!formulaDisplay) return;
    if (diceFormula.length === 0) {
        formulaDisplay.innerText = "请选择骰子...";
        return;
    }

    const text = diceFormula.map(item => {
        if (item.type === 'dice') return `d${item.val}`;
        if (item.type === 'mod') return item.val >= 0 ? `+${item.val}` : `${item.val}`;
    }).join(' + ').replace(/\+ -/g, '- ');

    formulaDisplay.innerText = text;
    if (totalDisplay) totalDisplay.innerText = "";
}

function rollAll() {
    if (diceFormula.length === 0) return;

    let total = 0;
    let details = [];

    diceFormula.forEach(item => {
        if (item.type === 'dice') {
            const roll = Math.floor(Math.random() * item.val) + 1;
            total += roll;
            let mark = "";
            if (item.val === 20 && roll === 20) mark = " (大成功!)";
            if (item.val === 20 && roll === 1) mark = " (大失败!)";
            details.push(`<span style="color:#e6a23c">${roll}</span><small>[d${item.val}${mark}]</small>`);
        } else {
            total += item.val;
            details.push(`${item.val}`);
        }
    });

    const detailStr = details.join(' + ').replace(/\+ -/g, '- ');
    formulaDisplay.innerHTML = detailStr; 
    totalDisplay.innerText = `= ${total}`;
}

function rollJrrp() {
    const todayStr = new Date().toLocaleDateString();
    const storedDate = localStorage.getItem('jrrp_date');
    const storedValue = localStorage.getItem('jrrp_value');

    let rpValue;
    let isNewRoll = false;

    if (storedDate === todayStr && storedValue) {
        rpValue = parseInt(storedValue);
        isNewRoll = false;
    } else {
        rpValue = Math.floor(Math.random() * 100) + 1;
        localStorage.setItem('jrrp_date', todayStr);
        localStorage.setItem('jrrp_value', rpValue);
        isNewRoll = true;
    }

    totalDisplay.innerText = "正在感应...";
    formulaDisplay.innerText = "d100 (每日一次)";
    
    setTimeout(() => {
        let comment = "";
        if (rpValue === 100) comment = "神选之人！(100)";
        else if (rpValue >= 90) comment = "运势绝佳！诸事顺遂。";
        else if (rpValue >= 60) comment = "运气不错哦。";
        else if (rpValue >= 40) comment = "普普通通，平平淡淡才是真。";
        else if (rpValue >= 20) comment = "稍微有点倒霉...";
        else if (rpValue > 1) comment = "诸事不宜，建议在酒馆睡大觉。";
        else comment = "大凶... (1)";

        if (!isNewRoll) comment += " [今日已定]";

        totalDisplay.innerText = rpValue;
        formulaDisplay.innerText = comment;
    }, 600);
}

/* =========================================
   === 7. 游戏机逻辑 (Game Console) ===
   ========================================= */

function launchGame(gameName) {
    const overlay = document.getElementById('fullscreen-game-overlay');
    const frame = document.getElementById('fullscreen-game-frame');
    
    // === 新增：如果背景音乐正在播放，先暂停它 ===
    // 这样游戏的声音才不会和背景音乐打架
    if (isPlaying) {
        toggleMusic(); // 调用这个函数暂停音乐
        // 给播放器贴个条子，记下来：“我是因为玩游戏才被迫暂停的”
        audioPlayer.dataset.pausedByGame = "true";
    }

    // 设置游戏路径（这一步才是真正加载游戏）
    frame.src = `games/${gameName}/index.html`;
    
    // 显示全屏遮罩层
    overlay.classList.remove('hidden');
}




function closeGame() {
    const overlay = document.getElementById('fullscreen-game-overlay');
    const frame = document.getElementById('fullscreen-game-frame');
    
    overlay.classList.add('hidden');
    frame.src = ''; // 停止运行
}

/* =========================================
   === 8. 初始化与工具 (Init & Utils) ===
   ========================================= */

// 解决移动端视口高度问题
function setAppHeight() {
    document.body.style.height = window.innerHeight + 'px';
}

// 页面加载完成后执行
window.addEventListener('load', () => {
    setAppHeight();
    initGallery();
    initMusic();
    
    // 监听搜索框
    const searchInput = document.getElementById('gallery-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterGallery);
    }
    //圣诞功能//
    if (typeof initChristmasFeatures === 'function') {
        // 如果存在，就调用它
        console.log("检测到圣诞插件，正在启动...");
        initChristmasFeatures();
    }
});

window.addEventListener('resize', setAppHeight);

// 后端连接测试 (保留)
fetch("http://139.199.180.70:3000/api/hello")
    .then(res => res.json())
    .then(data => console.log("来自后端：", data.message))
    .catch(err => console.error("请求失败：", err));

    // === 喵喵彩蛋逻辑 ===
let catTimeout; // 用来记录定时器，防止连续点击闪烁

function showCatBubble() {
    const bubble = document.getElementById('cat-bubble');
    
    // 添加显示类名
    bubble.classList.add('show');
    
    // 如果之前有定时器，先清除，重新计时
    if (catTimeout) clearTimeout(catTimeout);
    
    // 2秒后自动消失
    catTimeout = setTimeout(() => {
        bubble.classList.remove('show');
    }, 2000);
}
