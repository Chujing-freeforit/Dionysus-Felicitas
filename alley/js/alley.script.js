// alley/alley.script.js (传送门升级版)

document.addEventListener('DOMContentLoaded', function() {

    const postListContainer = document.querySelector('.bbs-post-list');
    const allTags = document.querySelectorAll('.bbs-tags .tag');

    function renderPosts(postsToRender) {
        postListContainer.innerHTML = '';

        if (postsToRender.length === 0) {
            postListContainer.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">这个分类下还没有帖子...</p>';
            return;
        }

        postsToRender.forEach(function(post) {
            // === 核心改动在这里！===
            // 我们用一个 <a> 标签把整个帖子包裹起来，创建了一个“传送门”
            const postHTML = `
                <a href="post.html?id=${post.id}" class="post-link-wrapper">
                    <div class="bbs-post ${post.type}">
                        <div class="post-header">
                            <span class="badge ${post.badge.type}">${post.badge.text}</span>
                            <span class="post-title">${post.title}</span>
                        </div>
                        <div class="post-preview">
                            ${post.preview}
                        </div>
                        <div class="post-meta">回: ${post.stats.replies} | 阅: ${post.stats.views} | ${post.stats.time}</div>
                    </div>
                </a>
            `;
            postListContainer.innerHTML += postHTML;
        });
    }

    function updatePostView(category) {
        const pinnedPosts = alleyPostsData.filter(post => post.type === 'pinned');
        let normalPosts;
        if (category === 'hot') {
            normalPosts = alleyPostsData.filter(post => post.type === 'normal');
        } else {
            normalPosts = alleyPostsData.filter(post => post.type === 'normal' && post.category === category);
        }
        const finalPostsToShow = [...pinnedPosts, ...normalPosts];
        renderPosts(finalPostsToShow);
    }

    allTags.forEach(function(tag) {
        tag.addEventListener('click', function() {
            allTags.forEach(innerTag => innerTag.classList.remove('active'));
            this.classList.add('active');
            const selectedCategory = this.dataset.category;
            updatePostView(selectedCategory);
        });
    });

    updatePostView('hot');
});
// alley/alley.script.js (分页功能升级版)

document.addEventListener('DOMContentLoaded', function() {

    // === 1. 基础配置与变量 ===
    const postListContainer = document.querySelector('.bbs-post-list');
    const paginationContainer = document.querySelector('.bbs-pagination'); // 获取分页器容器
    const allTags = document.querySelectorAll('.bbs-tags .tag');

    const ITEMS_PER_PAGE = 5; // 配置：每页显示 3 个帖子
    let currentPage = 1;      // 状态：当前是第几页，默认为 1
    let currentAllPosts = []; // 状态：当前分类下所有的帖子数据（未切片的）

    // === 2. 渲染帖子列表 (负责画帖子) ===
    function renderPosts(postsToRender) {
        postListContainer.innerHTML = '';

        if (postsToRender.length === 0) {
            postListContainer.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">这个分类下还没有帖子...</p>';
            return;
        }

        postsToRender.forEach(function(post) {
            const postHTML = `
                <a href="post.html?id=${post.id}" class="post-link-wrapper">
                    <div class="bbs-post ${post.type}">
                        <div class="post-header">
                            <span class="badge ${post.badge.type}">${post.badge.text}</span>
                            <span class="post-title">${post.title}</span>
                        </div>
                        <div class="post-preview">
                            ${post.preview}
                        </div>
                        <div class="post-meta">回: ${post.stats.replies} | 阅: ${post.stats.views} | ${post.stats.time}</div>
                    </div>
                </a>
            `;
            postListContainer.innerHTML += postHTML;
        });
    }

    // === 3. 渲染分页器 (负责画按钮) ===
    function renderPagination() {
        paginationContainer.innerHTML = ''; // 清空旧的分页按钮

        // 计算总页数：总帖子数 除以 每页数量，然后向上取整
        // 比如 4 个帖子 / 3 = 1.33，向上取整就是 2 页
        const totalPages = Math.ceil(currentAllPosts.length / ITEMS_PER_PAGE);

        // 如果只有1页或者没帖子，就不显示分页器了，这样更美观
        if (totalPages <= 1) {
            return; 
        }

        // --- 生成“上一页”按钮 ---
        // 如果当前不是第1页，就显示“上一页”
        if (currentPage > 1) {
            const prevBtn = document.createElement('span');
            prevBtn.className = 'page-num';
            prevBtn.innerText = '< 上页';
            prevBtn.onclick = function() {
                changePage(currentPage - 1);
            };
            paginationContainer.appendChild(prevBtn);
        }

        // --- 生成数字按钮 (1, 2, 3...) ---
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('span');
            pageBtn.className = 'page-num';
            pageBtn.innerText = i;
            
            // 如果这个按钮代表当前页，给它加个高亮样式
            if (i === currentPage) {
                pageBtn.classList.add('current');
            }

            // 点击数字跳转
            pageBtn.onclick = function() {
                changePage(i);
            };

            paginationContainer.appendChild(pageBtn);
        }

        // --- 生成“下一页”按钮 ---
        // 如果当前不是最后一页，就显示“下一页”
        if (currentPage < totalPages) {
            const nextBtn = document.createElement('span');
            nextBtn.className = 'page-num';
            nextBtn.innerText = '下页 >';
            nextBtn.onclick = function() {
                changePage(currentPage + 1);
            };
            paginationContainer.appendChild(nextBtn);
        }
    }

    // === 4. 换页逻辑 (核心控制器) ===
    function changePage(newPage) {
        currentPage = newPage; // 更新当前页码
        
        // 核心算法：计算这一页应该显示数组里的第几个到第几个
        // 第1页: 0 ~ 3
        // 第2页: 3 ~ 6
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // 切片：从总数据里切出这一页需要的数据
        const postsToShow = currentAllPosts.slice(startIndex, endIndex);

        // 重新渲染列表
        renderPosts(postsToShow);
        // 重新渲染分页器 (因为“上一页/下一页”的状态可能变了)
        renderPagination();

        // 体验优化：换页后自动滚回到列表顶部
        window.scrollTo(0, 0);
    }

    // === 5. 数据筛选逻辑 (入口) ===
    function updatePostView(category) {
        // 1. 先筛选出符合条件的所有帖子
        const pinnedPosts = alleyPostsData.filter(post => post.type === 'pinned');
        let normalPosts;
        if (category === 'hot') {
            normalPosts = alleyPostsData.filter(post => post.type === 'normal');
        } else {
            normalPosts = alleyPostsData.filter(post => post.type === 'normal' && post.category === category);
        }
        
        // 2. 把筛选结果存到全局变量里
        currentAllPosts = [...pinnedPosts, ...normalPosts];

        // 3. 重置页码为 1 (每次切换分类，都应该回到第一页)
        currentPage = 1;

        // 4. 调用换页函数来显示第一页
        changePage(1);
    }

    // === 6. 绑定标签点击事件 ===
    allTags.forEach(function(tag) {
        tag.addEventListener('click', function() {
            allTags.forEach(innerTag => innerTag.classList.remove('active'));
            this.classList.add('active');
            const selectedCategory = this.dataset.category;
            updatePostView(selectedCategory);
        });
    });

    // 初始化：默认显示热门分类
    updatePostView('hot');
});
