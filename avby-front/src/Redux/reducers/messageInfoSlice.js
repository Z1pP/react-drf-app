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
    messageInfoAction: (state, action) => {
      state.text = action.payload.text
      state.type = action.payload.type
      state.show = true
    },
    hideMessage: (state) => {
      state.show = false
    }
  }
})

export const {messageInfoAction, hideMessage} = messageInfoSlice.actions

export default messageInfoSlice.reducer
