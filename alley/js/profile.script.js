// js/profile.script.js

document.addEventListener('DOMContentLoaded', function() {

    // 1. 确定我们要看谁的主页
    // 先尝试从 URL 里获取 userId (比如 profile.html?uid=user-001)
    const urlParams = new URLSearchParams(window.location.search);
    let targetUserId = urlParams.get('uid');

    // 如果 URL 里没有 uid，那就默认显示“我”的信息
    // (这里我们暂时假定“我”就是 user-004 管理员)
    if (!targetUserId) {
        targetUserId = 'user-001'; 
    }

    // 2. 从数据库里找到这个用户
    const user = alleyUsers.find(u => u.userId === targetUserId);

    // 如果找不到用户，就报错
    if (!user) {
        document.querySelector('.profile-card').innerHTML = '<p style="color:red; text-align:center;">查无此人</p>';
        return;
    }

    // 3. 渲染用户信息
    document.getElementById('profile-avatar').src = user.avatarUrl;
    document.getElementById('profile-name').innerText = user.username;
    document.getElementById('profile-id').innerText = `ID: ${user.userId}`;

    // 4. 统计数据：去帖子数据库里数一数他发了多少帖
    // filter 意思是“过滤”，找出所有 authorId 等于这个人的帖子
    const userPosts = alleyPostsData.filter(post => post.authorId === targetUserId);
    
    document.getElementById('stat-post-count').innerText = userPosts.length;
    // 回复数暂时没法精确统计（因为回复在帖子内部），先写死或者随机
    document.getElementById('stat-reply-count').innerText = Math.floor(Math.random() * 100); 

    // 5. 渲染他的帖子列表
    const postListContainer = document.getElementById('user-post-list');
    
    if (userPosts.length === 0) {
        postListContainer.innerHTML = '<p style="text-align:center; color:#666; padding:20px;">这家伙很懒，什么都没发过。</p>';
    } else {
        userPosts.forEach(post => {
            // 这里复用了主页的帖子样式，但简化了一点
            const postHTML = `
                <a href="post.html?id=${post.id}" class="post-link-wrapper">
                    <div class="bbs-post ${post.type}">
                        <div class="post-header">
                            <span class="badge ${post.badge.type}">${post.badge.text}</span>
                            <span class="post-title">${post.title}</span>
                        </div>
                        <div class="post-meta">
                            ${post.stats.time} | 阅: ${post.stats.views}
                        </div>
                    </div>
                </a>
            `;
            postListContainer.innerHTML += postHTML;
        });
    }

});
