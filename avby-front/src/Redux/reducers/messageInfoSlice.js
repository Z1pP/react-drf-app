import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  type: "",
  show : false
};

export const messageInfoSlice = createSlice({
  name: "messageInfo",
  initialState,
  reducers: {
    showMessageInfo: (state, action) => {
      state.text = action.payload.text
      state.type = action.payload.type
      state.show = true
    },
    hideMessageInfo: (state) => {
      state.text = ""
      state.type = ""
      state.show = false
    }
  }
})

export const { showMessageInfo, hideMessageInfo} = messageInfoSlice.actions

export default messageInfoSlice.reducer
