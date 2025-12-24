// js/interactive.js
// 互动帖子逻辑引擎 (v5.0: 支持中间存档点 Checkpoint + Flag线索系统)

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    // 容错处理：如果没有数据，不报错
    if (typeof alleyPostsData === 'undefined' || typeof interactiveScripts === 'undefined') return;

    const postData = alleyPostsData.find(p => p.id === postId);
    
    if (!postData || postData.type !== 'interactive') return;

    const script = interactiveScripts[postId];
    if (!script) return;

    const repliesContainer = document.getElementById('replies-container');
    repliesContainer.innerHTML = '<h2 class="replies-title">实时通讯记录</h2>';

    // --- Storage Keys ---
    const STORAGE_KEY_HISTORY = `gap_alley_history_${postId}`;
    const STORAGE_KEY_OUTCOME = `${postId}-outcome`;
    const STORAGE_KEY_CHECKPOINT = `gap_alley_checkpoint_${postId}`;
    const STORAGE_KEY_FLAGS = `gap_alley_flags_${postId}`; // 【新增】Flag 存储 Key

    // --- 全局变量：当前 Flag 集合 ---
    let currentFlags = JSON.parse(localStorage.getItem(STORAGE_KEY_FLAGS)) || {};

    // --- 1. 尝试读取存档 ---
    const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY));

    // --- 补充初始化逻辑：处理读档后的恢复 ---
    // (放在最前面，优先检查是否有恢复点)
    const resumeNodeId = localStorage.getItem(`gap_alley_resume_${postId}`);

    if (savedHistory && savedHistory.length > 0) {
        // 恢复历史记录
        savedHistory.forEach(record => {
            renderReplyHTML(record.authorId, record.content, record.timestamp);
        });

        const lastRecord = savedHistory[savedHistory.length - 1];
        
        if (resumeNodeId) {
            // 如果是刚读档回来，立即显示选项
            setTimeout(() => {
                showOptions(resumeNodeId);
                localStorage.removeItem(`gap_alley_resume_${postId}`);
            }, 100);
            renderControlButtons(false);
        } else if (lastRecord.isEnd) {
            renderArchiveMark();
            renderControlButtons(true); 
        } else {
            // 正常刷新页面，非读档，非结局，显示重置
            renderControlButtons(false); 
        }
    } else {
        // 新游戏
        script.initialReplies.forEach(reply => {
            addReplyToPage(reply.authorId, reply.content);
        });
        showOptions('START');
        renderControlButtons(false);
    }

    // --- 核心函数：添加回复 ---
    function addReplyToPage(authorId, content, isEnd = false) {
        const timestamp = '刚刚';
        renderReplyHTML(authorId, content, timestamp);

        let history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || [];
        history.push({ authorId, content, timestamp, isEnd });
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    }

    // --- 核心函数：渲染 HTML ---
    function renderReplyHTML(authorId, content, timestamp) {
        const user = alleyUsers.find(u => u.userId === authorId) || alleyUsers[2];
        
        const replyHTML = `
            <div class="reply-card" style="animation: fadeIn 0.5s;">
                <div class="reply-avatar">
                    <img src="${user.avatarUrl}" alt="${user.username}">
                </div>
                <div class="reply-content">
                    <div class="reply-header">
                        <span class="reply-author">${user.username}</span>
                        <span class="reply-timestamp">${timestamp}</span>
                    </div>
                    <div class="reply-comment">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        const controlsDiv = document.getElementById('interactive-controls');
        if (controlsDiv) {
            controlsDiv.insertAdjacentHTML('beforebegin', replyHTML);
        } else {
            repliesContainer.insertAdjacentHTML('beforeend', replyHTML);
        }
        
        window.scrollTo(0, document.body.scrollHeight);
    }

    function renderArchiveMark() {
        const markHTML = `
            <div style="text-align: center; margin: 30px 0; opacity: 0.6;">
                <span style="border: 1px solid #666; padding: 5px 10px; color: #888; font-size: 12px; letter-spacing: 2px;">
                    CASE ARCHIVED
                </span>
            </div>
        `;
        const controlsDiv = document.getElementById('interactive-controls');
        if (controlsDiv) {
            controlsDiv.insertAdjacentHTML('beforebegin', markHTML);
        } else {
            repliesContainer.insertAdjacentHTML('beforeend', markHTML);
        }
    }

    // --- 核心函数：显示选项 ---
    function showOptions(nodeId) {
        const existingOptions = document.getElementById('interactive-options');
        if (existingOptions) existingOptions.remove();

        const node = script.nodes[nodeId];
        if (!node) return;

        // 检查是否是存档点
        if (node.isCheckpoint) {
            saveCheckpoint(nodeId); 
            showSystemMessage('系统提示：连接已建立稳定锚点 (Checkpoint Saved)');
        }

        // 【新增】检查节点是否设置了 Flag (针对那些没有 reply 直接进入 options 的节点)
        if (node.setFlag) {
            currentFlags[node.setFlag] = true;
            localStorage.setItem(STORAGE_KEY_FLAGS, JSON.stringify(currentFlags));
            console.log(`[System] Flag set: ${node.setFlag}`);
        }

        const optionsDiv = document.createElement('div');
        optionsDiv.id = 'interactive-options';
        optionsDiv.style.cssText = 'margin-top: 20px; background: #111; border-top: 1px solid #333; border-bottom: 1px solid #333;';

        let hasVisibleOptions = false;

        node.options.forEach(option => {
            // 【新增】Flag 检查逻辑
            // 如果选项需要 Flag，且当前没有这个 Flag，则跳过不渲染
            if (option.requiredFlag && !currentFlags[option.requiredFlag]) {
                return; 
            }

            hasVisibleOptions = true;
            const btn = document.createElement('button');
            btn.innerHTML = `<span style="color:#666; margin-right:10px;">></span> ${option.text}`;
            btn.style.cssText = `
                display: block; width: 100%; padding: 18px 20px; background: #1a1a1a;
                color: #ccc; border: none; border-bottom: 1px solid #2a2a2a; cursor: pointer;
                text-align: left; font-family: 'Courier New', monospace; font-size: 15px; transition: all 0.2s;
            `;
            
            btn.onmouseover = () => {
                btn.style.background = '#252525'; btn.style.color = '#fff';
                btn.style.borderLeft = '5px solid #9b91d1'; btn.style.paddingLeft = '15px';
                btn.querySelector('span').style.color = '#9b91d1';
            };
            btn.onmouseout = () => {
                btn.style.background = '#1a1a1a'; btn.style.color = '#ccc';
                btn.style.borderLeft = '0px solid transparent'; btn.style.paddingLeft = '20px';
                btn.querySelector('span').style.color = '#666';
            };

            btn.onclick = function() {
                optionsDiv.remove();
                addReplyToPage('user-001', option.text);
                triggerNextNode(option.nextNode);
            };

            optionsDiv.appendChild(btn);
        });

        // 如果所有选项都被隐藏了（理论上不应该发生，设计时要有保底选项），显示错误
        if (!hasVisibleOptions) {
            showSystemMessage('系统错误：没有可用的分支路径。');
            return;
        }

        const controlsDiv = document.getElementById('interactive-controls');
        if (controlsDiv) {
            repliesContainer.insertBefore(optionsDiv, controlsDiv);
        } else {
            repliesContainer.appendChild(optionsDiv);
        }
        window.scrollTo(0, document.body.scrollHeight);
    }

    function triggerNextNode(nextNodeId) {
        const nextNode = script.nodes[nextNodeId];
        if (!nextNode) return;

        // 【新增】在触发节点时设置 Flag
        if (nextNode.setFlag) {
            currentFlags[nextNode.setFlag] = true;
            localStorage.setItem(STORAGE_KEY_FLAGS, JSON.stringify(currentFlags));
            console.log(`[System] Flag set: ${nextNode.setFlag}`);
        }

        if (nextNode.reply) {
            const loadingDiv = document.createElement('div');
            loadingDiv.innerText = '楼主正在输入...';
            loadingDiv.style.cssText = 'color:#666; font-size:12px; padding:10px; font-style:italic; margin-left: 50px;';
            
            const controlsDiv = document.getElementById('interactive-controls');
            if(controlsDiv) controlsDiv.insertAdjacentElement('beforebegin', loadingDiv);
            else repliesContainer.appendChild(loadingDiv);

            window.scrollTo(0, document.body.scrollHeight);

            setTimeout(() => {
                loadingDiv.remove();
                
                const isEnd = !!nextNode.isEnd;
                addReplyToPage(nextNode.reply.authorId, nextNode.reply.content, isEnd);

                if (isEnd) {
                    renderArchiveMark();
                    renderControlButtons(true); 
                    
                    if (nextNode.systemNote) {
                        showSystemMessage(nextNode.systemNote);
                        const outcome = nextNodeId === 'ENDING_GOOD' ? 'GOOD' : 'BAD';
                        localStorage.setItem(STORAGE_KEY_OUTCOME, outcome);
                    }
                } else if (nextNode.autoNext) {
                    triggerNextNode(nextNode.autoNext);
                } else {
                    showOptions(nextNodeId);
                }
            }, nextNode.reply.delay);
        } else if (nextNode.options) {
            // 如果节点没有 reply 只有 options (纯分支节点)
            showOptions(nextNodeId);
        }
    }

    // --- 保存存档点 (包含 Flags) ---
    function saveCheckpoint(nodeId) {
        const currentHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY));
        const checkpointData = {
            history: currentHistory,
            nodeId: nodeId,
            flags: currentFlags // 【新增】保存当前的线索状态
        };
        localStorage.setItem(STORAGE_KEY_CHECKPOINT, JSON.stringify(checkpointData));
    }

    // --- 读取存档点 (恢复 Flags) ---
    function loadCheckpoint() {
        const checkpointData = JSON.parse(localStorage.getItem(STORAGE_KEY_CHECKPOINT));
        if (!checkpointData) {
            alert('未找到存档点数据。');
            return;
        }

        if (confirm('【读取存档】\n将回溯到最近的稳定锚点。\n当前进度将丢失。\n\n确定吗？')) {
            // 1. 恢复历史记录
            localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(checkpointData.history));
            // 2. 恢复 Flags
            localStorage.setItem(STORAGE_KEY_FLAGS, JSON.stringify(checkpointData.flags || {}));
            // 3. 清除结局状态
            localStorage.removeItem(STORAGE_KEY_OUTCOME);
            // 4. 设置恢复点
            localStorage.setItem(`gap_alley_resume_${postId}`, checkpointData.nodeId);
            
            location.reload();
        }
    }

    function showSystemMessage(text) {
        const noteHTML = `<div style="margin:10px; padding:10px; border:1px dashed #444; color:#9b91d1; font-size:12px; text-align:center; background:rgba(0,0,0,0.2);">${text}</div>`;
        const controlsDiv = document.getElementById('interactive-controls');
        if(controlsDiv) controlsDiv.insertAdjacentHTML('beforebegin', noteHTML);
        else repliesContainer.insertAdjacentHTML('beforeend', noteHTML);
    }

    function renderControlButtons(isEnd) {
        const existing = document.getElementById('interactive-controls');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'interactive-controls';
        container.style.cssText = 'margin-top: 40px; margin-bottom: 20px; border-top: 1px solid #222; padding-top: 10px; display: flex; justify-content: center; gap: 20px;';

        const hasCheckpoint = localStorage.getItem(STORAGE_KEY_CHECKPOINT);

        if (hasCheckpoint && isEnd) {
            const loadBtn = document.createElement('div');
            loadBtn.innerHTML = '<i class="fas fa-history"></i> 读取最近存档 (Load Checkpoint)';
            loadBtn.style.cssText = 'color: #9b91d1; font-size: 12px; cursor: pointer; padding: 10px;';
            loadBtn.onclick = loadCheckpoint;
            container.appendChild(loadBtn);
        }

        const resetBtn = document.createElement('div');
        resetBtn.innerHTML = '<i class="fas fa-undo"></i> 重置时间线 (Reset All)';
        resetBtn.style.cssText = 'color: #555; font-size: 12px; cursor: pointer; padding: 10px;';
        resetBtn.onmouseover = () => resetBtn.style.color = '#d9534f';
        resetBtn.onmouseout = () => resetBtn.style.color = '#555';
        
        resetBtn.onclick = function() {
            if (confirm('【警告】\n重置时间线将清除本次调查的所有记录。\n\n确定要执行吗？')) {
                localStorage.removeItem(STORAGE_KEY_HISTORY);
                localStorage.removeItem(STORAGE_KEY_OUTCOME);
                localStorage.removeItem(STORAGE_KEY_CHECKPOINT);
                localStorage.removeItem(STORAGE_KEY_FLAGS); // 【新增】清除 Flags
                localStorage.removeItem(`gap_alley_resume_${postId}`);
                location.reload();
            }
        };
        container.appendChild(resetBtn);

        repliesContainer.appendChild(container);
    }
});
