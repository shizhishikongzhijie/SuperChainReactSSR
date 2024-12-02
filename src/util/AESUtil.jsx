import CryptoJS from 'crypto-js';


function validateKey(key) {
    const keyBytes = CryptoJS.enc.Base64.parse(key);
    const keyLength = keyBytes.sigBytes;
    if (keyLength !== 32) {
        throw new Error('Invalid key length. Key must be 32 bytes long.');
    }
    console.log(keyBytes)
    return keyBytes;
}
/**
 * 加密
 * @param {string} message - 需要加密的消息
 * @param {string} key - 加密密钥（Base64 编码）
 */
function AESEncrypt(message, key) {
    const keyBytes = validateKey(key);
    const encrypted = CryptoJS.AES.encrypt(message, keyBytes, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    console.log('Encrypted:', encrypted.toString());
    return encrypted.toString();
}
/**
 * 解密
 * @param {string} encryptedMessage - 加密后的消息
 * @param {string} key - 解密密钥（Base64 编码）
 */
function AESDecrypt(encryptedMessage, key) {
    try {
        const wordArrayKey = validateKey(key);
        const decrypted = CryptoJS.AES.decrypt(encryptedMessage, wordArrayKey,{
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
        // return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

export { AESEncrypt, AESDecrypt };