const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '_source_gallery');
const targetImageDir = path.join(__dirname, 'images', 'gallery');
const targetDataFile = path.join(__dirname, 'data.js');

console.log('🚀 开始自动化生成画廊数据...');

if (!fs.existsSync(targetImageDir)) {
    fs.mkdirSync(targetImageDir, { recursive: true });
}

// 检查源文件夹是否存在
if (!fs.existsSync(sourceDir)) {
    console.error(`❌ 错误：找不到源文件夹 "${sourceDir}"。请先创建它！`);
    process.exit(1);
}

const artFolders = fs.readdirSync(sourceDir).filter(file => 
    fs.statSync(path.join(sourceDir, file)).isDirectory()
);

const newGalleryData = [];

for (const folderName of artFolders) {
    const artFolderPath = path.join(sourceDir, folderName);
    const filesInFolder = fs.readdirSync(artFolderPath);

    const infoFile = filesInFolder.find(f => f === 'info.json');
    const fullImageFile = filesInFolder.find(f => f.startsWith('full.'));
    const thumbImageFile = filesInFolder.find(f => f.startsWith('thumb.'));

    // 1. 检查文件是否齐全
    if (!infoFile || !fullImageFile || !thumbImageFile) {
        console.warn(`⚠️  跳过：文件夹 "${folderName}" 缺少必要文件 (需要 info.json, full.*, thumb.*)`);
        continue;
    }

    // 2. 尝试解析 JSON (这里加了防崩溃处理)
    let artInfo;
    try {
        const infoContent = fs.readFileSync(path.join(artFolderPath, infoFile), 'utf-8');
        
        // 检查文件是否为空
        if (!infoContent.trim()) {
            throw new Error("文件内容是空的");
        }

        artInfo = JSON.parse(infoContent);
    } catch (error) {
        console.error(`❌ 错误：文件夹 "${folderName}" 里的 info.json 格式不对！`);
        console.error(`   原因：${error.message}`);
        console.error(`   请检查是否漏了逗号、引号，或者文件没保存。`);
        continue; // 跳过这个出错的文件夹，继续处理下一个
    }

    // 3. 复制图片
    const newFullImageName = `${folderName}_full${path.extname(fullImageFile)}`;
    const newThumbImageName = `${folderName}_thumb${path.extname(thumbImageFile)}`;

    fs.copyFileSync(path.join(artFolderPath, fullImageFile), path.join(targetImageDir, newFullImageName));
    fs.copyFileSync(path.join(artFolderPath, thumbImageFile), path.join(targetImageDir, newThumbImageName));

    // 4. 添加数据
    newGalleryData.push({
        id: folderName,
        thumb_src: `images/gallery/${newThumbImageName}`,
        full_src: `images/gallery/${newFullImageName}`,
        name: artInfo.name,
        tags: artInfo.tags,
        author: artInfo.author,
        platform: artInfo.platform || '未知平台', // 如果没写，默认显示未知
        date: artInfo.date || '未知时间'  
    });

    console.log(`✅  成功处理: ${artInfo.name}`);
}

// 读取并更新 data.js
let existingDataContent = '';
if (fs.existsSync(targetDataFile)) {
    existingDataContent = fs.readFileSync(targetDataFile, 'utf-8');
} else {
    // 如果 data.js 不存在，给一个默认头部
    existingDataContent = 'const characterData = {};';
}

const characterDataMatch = existingDataContent.match(/const characterData = \{[\s\S]*?\};/);
const characterDataString = characterDataMatch ? characterDataMatch[0] : 'const characterData = {};';

const galleryDataString = `const galleryData = ${JSON.stringify(newGalleryData, null, 4)};`;
const finalDataContent = `${characterDataString}\n\n// === 画廊数据 (由脚本自动生成) ===\n${galleryDataString}\n`;

fs.writeFileSync(targetDataFile, finalDataContent);

console.log('🎉 任务完成！data.js 文件已成功更新。');
