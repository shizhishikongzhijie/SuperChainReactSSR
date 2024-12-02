import { createSlice } from '@reduxjs/toolkit'
export const linkSlice = createSlice({
    name: 'link',
    initialState: {
        //识别码
        linkId:'',
        //对称加密秘钥
        linkKey:'',
    },
    reducers: {
        setLinkData: (state, action) => {
            state.linkId = action.payload.linkId
            state.linkKey = action.payload.linkKey
        },
    }
})

export const {setLinkData } = linkSlice.actions

export default linkSlice.reducer