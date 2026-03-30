import { IEntranceTestAPI } from "@lms/core";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Tạo một đối tượng Notification với giá trị mặc định
export interface Iprops {
  status: boolean;
  count: any;
  shouldShowRemind?: boolean;
}

const initialState: Iprops = {
  status: false,
  count: 0,
  shouldShowRemind: undefined,
};
export const getEntranceCount = createAsyncThunk(
  "entranceTestReducer/getEntranceCount",
  async (api: IEntranceTestAPI, thunkAPI) => {
    try {
      const res = await api.getEntranceCount();
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
export const entranceTestSlice = createSlice({
  name: "entranceTestReducer",
  initialState,
  reducers: {
    activeEntrance: (state) => {
      // Active user guide khi action 'active' được gọi
      state.status = true;
    },
    closeShowRemindEntrance: (state) => {
      state.shouldShowRemind = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEntranceCount.pending, (state) => {
      // state.loading = true
    });
    builder.addCase(getEntranceCount.fulfilled, (state, action) => {
      state.count = action.payload.data.count;
      if (action.payload.data.count >= 1) {
        state.shouldShowRemind = true;
      }
    });
    builder.addCase(getEntranceCount.rejected, (state, action) => {
      // state.loading = false
    });
  },
});

export const { activeEntrance, closeShowRemindEntrance } =
  entranceTestSlice.actions;
export const entranceTestReducer = <
  T extends {
    entranceTestReducer: Iprops;
  },
>(
  state: T,
) =>
  state.entranceTestReducer;
export default entranceTestSlice.reducer;
