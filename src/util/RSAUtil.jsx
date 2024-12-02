// window = this;//在nodejs中，window不存在，所以需要手动添加，在jsencrypt源码中添加
import JSEncrypt from 'jsencrypt';

//生成RSA密钥对
function generateRSAKeyPair() {
    const encrypt = new JSEncrypt();
    const key = encrypt.getKey();
    const privateKey = key.getPrivateKey();
    const publicKey = key.getPublicKey();
    return { publicKey: publicKey, privateKey: privateKey };
}

// 清理公钥并返回清理后的字符串
function sanitizePublicKey(publicKeyStr) {
    const sanitizedPublicKey = publicKeyStr
        .replace(/-----BEGIN PUBLIC KEY-----/g, "")
        .replace(/-----END PUBLIC KEY-----/g, "")
        .replace(/\s+/g, ""); // 移除所有空格和换行符
    return sanitizedPublicKey;
}

// 公钥加密
function RSAEncrypt(text, publicKey) {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(text);
    return encrypted;
}

// 私钥解密
function RSADecrypt(text, privateKey) {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    const decrypted = decrypt.decrypt(text);
    return decrypted;
}

export { generateRSAKeyPair, RSAEncrypt, RSADecrypt,sanitizePublicKey }