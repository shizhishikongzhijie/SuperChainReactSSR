import { createSlice } from '@reduxjs/toolkit'
export const voteViewSlice = createSlice({
    name: 'voteView',
    initialState: {
        vid:"",
        type:""
    },
    reducers: {
        setVoteView: (state, action) => {
            state.vid = action.payload.vid
            state.type = action.payload.type
        }
    }
})

export const {setVoteView } = voteViewSlice.actions

export default voteViewSlice.reducer