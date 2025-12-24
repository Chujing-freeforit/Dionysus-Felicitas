// alley/post.script.js (用户系统渲染版)

document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const postData = alleyPostsData.find(post => post.id === postId);

    const mainPostContainer = document.getElementById('main-post-content');
    const repliesContainer = document.getElementById('replies-container');

    if (postData) {
        // --- 渲染主楼 ---
        // 1. 根据 authorId 查找作者信息
        const authorInfo = alleyUsers.find(user => user.userId === postData.authorId) || alleyUsers.find(user => user.userId === 'user-default');

        const mainPostHTML = `
            <h1 class="post-detail-title">${postData.title}</h1>
            <div class="post-author-info">
                <a href="profile.html?uid=${authorInfo.userId}">
    <img src="${authorInfo.avatarUrl}" alt="${authorInfo.username}" class="author-avatar">
</a>
                <span class="author-name">${authorInfo.username}</span>
            </div>
            <div class="post-detail-meta">
                <span>发布于: ${postData.stats.time}</span> | 
                <span>阅读: ${postData.stats.views}</span> | 
                <span>回复: ${postData.stats.replies}</span>
            </div>
            <div class="post-detail-body">
                ${postData.content}
            </div>
        `;
        mainPostContainer.innerHTML = mainPostHTML;
        // 如果是互动帖，就到此为止，不要执行下面的渲染回复代码
        // ============================================================
        if (postData.type === 'interactive') {
            return; 
        }
        // ========================
        // --- 渲染回复 ---
        if (postData.replies && postData.replies.length > 0) {
            let repliesHTML = '<h2 class="replies-title">回复列表</h2>';
            
            postData.replies.forEach(reply => {
                // 2. 为每个回复查找作者信息
                const replierInfo = alleyUsers.find(user => user.userId === reply.authorId) || alleyUsers.find(user => user.userId === 'user-default');

                repliesHTML += `
                    <div class="reply-card">
                        <div class="reply-avatar">
                            <a href="profile.html?uid=${replierInfo.userId}">
                                <img src="${replierInfo.avatarUrl}" alt="${replierInfo.username} 的头像">
                            </a>
                        </div>
                        <div class="reply-content">

                            <div class="reply-header">
                                <span class="reply-author">${replierInfo.username}</span>
                                <span class="reply-timestamp">${reply.timestamp}</span>
                            </div>
                            <div class="reply-comment">
                                ${reply.comment}
                            </div>
                        </div>
                    </div>
                `;
            });
            repliesContainer.innerHTML = repliesHTML;
        } else {
            repliesContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px 0;">还没有人回复...</p>';
        }

    } else {
        mainPostContainer.innerHTML = '<h1 style="text-align: center;">帖子未找到或已删除</h1>';
    }
});
