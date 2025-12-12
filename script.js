let typewriterInterval = null; 
// === 1. 底部导航栏切换逻辑 ===
// === 1. 底部导航栏切换逻辑 ===
function switchTab(tabName, clickedNav) {
    closeImageViewer(); 
    // 隐藏所有页面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 取消所有底部按钮的高亮
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById('page-' + tabName);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 高亮被点击的按钮
    clickedNav.classList.add('active');

    // === 新增：控制骰子按钮样式 ===
    const fateBtn = document.querySelector('.fate-trigger');
    if (fateBtn) {
        if (tabName === 'tavern') {
            // 如果去的是酒馆，恢复原状
            fateBtn.classList.remove('mini');
        } else {
            // 如果去的是其他地方，变成迷你模式
            fateBtn.classList.add('mini');
        }
    }
}


// === 2. 角色对话数据-已经移入data.js ===

// 当前正在对话的角色ID
let currentCharacterId = null;
// 当前说到第几句了
let currentDialogueIndex = 0;

// === 2.5 画廊数据-已经移入data ===


// === 3. 打开角色界面 (点击小立绘触发) ===
function openCharacter(charId) {
    currentCharacterId = charId;
    currentDialogueIndex = 0;

    const character = characterData[charId]; // 获取当前角色的所有数据
    if (!character) return; // 如果角色不存在，则不执行任何操作

    const overlay = document.getElementById('overlay');
    const dialogueText = document.getElementById('dialogue-text');
    const bigCharImg = document.getElementById('big-char-img');

    // (1). 设置背景图 (这行不变)
    bigCharImg.style.backgroundImage = `url('${character.big_img}')`;

    // (2). 读取并设置大立绘的尺寸和位置 (这是新增的！)
    bigCharImg.style.width = character.big_width + 'px';
    bigCharImg.style.height = character.big_height + 'px';
    bigCharImg.style.bottom = character.big_bottom + 'px';


    // 显示第一句对话
    //dialogueText.innerText = character.dialogues[0];
    // 改为调用打字机函数
    typewriterEffect(dialogueText, character.dialogues[0]); 
    // 显示遮罩层
    overlay.classList.remove('hidden');
}


// === 4. 关闭角色界面 (点击空白处触发) ===
function closeCharacter(event) {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hidden');
}

// === 5. 切换下一句对话 (点击气泡触发) ===
function nextDialogue() {
    if (!currentCharacterId) return; // 如果没有选中角色，就什么都不做

 const dialogues = characterData[currentCharacterId].dialogues;    
    // 索引 +1
    currentDialogueIndex++;

    // 如果说完了最后一句，就回到第一句 (轮换)
    if (currentDialogueIndex >= dialogues.length) {
        currentDialogueIndex = 0;
    }

    // 更新文字
    const dialogueText = document.getElementById('dialogue-text');
    //dialogueText.innerText = dialogues[currentDialogueIndex];
    // 改为调用打字机函数
    typewriterEffect(dialogueText, dialogues[currentDialogueIndex]); 
}
// === 6. 背景滚动逻辑 ===
let currentBgPosition = 0; // 记录当前背景图的位置
const scrollStep = 150; // 每次滚动的距离 (px)

function scrollBackground(direction) {
    const scrollContent = document.getElementById('scroll-content');
    if (!scrollContent) return;

    const container = scrollContent.parentElement; // 容器是 .tavern-bg

// 可滚动范围 = 内容总宽度 - 容器宽度
    const maxScroll = scrollContent.scrollWidth - container.clientWidth;

    if (maxScroll <= 0) return; // 如果图片没超出容器，就不滚动

    if (direction === 'left') {
        currentBgPosition += scrollStep;
        // 限制左边界，不能滚出右边太多
        if (currentBgPosition > 0) {
            currentBgPosition = 0;
        }
    } else if (direction === 'right') {
        currentBgPosition -= scrollStep;
        // 限制右边界，不能滚出左边太多
        if (currentBgPosition < -maxScroll) {
            currentBgPosition = -maxScroll;
        }
    }

    // 使用 transform 来移动图片，性能更好
    scrollContent.style.transform = `translateX(${currentBgPosition}px)`;

}
// === 7. 打字机效果函数 ===
function typewriterEffect(element, text) {
    // 如果上一个动画还在进行，立刻清除
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
    }

    let i = 0;
    element.innerHTML = ''; // 清空文字
    element.style.visibility = 'visible'; // 确保元素可见

    typewriterInterval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typewriterInterval); // 动画结束，清除计时器
            typewriterInterval = null;
        }
    }, 80); // 每个字出现的间隔时间 (毫秒)
}
// === 8. 游戏加载逻辑 ===
function loadGame(gameName) {
    const gameFrame = document.getElementById('game-frame');
    if (gameFrame) {
        gameFrame.src = `games/${gameName}/index.html`;
    }
}
// === 9. 画廊功能逻辑 ===

// 动态生成画廊缩略图
function initGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.innerHTML = ''; // 清空现有内容

    galleryData.forEach(art => {
        const thumbElement = document.createElement('div');
        thumbElement.className = 'gallery-thumbnail';
        thumbElement.setAttribute('data-id', art.id); // 存储ID用于搜索
        thumbElement.innerHTML = `<img src="${art.thumb_src}" alt="${art.name}">`;
        thumbElement.onclick = () => openImageViewer(art.id);
        grid.appendChild(thumbElement);
    });
}

// 打开图片查看器
function openImageViewer(artId) {
    const art = galleryData.find(item => item.id === artId);
    if (!art) return;

    const viewer = document.getElementById('image-viewer');
    document.getElementById('viewer-image').src = art.full_src;
    document.getElementById('viewer-name').innerText = art.name;
    document.getElementById('viewer-author').innerText = art.author;
    // 设置作者点击事件
    document.getElementById('viewer-author').onclick = () => searchByTerm(art.author);
    const platformSpan = document.getElementById('viewer-platform');
    const dateSpan = document.getElementById('viewer-date');
    platformSpan.innerHTML = `<i class="fas fa-globe"></i> ${art.platform}`;
    dateSpan.innerHTML = `<i class="far fa-calendar-alt"></i> ${art.date}`;

    const tagsContainer = document.getElementById('viewer-tags');
    tagsContainer.innerHTML = ''; // 清空旧标签
    art.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.innerText = `#${tag}`;
        tagElement.onclick = () => searchByTerm(tag);
        tagsContainer.appendChild(tagElement);
    });

    viewer.classList.remove('hidden');
}

// 关闭图片查看器
function closeImageViewer() {
    document.getElementById('image-viewer').classList.add('hidden');
}

// 根据关键词过滤画廊
function filterGallery() {
    const searchTerm = document.getElementById('gallery-search').value.toLowerCase().trim();
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');

    thumbnails.forEach(thumb => {
        const artId = thumb.getAttribute('data-id');
        const art = galleryData.find(item => item.id === artId);
        if (!art) return;

        // 检查名称、标签、作者是否匹配
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

// 点击标签或作者进行搜索
function searchByTerm(term) {
    // 切换到画廊页面
    const galleryNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => item.textContent.includes('画廊'));
    if (galleryNavItem) {
        switchTab('gallery', galleryNavItem);
    }
    
    const searchInput = document.getElementById('gallery-search');
    searchInput.value = term; // 填入搜索词
    filterGallery(); // 执行搜索
    closeImageViewer(); // 关闭查看器
}


// === 页面加载后执行的初始化代码 ===

// 监听搜索框的输入事件
const searchInput = document.getElementById('gallery-search');
if (searchInput) {
    searchInput.addEventListener('input', filterGallery);
}

// 初始化画廊
initGallery();

// === 音乐播放器逻辑 ===

let currentTrackIndex = 0;
let isPlaying = false;
const audioPlayer = document.getElementById('bgm-player');
const musicDisc = document.getElementById('music-disc');
const musicCover = document.getElementById('music-cover');

// 1. 初始化播放器
function initMusic() {
    if (musicPlaylist.length > 0) {
        // 加载第一首歌，但不自动播放（浏览器策略限制）
        loadTrack(0);
    }
}

// 2. 加载歌曲
function loadTrack(index) {
    if (index >= musicPlaylist.length) index = 0; // 循环列表
    if (index < 0) index = musicPlaylist.length - 1;

    currentTrackIndex = index;
    const track = musicPlaylist[index];

    audioPlayer.src = track.src;
    musicCover.src = track.cover;
    
    // 如果当前是播放状态，切歌后自动播放
    if (isPlaying) {
        audioPlayer.play().catch(e => console.log("播放失败:", e));
    }
}

// 3. 播放/暂停切换
function toggleMusic() {
    if (musicPlaylist.length === 0) return;

    if (isPlaying) {
        audioPlayer.pause();
        musicDisc.classList.add('paused'); // 停止旋转
        isPlaying = false;
    } else {
        audioPlayer.play().then(() => {
            musicDisc.classList.add('rotating'); // 开始旋转
            musicDisc.classList.remove('paused');
            isPlaying = true;
        }).catch(error => {
            console.log("播放被浏览器阻止，请先与页面交互", error);
            alert("请先点击页面任意位置，再尝试播放音乐");
        });
    }
}

// 4. 下一首
function nextTrack() {
    loadTrack(currentTrackIndex + 1);
}

// 5. 监听歌曲结束，自动放下一首
audioPlayer.addEventListener('ended', () => {
    nextTrack();
});

// === 启动初始化 ===
initMusic();

// === 投骰子逻辑 (骰盒版) ===

const diceOverlay = document.getElementById('dice-overlay');
const formulaDisplay = document.getElementById('dice-formula-display');
const totalDisplay = document.getElementById('dice-total-display');

// 存储当前的公式，例如: [{type: 'd', val: 20}, {type: 'm', val: 1}]
let diceFormula = []; 

// 1. 打开/关闭面板
function openDicePanel() {
    diceOverlay.classList.remove('hidden');
    clearFormula(); // 每次打开重置
}
function closeDicePanel() {
    diceOverlay.classList.add('hidden');
}

// 2. 添加骰子 (例如 d20)
function addDice(sides) {
    diceFormula.push({ type: 'dice', val: sides });
    updateDisplay();
}

// 3. 添加修正值 (例如 +1)
function addMod(value) {
    diceFormula.push({ type: 'mod', val: value });
    updateDisplay();
}

// 4. 清空
function clearFormula() {
    diceFormula = [];
    formulaDisplay.innerText = "请选择骰子...";
    totalDisplay.innerText = "";
}

// 5. 更新屏幕显示
function updateDisplay() {
    if (diceFormula.length === 0) {
        formulaDisplay.innerText = "请选择骰子...";
        return;
    }

    // 把数组转换成字符串，例如 "d20 + d6 + 1"
    const text = diceFormula.map(item => {
        if (item.type === 'dice') return `d${item.val}`;
        if (item.type === 'mod') return item.val >= 0 ? `+${item.val}` : `${item.val}`;
    }).join(' + ').replace(/\+ -/g, '- '); // 把 "+ -1" 变成 "- 1"

    formulaDisplay.innerText = text;
    totalDisplay.innerText = ""; // 清空上次的结果
}

// 6. 执行投掷 (Roll All)
function rollAll() {
    if (diceFormula.length === 0) return;

    let total = 0;
    let details = []; // 存储详细过程，例如 ["15", "3", "1"]

    diceFormula.forEach(item => {
        if (item.type === 'dice') {
            const roll = Math.floor(Math.random() * item.val) + 1;
            total += roll;
            // 如果是 d20 或 d100，给大成功/大失败加个标记
            let mark = "";
            if (item.val === 20 && roll === 20) mark = " (大成功!)";
            if (item.val === 20 && roll === 1) mark = " (大失败!)";
            details.push(`<span style="color:#e6a23c">${roll}</span><small>[d${item.val}${mark}]</small>`);
        } else {
            total += item.val;
            details.push(`${item.val}`);
        }
    });

    // 显示结果
    // 格式：15 + 3 + 1 = 19
    const detailStr = details.join(' + ').replace(/\+ -/g, '- ');
    formulaDisplay.innerHTML = detailStr; 
    totalDisplay.innerText = `= ${total}`;
}

// 7. JRRP (今日人品 - 每日固定版)
function rollJrrp() {
    // 1. 获取今天的日期字符串 (例如 "2023-10-27")
    const todayStr = new Date().toLocaleDateString();
    
    // 2. 从浏览器缓存里读取数据
    const storedDate = localStorage.getItem('jrrp_date');
    const storedValue = localStorage.getItem('jrrp_value');

    // 3. 准备变量
    let rpValue;
    let isNewRoll = false;

    // 4. 判断：如果是今天已经投过了
    if (storedDate === todayStr && storedValue) {
        rpValue = parseInt(storedValue); // 用存好的值
        isNewRoll = false;
    } else {
        // 如果是新的一天，或者从来没投过
        rpValue = Math.floor(Math.random() * 100) + 1; // 生成新值
        // 存进去
        localStorage.setItem('jrrp_date', todayStr);
        localStorage.setItem('jrrp_value', rpValue);
        isNewRoll = true;
    }

    // 5. 播放动画并显示结果
    totalDisplay.innerText = "正在感应...";
    formulaDisplay.innerText = "d100 (每日一次)";
    
    setTimeout(() => {
        let comment = "";

        // 评语逻辑
        if (rpValue === 100) comment = "神选之人！(100)";
        else if (rpValue >= 90) comment = "运势绝佳！诸事顺遂。";
        else if (rpValue >= 60) comment = "运气不错哦。";
        else if (rpValue >= 40) comment = "普普通通，平平淡淡才是真。";
        else if (rpValue >= 20) comment = "稍微有点倒霉...";
        else if (rpValue > 1) comment = "诸事不宜，建议在酒馆睡大觉。";
        else comment = "大凶... (1)";

        // 如果是读取的旧值，可以加个小提示
        if (!isNewRoll) {
            comment += " [今日已定]";
        }

        totalDisplay.innerText = rpValue;
        formulaDisplay.innerText = comment;
    }, 600);
}
