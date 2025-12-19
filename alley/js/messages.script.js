// js/messages.script.js

document.addEventListener('DOMContentLoaded', function() {

    // === 1. 获取页面上的元素 ===
    const container = document.getElementById('message-list-container');
    const filterTags = document.querySelectorAll('.message-filters .tag');

    // === 2. 渲染消息列表的核心函数 ===
    // 这个函数接收一个消息数组，然后把它们变成 HTML 画在页面上
    function renderMessages(messagesToRender) {
        // 先清空容器，防止重复加载
        container.innerHTML = '';

        if (messagesToRender.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">这里空空如也...</p>';
            return;
        }

        messagesToRender.forEach(msg => {
            // --- A. 根据消息类型，准备不同的图标和上下文信息 ---
            let iconHtml = '';
            let contextHtml = '';
            
            switch (msg.type) {
                case 'system':
                    iconHtml = '<i class="fas fa-bullhorn"></i>'; // 系统通知图标
                    break;
                case 'reply':
                    iconHtml = '<i class="fas fa-comment-dots"></i>'; // 回复图标
                    break;
                case 'mention':
                    iconHtml = '<i class="fas fa-at"></i>'; // @ 图标
                    break;
            }

            // 如果消息关联了帖子，就生成帖子的链接
            if (msg.targetPost) {
                contextHtml = `
                    <div class="message-context">
                        来自帖子: <a href="post.html?id=${msg.targetPost.id}">${msg.targetPost.title}</a>
                    </div>
                `;
            }

            // --- B. 拼接完整的消息卡片 HTML ---
            const messageCard = document.createElement('div');
            // 根据消息类型和是否已读，添加对应的 class
            messageCard.className = `message-card ${msg.type} ${msg.isRead ? '' : 'unread'}`;
            
            messageCard.innerHTML = `
                <div class="message-icon">
                    ${iconHtml}
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author">${msg.actor.username}</span>
                        <span class="message-timestamp">${msg.timestamp}</span>
                    </div>
                    <div class="message-body">
                        ${msg.content}
                    </div>
                    ${contextHtml}
                </div>
            `;

            // --- C. 给卡片添加点击事件 ---
            messageCard.addEventListener('click', function() {
                // 标记为已读
                msg.isRead = true;
                this.classList.remove('unread'); // 'this' 指向被点击的卡片

                // 如果有关联帖子，就跳转
                if (msg.targetPost) {
                    window.location.href = `post.html?id=${msg.targetPost.id}`;
                }
                // (这里可以添加逻辑：如果是系统消息的版规链接，则跳转到版规帖子)
            });

            // --- D. 把生成好的卡片添加到容器里 ---
            container.appendChild(messageCard);
        });
    }

    // === 3. 筛选逻辑 ===
    function filterAndRender(filterType) {
        let filteredMessages;

        if (filterType === 'all') {
            filteredMessages = userMessages; // 显示全部
        } else {
            // 使用 filter 方法筛选出符合条件的消息
            filteredMessages = userMessages.filter(msg => msg.type === filterType);
        }
        
        renderMessages(filteredMessages);
    }

    // === 4. 给顶部的标签按钮绑定点击事件 ===
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 移除所有按钮的 'active' 状态
            filterTags.forEach(t => t.classList.remove('active'));
            // 给当前点击的按钮加上 'active'
            this.classList.add('active');

            const filterType = this.dataset.filter;
            filterAndRender(filterType);
        });
    });

    // === 5. 页面首次加载时，默认显示全部消息 ===
    filterAndRender('all');
});
