import { createSlice } from "@reduxjs/toolkit";

const initialAvatarsState = {
  avatars: [],
};

const avatarsSlice = createSlice({
  name: "avatars",
  initialState: initialAvatarsState,
  reducers: {
    setAvatars(state, action) {
      if (action.payload === null) {
        state.avatars = initialAvatarsState.avatars;
      } else {
        state.avatars = action.payload;
      }
    },
  },
});

export default avatarsSlice.reducer;
export const { setAvatars } = avatarsSlice.actions;
