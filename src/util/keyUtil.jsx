
//将Object转换为字符串而不是JSON.stringify

const formatPublicKey = (key) => {
    //key = {"Curvname":"P-256","X":84718181579477297237931144295252505459306796410722855355558753055772853486972,"Y":47565821645110186420934251364880491615332264132296001475601660461274979403914}
    return `{"Curvname":"P-256","X":` + BigInt(key.X).toString() + `,"Y":` + key.Y + `}`
}

const formatPrivateKey = (key) => {
    //key = 61775409864875389341656919499363403180444877913740466061835639936152915085874
    //防止采用科学计数法显示大数字，返回数字而不是字符串

    return BigInt(key)
}
function convertBigIntsToString(obj) {
    if (typeof obj === 'number' && !Number.isSafeInteger(obj)) {
        return BigInt(obj).toString();
    } else if (Array.isArray(obj)) {
        return obj.map(item => convertBigIntsToString(item));
    } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = convertBigIntsToString(obj[key]);
            }
        }
        return newObj;
    }
    return obj;
}

// 转换数据

const formatKey = (key) => {
    key.publicKey = JSON.parse(key.publicKey)
    const convertedData = convertBigIntsToString(key);

    // 手动构建 JSON 字符串
    const jsonString = JSON.stringify(convertedData, (key, value) => {
        if (typeof value === 'bigint') {
            return value.toString();
        }
        return value;
    }, 2);

    console.log(jsonString);
    return jsonString;
}
export { formatPublicKey, formatPrivateKey, formatKey }