import {get} from './request'

/**
 * @method 获取客户端IP地址
 * @param {string} req 传入请求HttpRequest
 * 客户请求的IP地址存在于request对象当中
 * express框架可以直接通过 req.ip 获取
 */
function getClientIp(req) {
	return req.headers['x-forwarded-for'] ||
	req.ip ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress ||
	'';
}

// 上述代码是直接获取的IPV4地址，如果获取到的是IPV6，则通过字符串的截取来转换为IPV4地址。
function ipv6ToV4(ip) {
	if(ip.split(',').length>0){
		ip = ip.split(',')[0]
	}
	ip = ip.substr(ip.lastIndexOf(':')+1,ip.length);
	return ip
}

async function getLocationFromIp(ip){
    return await get(`https://webapi-pc.meitu.com/common/ip_location?ip=` + ip)
}
export {getClientIp,ipv6ToV4,getLocationFromIp}
