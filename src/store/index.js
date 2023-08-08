import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./accountSlice";
import seriesSlice from "./seriesSlice";
import avatarsSlice from "./avatarsSlice";

const store = configureStore({
  reducer: {
    account: accountSlice,
    series: seriesSlice,
    avatars: avatarsSlice,
  },
});

export default store;
