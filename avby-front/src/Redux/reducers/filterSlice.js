import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paramsForSearh: {},
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setParamsForSearch: (state, action) => {
      state.params = action.payload;
    },
  },
});

export const { setParamsForSearch } = filterSlice.actions;

export default filterSlice.reducer;
