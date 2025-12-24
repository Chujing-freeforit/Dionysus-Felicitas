// js/alley.script.js (分页+搜索+分类 融合版)

document.addEventListener('DOMContentLoaded', function() {

    // === 1. 基础配置与变量 ===
    const postListContainer = document.querySelector('.bbs-post-list');
    const paginationContainer = document.querySelector('.bbs-pagination'); 
    const allTags = document.querySelectorAll('.bbs-tags .tag');
    const searchInput = document.getElementById('search-input'); // [新增] 获取搜索框

    const ITEMS_PER_PAGE = 5; // 每页显示 5 个帖子
    let currentPage = 1;      // 当前页码
    
    // [新增] 核心状态管理
    let currentCategory = 'hot'; // 当前选中的分类
    let currentSearchTerm = '';  // 当前输入的搜索词
    let currentAllPosts = [];    // 经过筛选后的所有帖子数据

    // === 2. 渲染帖子列表 (负责画帖子) ===
    function renderPosts(postsToRender) {
        postListContainer.innerHTML = '';

        if (postsToRender.length === 0) {
            postListContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">没有找到相关记录...</p>';
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
        paginationContainer.innerHTML = ''; 

        const totalPages = Math.ceil(currentAllPosts.length / ITEMS_PER_PAGE);

        if (totalPages <= 1) {
            return; 
        }

        // 上一页
        if (currentPage > 1) {
            const prevBtn = document.createElement('span');
            prevBtn.className = 'page-num';
            prevBtn.innerText = '<';
            prevBtn.onclick = function() {
                changePage(currentPage - 1);
            };
            paginationContainer.appendChild(prevBtn);
        }

        // 数字页码
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('span');
            pageBtn.className = 'page-num';
            pageBtn.innerText = i;
            
            if (i === currentPage) {
                pageBtn.classList.add('current');
            }

            pageBtn.onclick = function() {
                changePage(i);
            };

            paginationContainer.appendChild(pageBtn);
        }

        // 下一页
        if (currentPage < totalPages) {
            const nextBtn = document.createElement('span');
            nextBtn.className = 'page-num';
            nextBtn.innerText = '>';
            nextBtn.onclick = function() {
                changePage(currentPage + 1);
            };
            paginationContainer.appendChild(nextBtn);
        }
    }

    // === 4. 换页逻辑 (核心控制器) ===
    function changePage(newPage) {
        currentPage = newPage;
        
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        const postsToShow = currentAllPosts.slice(startIndex, endIndex);

        renderPosts(postsToShow);
        renderPagination();

        window.scrollTo(0, 0);
    }

    // === 5. [核心修改] 综合筛选逻辑 (分类 + 搜索) ===
    // 这个函数替代了之前的 updatePostView，它会同时考虑“分类”和“搜索词”
        // === 5. [核心修改] 综合筛选逻辑 (分类 + 搜索) ===
    function applyFilters() {
        // A. 第一步：根据分类筛选
        let tempPosts = [];
        
        // 1. 先把置顶帖拿出来
        const pinnedPosts = alleyPostsData.filter(post => post.type === 'pinned');
        
        // 2. 再找 普通帖(normal) 和 互动帖(interactive)
        // 【关键修改点】：这里加了 || post.type === 'interactive'
        let otherPosts;

        if (currentCategory === 'hot') {
            // 热门：显示所有 非置顶 的帖子
            otherPosts = alleyPostsData.filter(post => post.type === 'normal' || post.type === 'interactive');
        } else {
            // 其他分类：显示对应分类下的 普通帖 和 互动帖
            otherPosts = alleyPostsData.filter(post => 
                (post.type === 'normal' || post.type === 'interactive') && 
                post.category === currentCategory
            );
        }

        // 合并：置顶在前，其他在后
        tempPosts = [...pinnedPosts, ...otherPosts];

        // B. 第二步：根据搜索词筛选 (如果有输入的话)
        if (currentSearchTerm.trim() !== '') {
            const term = currentSearchTerm.toLowerCase(); 
            tempPosts = tempPosts.filter(post => {
                return post.title.toLowerCase().includes(term) || 
                       post.preview.toLowerCase().includes(term);
            });
        }

        // C. 更新全局数据并重置页码
        currentAllPosts = tempPosts;
        currentPage = 1; 
        changePage(1);
    }

    // === 6. 事件绑定 ===

    // 标签点击事件
    allTags.forEach(function(tag) {
        tag.addEventListener('click', function() {
            allTags.forEach(innerTag => innerTag.classList.remove('active'));
            this.classList.add('active');
            
            // 更新当前分类状态，然后触发筛选
            currentCategory = this.dataset.category;
            applyFilters(); 
        });
    });

    // [新增] 搜索框输入事件
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            // 更新当前搜索词状态，然后触发筛选
            currentSearchTerm = e.target.value;
            applyFilters(); 
        });
    }

    // 初始化：默认加载
    applyFilters();
});
