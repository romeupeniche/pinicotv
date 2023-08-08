import { createSlice } from "@reduxjs/toolkit";

const initialAccountState = {
  user: {},
  history: {},
  isLoggedIn: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState: initialAccountState,
  reducers: {
    setUser(state, action) {
      if (action.payload === null) {
        state.user = initialAccountState.user;
        state.isLoggedIn = false;
        state.history = initialAccountState.history;
      } else {
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.history = action.payload.history ?? state.history;
      }
    },
    logoutUser(state) {
      state.user = initialAccountState.user;
      state.isLoggedIn = false;
      state.history = initialAccountState.history;
    },
    updateHistory(state, action) {
      state.history = action.payload;
    },
  },
});

export default accountSlice.reducer;
export const { setUser, logoutUser, updateHistory } = accountSlice.actions;
