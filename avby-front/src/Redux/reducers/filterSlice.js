import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paramsForSearch: {},
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setParamsForSearch: (state, action) => {
      state.paramsForSearch = action.payload;
    },
  },
});

export const { setParamsForSearch } = filterSlice.actions;

export default filterSlice.reducer;
