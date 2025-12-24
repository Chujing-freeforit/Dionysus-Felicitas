// js/interactive.data.js
// 互动帖子的剧本数据库

const interactiveScripts = {
    // post-006 (八尺大人)
    'post-006': {
        // 初始状态：当用户第一次点进帖子时，除了主楼，还会显示这些初始回复
        initialReplies: [
            {
                authorId: 'user-003', // 路人甲
                content: '？？？这次我信了，楼主快跑！',
                delay: 0 // 立即显示
            },
            {
                authorId: 'user-003', // 相信者
                content: '是八尺大人的“追随”特性！普通方法没用，要找专业人士！',
                delay: 0
            },
            {
                authorId: 'user-003', // 楼主 (绝望更新)
                content: '更新：她在敲门了。声音很轻，但整个门都在震。我好怕，我感觉门把手在转动……',
                delay: 0
            }
        ],

        // 剧情节点
        nodes: {
            // 节点：START (调查员介入)
            'START': {
                // 这一段是调查员（玩家）面临的选择
                options: [
                    {
                        text: '冷静！告诉我，最初看到她之前，你接触过什么特别的东西？',
                        nextNode: 'NODE_1_A' // 选了这个跳到 1_A
                    },
                    {
                        text: '快找东西把门堵上！别让她进来！',
                        nextNode: 'NODE_1_B' // 选了这个跳到 1_B
                    }
                ]
            },

            // 节点：1_A (询问线索 - 正确路线)
            'NODE_1_A': {
                // 楼主的回复
                reply: {
                    authorId: 'user-004', // 楼主
                    content: '没有！我只是个普通上班族…等等，一个月前，我在旧货市场买了一个白色的复古宽边帽，觉得很好看…',
                    delay: 2000 // 模拟打字延迟 2秒
                },
                // 接下来玩家的选择
                options: [
                    {
                        text: '帽子现在在哪？',
                        nextNode: 'NODE_2_A'
                    },
                    {
                        text: '那个帽子有问题，快把它扔了！',
                        nextNode: 'NODE_2_B' // 太急躁，可能导致坏结果
                    }
                ]
            },

            // 节点：1_B (物理防御 - 错误路线)
            'NODE_1_B': {
                reply: {
                    authorId: 'user-004',
                    content: '我推了柜子过去……没用！她好像没有实体，我看到白色的雾气穿过柜子进来了！她在哼歌，声音好近……就在我耳边。',
                    delay: 2500
                },
                options: [
                    {
                        text: '别管门了！想想你身边有没有什么东西是最近才出现的？',
                        nextNode: 'NODE_1_A' // 强制拉回线索线，但San值可能已经扣了
                    }
                ]
            },

            // 节点：2_A (追问帽子)
            'NODE_2_A': {
                reply: {
                    authorId: 'user-004',
                    content: '我一直戴着…它很暖和。其实…戴上它我就觉得很安心，那个女人的歌声也变得好听了…我想开门去见她…',
                    delay: 3000
                },
                options: [
                    {
                        text: '不要听它的声音！把它摘下来，放进冰箱或者铁盒子里！隔绝它！',
                        nextNode: 'ENDING_GOOD'
                    },
                    {
                        text: '你被控制了！快醒醒！',
                        nextNode: 'ENDING_BAD'
                    }
                ]
            },

            // 节点：2_B (直接让扔 - 失败)
            'NODE_2_B': {
                reply: {
                    authorId: 'user-004',
                    content: '扔了？为什么要扔掉？它多美啊……波波波……（一串诡异的拟声词）',
                    delay: 2000
                },
                // 这里没有选项了，直接进入结局
                autoNext: 'ENDING_BAD' 
            },

            // --- 结局 ---

            'ENDING_GOOD': {
                reply: {
                    authorId: 'user-004',
                    content: '我……我把它塞进冰箱了。歌声停了。门外的影子也不见了。天哪，我刚才在想什么？谢谢你，你是谁？',
                    delay: 3000
                },
                isEnd: true, // 标记为结束
                systemNote: '【任务完成】幸存者确认生还。事件已归档。此帖子将被设为隐藏。'
            },

            'ENDING_BAD': {
                reply: {
                    authorId: 'user-004',
                    content: '波波波……波波波……门开了。她好高啊。',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            }
        }
    },

    //镜花水月 (post-007) 
    'post-007': {
        // 初始状态
        initialReplies: [
            {
                authorId: 'user-003', // 真相探索者
                content: '这是最危险的“镜界置换”！楼主立刻远离所有反光物！',
                delay: 0
            },
            {
                authorId: 'user-005', // 苏婉 (新用户ID，稍后注册)
                content: '手机屏幕…她也在里面…看着我…我感觉我的嘴角在不受控制地往上扬…',
                delay: 0
            }
        ],

        nodes: {
            // === 节点：START ===
            'START': {
                options: [
                    {
                        text: '别看手机屏幕！把亮度调到最低！快离开那个房间！',
                        nextNode: 'NODE_1_LEAVE'
                    },
                    {
                        text: '冷静点。家里只有你一个人吗？',
                        nextNode: 'NODE_1_ALONE'
                    }
                ]
            },

            // === 分支 1：离开房间 ===
            'NODE_1_LEAVE': {
                reply: {
                    authorId: 'user-005',
                    content: '我…我躲到客厅了。没开灯，但我能感觉到…电视机屏幕、窗户玻璃…所有反光的地方都有视线。我好冷。',
                    delay: 2000
                },
                options: [
                    {
                        text: '找块布或者衣服，把那些反光的地方都盖上！别和它们对视！',
                        nextNode: 'NODE_2_COVER'
                    },
                    {
                        text: '仔细看看，它们真的在动吗？还是你的幻觉？',
                        nextNode: 'BAD_END_PEEK' // 作死选项
                    }
                ]
            },

            // === 分支 2：询问独居 (引出奶奶线索) ===
            'NODE_1_ALONE': {
                reply: {
                    authorId: 'user-005',
                    content: '只有我。奶奶上个月…走了。这老宅子空荡荡的，只有我和她的照片。',
                    delay: 2500
                },
                options: [
                    {
                        text: '奶奶走得安详吗？这很重要。',
                        nextNode: 'NODE_INFO_GRANDMA'
                    },
                    {
                        text: '先别管这个，保护自己要紧。去客厅，那里宽敞点。',
                        nextNode: 'NODE_1_LEAVE'
                    }
                ]
            },

            // === 线索节点：奶奶与梳子 ===
            'NODE_INFO_GRANDMA': {
                reply: {
                    authorId: 'user-005',
                    content: '大家都说是病逝。但我记得…那天她在哼戏，对着那面镜子梳头。后来人就不见了，地上只剩下那把老桃木梳。我现在…手里正攥着这把梳子，它好烫。',
                    delay: 3000
                },
                 setFlag: 'has_comb', 
                options: [
                    {
                        text: '她在哼什么戏？你还记得吗？',
                        nextNode: 'NODE_INFO_OPERA'
                    },
                    {
                        text: '那面镜子还在卧室吗？',
                        nextNode: 'NODE_INFO_MIRROR'
                    }
                ]
            },

            // === 线索节点：戏曲 (焚香记) ===
            'NODE_INFO_OPERA': {
                reply: {
                    authorId: 'user-005',
                    content: '是《焚香记》里的…“阳关一曲断肠声”。她平时不唱这个的，那天声音特别尖，像是…像是有人掐着嗓子在唱。',
                    delay: 3000
                },
                // 标记：获得了戏词线索
                setFlag: 'has_opera',
                options: [
                    {
                        text: '听起来不太对劲。你现在感觉怎么样？有没有哪里不舒服？',
                        nextNode: 'NODE_2_SENSATION'
                    }
                ]
            },

            // === 线索节点：镜子 ===
            'NODE_INFO_MIRROR': {
                reply: {
                    authorId: 'user-005',
                    content: '就在卧室。那是她的嫁妆。我现在觉得…镜子背面好像有东西在跳动，像心脏一样。咚…咚…听得我头疼。',
                    delay: 2500
                },
               
                options: [
                    {
                        text: '千万别碰镜子背面！快去客厅！',
                        nextNode: 'NODE_2_SENSATION'
                    },
                    {
                        text: '去看看背面有什么？也许能关掉它？',
                        nextNode: 'BAD_END_TOUCH' // 作死选项
                    }
                ]
            },

            // === 节点：遮挡反光物 ===
            'NODE_2_COVER': {
                reply: {
                    authorId: 'user-005',
                    content: '我盖住了电视…但是窗户…窗户外面好像有人脸贴在玻璃上！不是外面的人，是玻璃里面的人！她在往外挤！',
                    delay: 2500
                },
                options: [
                    {
                        text: '别看！背对着窗户！你手里有防身的东西吗？',
                        nextNode: 'NODE_2_SENSATION'
                    }
                ]
            },

            // === 节点：身体异样 (汇聚点) ===
            'NODE_2_SENSATION': {
                reply: {
                    authorId: 'user-005',
                    content: '我感觉半个身子都麻了…好冷。客厅的穿衣镜里，那个“我”在招手。她笑得好开心…她手里拿着…奶奶的梳子？',
                    delay: 3000
                },
                options: [
                    {
                        text: '别信！那是幻觉！摸摸你自己的口袋，梳子在哪？',
                        nextNode: 'NODE_3_COMB_CHECK'
                    },
                    {
                        text: '她需要你拿走那把梳子？',
                        nextNode: 'BAD_END_LURE' // 作死选项
                    }
                ]
            },

            // === 节点：确认真假 ===
            'NODE_3_COMB_CHECK': {
                reply: {
                    authorId: 'user-005',
                    content: '我摸到了…梳子就在我口袋里！啊啊啊啊啊啊啊！',
                    delay: 2500
                },
                options: [
                    {
                        text: '快跑！冲出大门！离开这栋房子！',
                        nextNode: 'NODE_CHECKPOINT_PRE'
                    }
                ]
            },

            // === 剧情杀前奏 ===
            'NODE_CHECKPOINT_PRE': {
                reply: {
                    authorId: 'user-005',
                    content: '......',
                    delay: 2000
                },
                autoNext: 'NODE_CHECKPOINT'
            },

            // === 存档点 (剧情杀) ===
            'NODE_CHECKPOINT': {
                reply: {
                    authorId: 'user-005',
                    content: '（一阵刺耳的电流声，随后是重物落地的声音）',
                    delay: 1000
                },
                isCheckpoint: true, // 【关键】标记为存档点
                systemNote: '【系统警告】信号源丢失。正在尝试重新定位... 定位成功。',
                autoNext: 'PART_2_START' 
            },
            // ==========================================
            // === 下半部（1）：真假对峙 (The Imitation Game) ===
            // ==========================================

            // --- 阶段一：重连与定性 ---
            'PART_2_START': {
                reply: {
                    authorId: 'user-005',
                    content: '（喘息声）...喂？还在吗？刚才吓死我了，所有的玻璃突然都碎了，发出好大的声音。手机摔地上了，屏幕裂了一大块。现在...好像没事了？怪声也没有了...',
                    delay: 3000
                },
                autoNext: 'PART_2_ROUND_1_TRUE'
            },

            'PART_2_ROUND_1_TRUE': {
                reply: {
                    authorId: 'user-005',
                    content: '...好黑...这里是...戏台？为什么...字都是反的...谁把灯关了...奶奶？是你吗？',
                    delay: 1500
                },
                options: [
                    {
                        text: '没事就好，怪声都消失了是吗？那看样子安全了。',
                        nextNode: 'BAD_END_DECEIVED_1'
                    },
                    {
                        text: '怎么会有两个回复？',
                        nextNode: 'PART_2_ROUND_2_PRE'
                    },
                    
                ]
            },

            // --- 阶段二：问题1 ---
            'PART_2_ROUND_2_PRE': {
                reply: {
                    authorId: 'user-005',
                    content: '...奶奶...你的脸怎么了...为什么没有五官...别过来...手里拿的是什么...针线？',
                    delay: 3000
                },
                autoNext: 'PART_2_ROUND_2_FAKE'
            },

            'PART_2_ROUND_2_FAKE': {
                reply: {
                    authorId: 'user-005',
                    content: '啊啊啊啊！它还没走！你，你为什么用着我的账号！都市传闻是真的...它在模仿我！不，不要相信它！',
                    delay: 1000
                },
                autoNext: 'PART_2_ROUND_2_FAKE1'
            },

                'PART_2_ROUND_2_FAKE1': {
                reply: {
                    authorId: 'user-005',
                    content: '不，不要相信它！我，我才是真的！',
                    delay: 1000
                },           
               options: [
                    {
                        text: '（我有线索）既然你是真的，那你告诉我，奶奶去世那天，手里拿的是什么？',
                        nextNode: 'PART_2_ROUND_3_TEST_ITEM',
                        requiredFlag: 'has_comb' // <--- 【新增】只有获得梳子线索才显示
                    },
                    {
                        text: '既然你是真的，那你告诉我，你是谁？',
                        nextNode: 'PART_2_ROUND_3_TEST_id',
                    },
                    
                ]
            },

            // --- 阶段三：决胜局 (线索分支) ---

            // 分支 A：测试物品 (梳子) - 假苏回避，真苏命中
            'PART_2_ROUND_3_TEST_ITEM': {
                reply: {
                    authorId: 'user-005',
                    content: '那天...那天太乱了，我光记得奶奶的手好冷...呜...救救我，奶奶，我不想死...',
                    delay: 3000
                },
                autoNext: 'PART_2_ROUND_3_TRUE_ITEM'
            },
            'PART_2_ROUND_3_TRUE_ITEM': {
                reply: {
                    authorId: 'user-005',
                    content: '...梳子...桃木梳...在我手里...好烫...它在发光...奶奶怕这个...',
                    delay: 1000
                },
                options: [
                    {
                        text: '我相信第二个。',
                        nextNode: 'PART_2_PHASE_2_START'
                    },
                    {
                        text: '我相信第一个。',
                        nextNode: 'BAD_END_DECEIVED_3'
                    }
                ]
            },

            'PART_2_ROUND_3_TEST_id': {
                reply: {
                    authorId: 'user-005',
                    content: '我是苏婉！25岁，市剧团的青衣演员，家住镜省花市梨园街17号，救救我！我受不了！',
                    delay: 3000
                },
                autoNext: 'PART_2_ROUND_3_TRUE_id'
            },
            'PART_2_ROUND_3_TRUE_id': {
                reply: {
                    authorId: 'user-005',
                    content: '我才是苏婉！我...你...你这个假冒货！',
                    delay: 1000
                },
                options: [
                    {
                        text: '我相信第二个。',
                        nextNode: 'PART_2_ROUND_3_START'
                    },
                    {
                        text: '我相信第一个。',
                        nextNode: 'BAD_END_DECEIVED_3'
                    }
                ]
            },

            // 部分2 测试戏曲 (焚香记)第二问
            'PART_2_ROUND_3_START':{
                reply: {
                    authorId: 'user-005',
                    content: '......救救我。',
                    delay: 3000
                },
                
                options: [
                    {
                    text: '（我有线索）既然你是真的，那你告诉我，奶奶去世之前一直在唱什么？',
                        nextNode: 'PART_2_ROUND_3_TEST_OPERA',
                        requiredFlag: 'has_opera' // <--- 【新增】只有获得戏词线索才显示
                    },
                    {
                        text: '既然你是真的，那你告诉我，你最重要的东西是什么？',
                        nextNode: 'PART_2_ROUND_3_TEST_impo',
                    },
                    
                ]
            },

            'PART_2_ROUND_3_TEST_OPERA': {
                reply: {
                    authorId: 'user-005',
                    content: '戏...？阳关一曲...断魂声。',
                    delay: 3000
                },
                autoNext: 'PART_2_ROUND_3_TRUE_OPERA'
            },
            'PART_2_ROUND_3_TRUE_OPERA': {
                reply: {
                    authorId: 'user-005',
                    content: '阳关一曲...断肠声。',
                    delay: 1000
                },
                options: [
                    {
                        text: '我相信第二个',
                        nextNode: 'PART_2_PHASE_2_START'
                    },
                    {
                        text: '我相信第一个',
                        nextNode: 'BAD_END_DECEIVED_3'
                    }
                ]
            },
             'PART_2_ROUND_3_TEST_impo': {
                reply: {
                    authorId: 'user-005',
                    content: '我最重要的东西...我不知道...我在乎的东西太多了。这，这能帮到你吗？',
                    delay: 3000
                },
                autoNext: 'PART_2_ROUND_3_TRUE_impo'
            },
            'PART_2_ROUND_3_TRUE_impo': {
                reply: {
                    authorId: 'user-005',
                    content: '我最重要的东西？当然是我自己。',
                    delay: 1000
                },
                options: [
                    {
                        text: '我相信第一个',
                        nextNode: 'PART_2_PHASE_3_START'
                    },
                    {
                        text: '我相信第二个',
                        nextNode: 'BAD_END_DECEIVED_3'
                    }
                ]
            },

            // 部分2：测试情感 (无线索/高难度) - 第三问
            'PART_2_PHASE_3_START': {
                reply: {
                    authorId: 'user-005',
                    content: '......',
                    delay: 3000
                },
                options: [
                    {
                        text: '最后一个问题，告诉我，你最害怕什么？',
                        nextNode: 'PART_2_ROUND_3_TEST_EMOTION',
                    },
                    
                ],
                
            },
            'PART_2_ROUND_3_TEST_EMOTION': {
                reply: {
                    authorId: 'user-005',
                    content: '我怕死...我怕那个镜子里的东西取代我。我只想好好活着，想明天去剧团排练，想给奶奶上柱香。求求你，别丢下我...',
                    delay: 3000
                },
                autoNext: 'PART_2_ROUND_3_TRUE_EMOTION'
            },
            'PART_2_ROUND_3_TRUE_EMOTION': {
                reply: {
                    authorId: 'user-005',
                    content: '我怕...我怕死！我怕我变成她...我怕我忘记我是谁...镜子里的我...在笑...她在笑...！救救我！',
                    delay: 1000
                },
                options: [
                    {
                        text: '我相信第二个',
                        nextNode: 'PART_2_PHASE_2_START'
                    },
                    {
                        text: '我相信第一个。',
                        nextNode: 'BAD_END_DECEIVED_4' // 陷阱：被完美演技欺骗
                    }
                ]
            },

            

            // ==========================================
            // === 衔接点：下半部（2） ===
            // ==========================================
            'PART_2_PHASE_2_START': {
                reply: {
                    authorId: 'user-005',
                    content: '切...被发现了吗？真没劲。不过，就算你知道了又怎样？她在我的地盘。享受你们最后的时间吧。',
                    delay: 2000
                },
                options: [
                    {
                        text: '苏婉！你还好吗？我们已经派出了专业行动小组前往，撑住！',
                        nextNode: 'PART_2_PHASE_2_2' // 暂时循环
                    }
                ]
            },
                        // ==========================================
            // === 下半部（2）：镜界深处与奶奶 (The Abyss) ===
            // ==========================================

            // --- 场景转换：假苏消失，恐怖降临 ---
            'PART_2_PHASE_2_2': {
                reply: {
                    authorId: 'user-005',
                    content: '...好冷...这里不是我家...地上全是...纸钱的灰烬？天花板上垂下来好多红线...我的手...尸，尸斑！...不，那是墨水...我就要变成纸了吗？',
                    delay: 3000
                },
                autoNext: 'PART_2_GRANDMA_APPEAR'
            },

            // --- 遭遇奶奶 ---
            'PART_2_GRANDMA_APPEAR': {
                reply: {
                    authorId: 'user-005',
                    content: '前面有个影子...穿着寿衣...背对着我...她在用手指梳头...发出“沙沙”的声音...奶奶？是你吗？',
                    delay: 3000
                },
                options: [
                    {
                        text: '别直接过去！仔细看她的手！',
                        nextNode: 'PART_2_GRANDMA_FACE'
                    }
                ]
            },

            'PART_2_GRANDMA_FACE': {
                reply: {
                    authorId: 'user-005',
                    content: '她转过来了...啊！她没有脸！脸上是一张平滑的白纸！她手里拿着针线...针尖上滴着黑色的血...她，她要对我做什么！',
                    delay: 3000
                },
                // === 关键分支：利用线索相认 ===
                options: [
                    {
                        text: '（利用戏词）那大概就是你的奶奶！快唱那句戏词！',
                        nextNode: 'PART_2_SOLVE_OPERA',
                        requiredFlag: 'has_opera' // 【捷径】戏词线索
                    },
                    {
                        text: '（利用梳子）那大概就是你的奶奶！把桃木梳拿出来！递给她！',
                        nextNode: 'PART_2_SOLVE_COMB',
                        requiredFlag: 'has_comb' // 【捷径】梳子线索
                    },
                    {
                        text: '快跑！躲到柱子后面！',
                        nextNode: 'PART_2_HARD_DODGE' // 【困难】物理躲避
                    },
                    {
                        text: '跪下求她！叫她奶奶！',
                        nextNode: 'BAD_END_STITCHED' // 【陷阱】被抓
                    }
                ]
            },

            // --- 捷径 A：戏词唤醒 ---
            'PART_2_SOLVE_OPERA': {
                reply: {
                    authorId: 'user-005',
                    content: '我唱了...“阳关一曲断肠声”...她停住了。针线掉在地上。她虽然没有脸，但我感觉她在哭。她抬起手，指向了戏台后面的一面大铜镜。那是...奶奶。',
                    delay: 3000
                },
                autoNext: 'PART_2_THE_MIRROR'
            },

            // --- 捷径 B：梳子唤醒 ---
            'PART_2_SOLVE_COMB': {
                reply: {
                    authorId: 'user-005',
                    content: '我把梳子递过去...她接住了。那双手变得温暖了。她轻轻摸了摸我的头，像小时候一样。然后她推了我一把，把梳子还给了我...指向戏台后面的大铜镜。那是...奶奶。',
                    delay: 3000
                },
                autoNext: 'PART_2_THE_MIRROR'
            },

            // --- 困难路线：躲避与观察 ---
            'PART_2_HARD_DODGE': {
                reply: {
                    authorId: 'user-005',
                    content: '我滚到了柱子后面...好险，红线差点缠住我的脖子。她还在找我...等等，我看到戏台后面有一面铜镜，那里有光！但是她挡在路中间！',
                    delay: 3000
                },
                options: [
                    {
                        text: '把旁边的纸扎人推倒吸引她注意！',
                        nextNode: 'PART_2_THE_MIRROR' // 成功逃脱
                    },
                    {
                        text: '不要节外生枝！不管她直接冲过去！',
                        nextNode: 'BAD_END_PAPER' // 失败
                    }
                ]
            },

            // --- 终局：镜眼 (The Mirror Eye) ---
            'PART_2_THE_MIRROR': {
                reply: {
                    authorId: 'user-005',
                    content: '我站在铜镜前了...镜子里映出的不是我，是现实世界！我看到我的手机屏幕了！但是...我的手已经完全变成纸了，软绵绵的，根本敲不碎镜子！怎么办！',
                    delay: 3000
                },
                options: [
                    {
                        text: '用那把桃木梳！放手一搏了！',
                        nextNode: 'ENDING_TRUE_ESCAPE'
                    },
                    {
                        text: '用头撞！快！',
                        nextNode: 'BAD_END_TRAPPED' // 失败：力度不够
                    }
                ]
            },

            // ==========================================
            // === 结局 (Endings) ===
            // ==========================================

            // --- BE 1: 缝合 (Stitched) ---
            'BAD_END_STITCHED': {
                reply: {
                    authorId: 'user-005',
                    content: '我跪下了...她抱住了我。好冷。针刺进嘴唇的感觉...好痛...唔...唔...（声音变成了闷响）',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            },

            // --- BE 2: 纸化 (Paper Doll) ---
            'BAD_END_PAPER': {
                reply: {
                    authorId: 'user-005',
                    content: '我冲不出去...红线缠住了我的脚。我的视线变低了...我的身体变扁了...我变成画里的东西了...',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            },

            // --- BE 3: 永困 (Trapped) ---
            'BAD_END_TRAPPED': {
                reply: {
                    authorId: 'user-005',
                    content: '没用...头撞上去一点声音都没有，像撞在棉花上。镜子里的光消失了。奶奶过来了...她捡起了地上的针线...不要...',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            },

            // --- GOOD END: 破镜重圆 (Shattered) ---
            'ENDING_TRUE_ESCAPE': {
                reply: {
                    authorId: 'user-005',
                    content: '梳子...刺进去了！镜面裂开了！啊啊啊啊！（刺耳的玻璃破碎声，伴随着一声凄厉的尖叫）... ... ... 喂？我在客厅。地上的镜子碎了一地。我听见外面有警笛声...手里全是血，梳子似乎也断掉了...但好在我还活着...谢谢你。',
                    delay: 4000
                },
                isEnd: true,
                systemNote: '【任务完成】幸存者确认生还。事件已归档。此帖子将被设为隐藏。'
            },



            // ==========================================
            // === 死亡结局 (Bad Ends) ===
            // ==========================================

            'BAD_END_PEEK': {
                reply: {
                    authorId: 'user-005',
                    content: '我去看一下电视屏幕…天哪，她在里面！她抓住我的眼睛了！我动不了…救命！不！',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            },

            'BAD_END_TOUCH': {
                reply: {
                    authorId: 'user-005',
                    content: '我把手伸到了镜子后面…湿湿的，像内脏一样——啊！！！！它，它是活得！我的手！不，不别过来！',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            },

            'BAD_END_LURE': {
                reply: {
                    authorId: 'user-005',
                    content: '好的…说不定她只是看上去很邪恶呢…我去拿梳子…手好凉。等等——她力气好大！不！别把我拉进去！奶奶救我————',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            },

            'BAD_END_DECEIVED_1': {
                reply: {
                    authorId: 'user-005',
                    content: '呼...谢谢你相信我。那个杂音终于消失了。我现在感觉好多了，真的，前所未有的好。我想去照照镜子，整理一下头发。再见，隙间-2333。',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            },
            'BAD_END_DECEIVED_3': {
                reply: {
                    authorId: 'user-005',
                    content: '你终于开窍了。那种疯疯癫癫的话怎么能信呢？好了，我要去睡觉了。今晚会是个好梦。永远的好梦。',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            },
            'BAD_END_DECEIVED_4': {
                reply: {
                    authorId: 'user-005',
                    content: '谢谢你的同情心。人类的情感真是...容易利用啊。放心，我会替她好好活下去的。用她的名字，住她的房子，替她上供她那可怜的...奶奶。呵呵呵...',
                    delay: 2000
                },
                isEnd: true,
                systemNote: '【任务失败】目标失去联系。'
            },
            
        }
    }}
