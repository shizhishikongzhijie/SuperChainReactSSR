import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { deleteAuthToken, setAuthToken } from '../../rouder/userSlice'
import { get } from '../../util/request'
import { AESDecrypt, AESEncrypt } from '../../util/AESUtil'


const LoginOut = () => {
    const dispatch = useDispatch()
    dispatch(deleteAuthToken())
    return <>退出成功</>
}
const Login = (publicKey, privateKey) => {
    const dispatch = useDispatch()
    const key = JSON.parse(localStorage.getItem('link')).linkKey
    console.log(publicKey, privateKey);
    get('http://localhost:8080/login', { publicKey: AESEncrypt(publicKey, key), privateKey: AESEncrypt(privateKey, key) }).then(response => {
        console.log('Success:', response.data);
        dispatch(setAuthToken(response.data))
    }).catch(error => {
        console.error('Error:', error);
    });
}

export { Login, LoginOut }