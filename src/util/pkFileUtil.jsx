const nodeXlsx = require('node-xlsx');

function readXlsx(file) {
    try {
        const workbook = nodeXlsx.parse(file);
        let excelContent = workbook[0].data;
        
        let titleList = excelContent[0];
        let contentList = excelContent.slice(1);

        // 查找 "pk", "publicKey", 或 "公钥" 列的索引
        const publicKeyIndex = titleList.findIndex(title => 
            title === 'pk' || title === 'publicKey' || title === '公钥'
        );

        if (publicKeyIndex === -1) {
            console.error('未找到 "pk", "publicKey", 或 "公钥" 列');
            return null;
        }

        // 提取该列的数据
        let publicKeyList = contentList.map(row => row[publicKeyIndex]);

        console.log('Excel文件已成功解析为公钥列表');
        return publicKeyList;
    } catch (error) {
        console.error('解析Excel文件时出错:', error);
        return null;
    }
}

module.exports = { readXlsx };