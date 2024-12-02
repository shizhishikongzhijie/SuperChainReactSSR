import { createSlice } from '@reduxjs/toolkit'
export const voteSlice = createSlice({
    name: 'vote',
    initialState: {
        voteId: '',
        creator: '',
        uploaderCount: '',
        title: '',
        privacy: '',
        description: '',
        startDate: '',
        limitDate: '',
        publicKeyList: '',
        ECPointList: '',
        question: [],
        isMultiple: '',
    },
    reducers: {
        setVote: (state, action) => {
            state.voteId = action.payload.voteId;
            state.creator = action.payload.creator;
            state.uploaderCount = action.payload.uploaderCount;
            state.title = action.payload.title;
            state.privacy = action.payload.privacy;
            state.description = action.payload.description;
            state.startDate = action.payload.startDate;
            state.limitDate = action.payload.limitDate;
        },
        changeQuestionAndIsMultiple: (state, action) => {
            state.question = action.payload.question;
            state.isMultiple = action.payload.isMultiple;
        }
    }
})

export const { setVote,changeQuestionAndIsMultiple } = voteSlice.actions

export default voteSlice.reducer