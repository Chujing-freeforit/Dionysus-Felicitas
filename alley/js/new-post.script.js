// new-post.script.js

document.addEventListener('DOMContentLoaded', function() {
    
    const publishBtn = document.getElementById('publish-btn');
    const titleInput = document.getElementById('post-title');
    const categoryInput = document.getElementById('post-category');
    const contentInput = document.getElementById('post-content');

    publishBtn.addEventListener('click', function() {
        // 1. 获取用户输入的内容
        const title = titleInput.value.trim(); // trim() 是去掉首尾空格
        const category = categoryInput.value;
        const content = contentInput.value.trim();

        // 2. 简单的验证：如果标题或内容是空的，就不让发
        if (!title || !content) {
            alert('请把标题和内容填写完整哦！');
            return;
        }

        // 3. 模拟发布成功
        // 因为没有后端，我们只能假装发布成功了
        
        // 这里我们可以做一个简单的确认框
        const confirmPost = confirm(`准备发布到【${category}】版块吗？\n\n标题：${title}`);

        if (confirmPost) {
            alert('发布成功！(模拟)\n\n注意：因为没有连接数据库，这个帖子实际上并没有保存。刷新页面后就会消失。');
            
            // 发布成功后，通常会跳转回首页
            window.location.href = 'alley.html';
        }
    });

});
