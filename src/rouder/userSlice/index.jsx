import { createSlice } from '@reduxjs/toolkit'
import JwtDecoded from '../../util/RSAUtil'
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        publicKey: '',
        privateKey: '',
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQcml2YXRlS2V5IjoiMTExMSIsIlB1YmxpY0tleSI6IjIyMjIiLCJleHAiOjE3MjUxMjYyOTYsImlhdCI6MTcyNTEyNDQ5Nn0.HiSRCdB431HtymvLTcYEaS7WZXgvvJHtWKbK2k5A97s"
    },
    reducers: {
        //解析AuthToken
        setAuthToken: (state, actions) => {
            state.Authorization = actions.payload.token;
            state.publicKey = actions.payload.token.publicKey
            state.privateKey = actions.payload.token.privateKey
        },
        setKeyData: (state, actions) => {
            state.publicKey = actions.payload.publicKey
            state.privateKey = actions.payload.privateKey
        },
        //删除AuthToken与公私钥
        deleteAuthToken: state => {
            state.Authorization = ''
            state.publicKey = ''
            state.privateKey = ''
        }
    }
})

export const { setAuthToken, deleteAuthToken,setKeyData } = userSlice.actions

export default userSlice.reducer