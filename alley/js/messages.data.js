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
    {
        id: 'msg-002',
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
