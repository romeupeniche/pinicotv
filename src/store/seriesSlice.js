import { createSlice } from "@reduxjs/toolkit";

const initialSeriesState = {
  series: {},
  isLoaded: false,
};

const seriesSlice = createSlice({
  name: "account",
  initialState: initialSeriesState,
  reducers: {
    setSeries(state, action) {
      if (action.payload === null) {
        state.series = initialSeriesState.series;
        state.isLoaded = initialSeriesState.isLoaded;
      } else {
        state.series = action.payload;
        state.isLoaded = true;
      }
    },
  },
});

export default seriesSlice.reducer;
export const { setSeries } = seriesSlice.actions;
