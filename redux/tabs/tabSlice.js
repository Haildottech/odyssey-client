import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {},
  tabs:[]
}

export const counterSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    incrementTab: (state, action) => {
      state.value = action.payload
    },
    setTab: (state, action) => {
      state.tabs = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { incrementTab, setTab } = counterSlice.actions

export default counterSlice.reducer