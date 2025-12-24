// js/messages.data.js

// 这个数组将存放当前用户收到的所有消息
const userMessages = [
    {
        id: 'msg-001',
        type: 'system', // 消息类型：'system' 代表系统通知
        isRead: false,  // isRead: false 代表这是一条未读消息
        actor: {
            userId: 'user-002',
            username: '管理员'
        },
        targetPost: null, 
        timestamp: '2025-12-18', // 消息发出的时间
        content: '欢迎来到隙间巷！<br>在这里，你可以分享秘密，探寻未知。请务必遵守<a href="#">版规</a>，愿你在这里找到属于自己的角落。'
    },
    {id: 'msg-002',
        type: 'system', // 消息类型：'system' 代表系统通知
        isRead: false,  // isRead: false 代表这是一条未读消息
        actor: {
            userId: 'user-002',
            username: '管理员'
        },
        targetPost: null, 
        timestamp: '2025-12-18', // 消息发出的时间
content: `
            <p>调查员 2333，欢迎归队。</p>
            <p>这是 Delta Green 设立的第 404 号情报观测站（代号：隙间巷）。你的公开身份是“灵异爱好者”，请务必维持此伪装。</p>
            <p><strong>行动指南：</strong></p>
            <ul>
                <li><strong>匿名区/求助区：</strong>这里充斥着平民的呓语。请从中筛选出具有“神话特征”的真实异常事件。</li>
                <li><strong>怪谈区：</strong>这是已解密档案的存放处。所有行动报告需经过“文学化处理”后方可上传，以掩盖真相。</li>
                <li><strong>版规：</strong>那是给平民看的。你的眼中应该只有<a href="post.html?id=post-001">《调查员守则》</a>。</li>
            </ul>
            <p style="margin-top:10px; color:#9b91d1;">系统提示：你的 SAN 值监测模块已上线。祝好运。</p>
        `
        },
];
// 2. 任务结算报告库 (新增：将文案从 script 移到这里)
const missionReportsData = {
    // --- 任务 006：八尺大人 ---
    'post-006': {
        'GOOD': `
            <p style="color:#5cb85c;"><strong>【任务结算：八尺大人】</strong></p>
            <p><strong>状态：</strong>完美解决 (S-Rank)</p>
            <p><strong>评估：</strong>调查员成功识别了模因载体（白色宽边帽）并引导受害者进行了物理隔离。未发生人员伤亡。</p>
            <p><strong>备注：</strong>后续收容工作已移交后勤部。</p>
        `,
        'BAD': `
            <p style="color:#d9534f;"><strong>【任务结算：八尺大人】</strong></p>
            <p><strong>状态：</strong>行动失败 (F-Rank)</p>
            <p><strong>评估：</strong>目标（陈静）已被深度侵蚀，确认为失踪。调查员未能及时切断模因源头。</p>
            <p><strong>警告：</strong>该区域危险等级提升。请调查员提交书面检讨。</p>
        `
    },

    // --- 任务 007：镜花水月 ---
    'post-007': {
        'GOOD': `
            <p style="color:#5cb85c;"><strong>【任务结算：镜花水月】</strong></p>
            <p><strong>状态：</strong>收容成功 (A-Rank)</p>
            <p><strong>评估：</strong>镜界锚点（铜镜）已被物理破坏。幸存者（苏婉）成功逃离逆世界，精神状态稳定。</p>
            <p><strong>备注：</strong>现场发现大量纸灰与不明生物组织，已安排焚烧处理。</p>
        `,
        // 这里合并了所有坏结局：强调镜灵被消灭（或封锁），但苏婉没回来
        'BAD': `
            <p style="color:#d9534f;"><strong>【任务结算：镜花水月】</strong></p>
            <p><strong>状态：</strong>惨胜 / 平民伤亡 (C-Rank)</p>
            <p><strong>评估：</strong>目标地点已无生命迹象。监测显示镜界发生坍塌，异常源（镜灵）已被强制抹除。</p>
            <p><strong>伤亡报告：</strong>平民苏婉未能及时撤离，判定为 MIA（失踪/死亡）。档案已封存。</p>
        `
    }
};