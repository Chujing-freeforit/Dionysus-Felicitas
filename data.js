const characterData = {
    'sheep': { 
        dialogues: [
            "这是一个测试语句~",
            "虽然但是没人能够忍住不说一句——",
            "Hello world！",
            "哼哼..."
        ],
        small_img: 'images/sheep-small.png',
        big_img: 'images/sheep-big.png',
        big_bottom: -190,
        big_offset_x: 0 // 可选：微调左右位置
    },
    'chu': { 
        dialogues: [
            "带完你的带你的，带完你的带你的——",
            "——不要急我心理有数现在还在我的控制范围内",
            "鲨鱼来咯！",
            "有没有人一起打卫戍协议",
            "好饿啊！",
            "想不出来啊！"
        ],
        small_img: 'images/chu-small.png',
        big_img: 'images/chu-big.png',
        big_bottom: -200
    },
    'crow': { 
        dialogues: [
            "我是写字台",
            "为什么我的眼中常含泪水？因为我踏马被工作抓走了啊啊啊啊啊！！！",
            "姑娘，你误会我了，刚才我在实验室进行斯特恩-盖拉赫量子叠加态实验来证实原子在磁场中取向量子化，结果我一不小心就摔到真空不均匀磁场上面去了...",
            "我竟然时空传送过来碰巧点进qq群页面，我不知道coc是什么coj是什么跑团并不是我是本意谢谢"
        ],
        small_img: 'images/crow-small.png',
        big_img: 'images/crow-big.png',
        big_bottom: -200
    },
    'marten': { 
        dialogues: [
            "今天吃什么？",
            "这个时间点奶茶会不会影响睡眠...",
            "事已至此先吃饭吧"
        ],
        small_img: 'images/marten-small.png',
        big_img: 'images/marten-big.png',
        big_bottom: -200
    },
    'fox': { 
        dialogues: [
            "蓄力右键盾击，蓄力右键盾击，充能装瓶再来一遍！",
            "蓄力右键盾击蓄力右键盾击，充能！解他妈的！",
            "正在待机中……咕咕嘎嘎！",
            "喝酒会不会毛发变差？不管了来都来了喝一杯先。"
        ],
        small_img: 'images/fox-small.png',
        big_img: 'images/fox-big.png',
        big_bottom: -200
    },
    'feng': { 
        dialogues: [
            "你来找我玩了！太好了！你想玩些什么？",
            "要一起喝点酒吗？"
        ],
        small_img: 'images/feng-small.png', 
        big_img: 'images/feng-big.png',      
        big_bottom: -200      
    },
    'lizard': { 
        dialogues: [
            "weeeeeeeeee",
            "哎呀我的立绘颜色好艳啊",
            "我就像那冬日里的一把…嗯",
            "好玩好玩——"
        ],
        small_img: 'images/lizard-small.png', 
        big_img: 'images/lizard-big.png',      
        big_bottom: -200      
    }
};

/* =========================================
   === 3. 音乐播放列表 (Music Playlist) ===
   ========================================= */
// 请确保你的项目里有 music 文件夹，并且文件名完全一致（不要有中文）
const musicPlaylist = [
    {title: "we wish you a merry christmas",
        src: "music/we-wish-you-a-merry-christmas-452819.mp3",
        cover: "images/cover8.png" 
    },
    {title: "joy to the world",
        src: "music/joy-to-the-world-bells-background-xmas-music-for-video-full-version-423557.mp3",
        cover: "images/cover7.png" 
    },
    {title: "christmas miracle",
        src: "music/christmas-miracle-347490.mp3", 
        cover: "images/cover1.png" 
    },
    {title: "piano ambient",
        src: "music/piano-ambient-349140.mp3",
        cover: "images/cover3.png" 
    },
    {title: "piano ambient backgroundmusic",
        src: "music/piano-ambient-background-music-348915.mp3",
        cover: "images/cover5.png" 
    },
    {title: "piano classical music",
        src: "music/piano-classical-music-348133.mp3",
        cover: "images/cover6.png" 
    },
    {title: "classical guitar",
        src: "music/classical-guitar-by-vivaldi-folia-r-v63-122925.mp3",
        cover: "images/cover3.png" 
    },
    {title: "classical guitar tango",
        src: "music/classical-guitar-tango-by-tarrega-1852-1909-122899.mp3",
        cover: "images/cover3.png" 
    },
    
];


// === 画廊数据 (由脚本自动生成) ===
const galleryData = [
    {
        "id": "01-dionysus_felicitas",
        "thumb_src": "images/gallery/01-dionysus_felicitas_thumb.jpg",
        "full_src": "images/gallery/01-dionysus_felicitas_full.png",
        "name": "Dionysus Felicitas",
        "tags": [
            "酒馆",
            "场景"
        ],
        "author": "-狗-",
        "platform": "米画师",
        "date": "2025-12-12"
    },
    {
        "id": "02-",
        "thumb_src": "images/gallery/02-_thumb.png",
        "full_src": "images/gallery/02-_full.jpg",
        "name": "登山小队",
        "tags": [
            "狂气山脉",
            "角色",
            "七海空蝉",
            "高山夕奈",
            "玛佩尔·奇奥迪"
        ],
        "author": "不妙画稿中",
        "platform": "米画师",
        "date": "2025-12-12"
    },
    {
        "id": "03-",
        "thumb_src": "images/gallery/03-_thumb.png",
        "full_src": "images/gallery/03-_full.png",
        "name": "浪涌小队",
        "tags": [
            "博德之门",
            "场景",
            "阿弗纳斯"
        ],
        "author": "-狗-",
        "platform": "米画师",
        "date": "2025-12-23"
    }
];
