// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   entities,
//   status
// }

// const todosSlice = createSlice({
//   name: 'todos',
//   initialState,
//   reducers: {
//     todoAdded(state, action) {
//       // ✅ “突变”（mutate）代码在 createSlice 中是可以的！
//       state.entities.push(action.payload)
//     },
//     todoToggled(state, action) {
//       const todo = state.entities.find(todo => todo.id === action.payload)
//       todo.completed = !todo.completed
//     },
//     todosLoading(state, action) {
//       return {
//         ...state,
//         status: 'loading'
//       }
//     }
//   }
// })

// export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions

// export default todosSlice.reducer

import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../rouder/counterSlice'
import userReducer from '../rouder/userSlice'
import voteReducer from '../rouder/voteSlice'
import searchFilterReducer from '../rouder/searchFilterSlice'
import linkReducer from '../rouder/linkSlice'
import voteViewSlice from '../rouder/voteViewSlice'
export default configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        vote: voteReducer,
        searchFilter:searchFilterReducer,
        link: linkReducer,
        voteView: voteViewSlice
    }
})