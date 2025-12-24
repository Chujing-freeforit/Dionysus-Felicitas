// js/messages.script.js
// 消息中心逻辑 (v3.0: 数据分离版)

document.addEventListener('DOMContentLoaded', function() {

    const container = document.getElementById('message-list-container');
    const filterTags = document.querySelectorAll('.message-filters .tag');

    // ============================================================
    // 【核心逻辑升级】动态加载任务报告
    // ============================================================
    
    // 定义需要检查的任务ID列表
    const trackedMissions = ['post-006', 'post-007'];

    trackedMissions.forEach(postId => {
        // 1. 检查该任务是否有结局 (GOOD / BAD)
        const outcome = localStorage.getItem(`${postId}-outcome`);
        
        if (outcome && missionReportsData[postId] && missionReportsData[postId][outcome]) {
            
            // 2. 检查这条报告是否已读
            const reportId = `msg-mission-${postId}`;
            const isReportRead = localStorage.getItem(`${reportId}-read`) === 'true';

            // 3. 插入消息 (使用 unshift 插到最前面)
            userMessages.unshift({
                id: reportId,
                type: 'system',
                isRead: isReportRead,
                actor: { userId: 'user-002', username: '管理员' },
                timestamp: '刚刚',
                content: missionReportsData[postId][outcome] // 从 data 文件获取文案
            });
        }
    });

    // ============================================================

    // === 2. 渲染消息列表 ===
    function renderMessages(messagesToRender) {
        container.innerHTML = '';

        if (messagesToRender.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">这里空空如也...</p>';
            return;
        }

        messagesToRender.forEach(msg => {
            let iconHtml = '';
            let contextHtml = '';
            
            switch (msg.type) {
                case 'system': iconHtml = '<i class="fas fa-bullhorn"></i>'; break;
                case 'reply': iconHtml = '<i class="fas fa-comment-dots"></i>'; break;
                case 'mention': iconHtml = '<i class="fas fa-at"></i>'; break;
            }

            if (msg.targetPost) {
                contextHtml = `<div class="message-context">来自帖子: <a href="post.html?id=${msg.targetPost.id}">${msg.targetPost.title}</a></div>`;
            }

            const messageCard = document.createElement('div');
            messageCard.className = `message-card ${msg.type} ${msg.isRead ? '' : 'unread'}`;
            
            messageCard.innerHTML = `
                <div class="message-icon">${iconHtml}</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author">${msg.actor.username}</span>
                        <span class="message-timestamp">${msg.timestamp}</span>
                    </div>
                    <div class="message-body">${msg.content}</div>
                    ${contextHtml}
                </div>
            `;

            // 点击事件：标记已读 + 记忆
            messageCard.addEventListener('click', function() {
                msg.isRead = true;
                this.classList.remove('unread'); 

                // 如果是任务报告，永久记住“已读”
                if (msg.id.startsWith('msg-mission-')) {
                    localStorage.setItem(`${msg.id}-read`, 'true');
                }

                if (msg.targetPost) {
                    window.location.href = `post.html?id=${msg.targetPost.id}`;
                }
            });

            container.appendChild(messageCard);
        });
    }

    // === 3. 筛选逻辑 ===
    function filterAndRender(filterType) {
        let filteredMessages;
        if (filterType === 'all') {
            filteredMessages = userMessages; 
        } else {
            filteredMessages = userMessages.filter(msg => msg.type === filterType);
        }
        renderMessages(filteredMessages);
    }

    // === 4. 绑定筛选点击 ===
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const filterType = this.dataset.filter;
            filterAndRender(filterType);
        });
    });

    // === 5. 初始化 ===
    filterAndRender('all');
});
