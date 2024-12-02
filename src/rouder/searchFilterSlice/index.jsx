import { createSlice } from '@reduxjs/toolkit'
export const searchFilterSlice = createSlice({
    name: 'searchFilter',
    initialState: {
        status: '全部',
        segmentedValue: '最多投票',
        isChecked:false
    },
    reducers: {
        // 更新状态
        updateStatus (state, action) {
            state.status = action.payload
        },
        // 更新segmentedValue
        updateSegmentedValue (state, action) {
            state.segmentedValue = action.payload
        },
        // 更新是否过滤可投票
        updateIsChecked (state, action) {
            state.isChecked = action.payload
        }

    }
})

export const { updateStatus,updateSegmentedValue,updateIsChecked} = searchFilterSlice.actions

export default searchFilterSlice.reducer