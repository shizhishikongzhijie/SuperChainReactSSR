// ES6
import {jwtDecode} from "jwt-decode";// 引入jwt-decode模块 解析token 

// decoded = jwt_decode(token)
// console.log(decoded);
// { name: 'Tom', age: 23, iat: 1584088910, exp: 1584096110 }

const JwtDecoded = (token) => {
    const decoded = jwtDecode(token)
    console.log(decoded);
    return decoded
}
export default JwtDecoded