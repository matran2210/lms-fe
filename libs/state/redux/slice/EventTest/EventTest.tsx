import { IEventTestAPI } from "@lms/core";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Tạo một đối tượng Notification với giá trị mặc định
interface Iprops {
  status: boolean;
  count: any;
  shouldShowRemind?: boolean;
}

const initialState: Iprops = {
  status: false,
  count: 0,
  shouldShowRemind: undefined,
};
export const getEventCount = createAsyncThunk(
  "eventTestReducer/getEventCount",
  async (api: IEventTestAPI, thunkAPI) => {
    try {
      const res = await api.getCount();
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
export const eventTestSlice = createSlice({
  name: "eventTestReducer",
  initialState,
  reducers: {
    activeEvent: (state) => {
      // Active user guide khi action 'active' được gọi
      state.status = true;
    },
    closeShowRemindEvent: (state) => {
      state.shouldShowRemind = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEventCount.pending, (state) => {
      // state.loading = true
    });
    builder.addCase(getEventCount.fulfilled, (state, action) => {
      state.count = action.payload.data.count;
      if (action.payload.data.count >= 1) {
        state.shouldShowRemind = true;
      }
    });
    builder.addCase(getEventCount.rejected, (state, action) => {
      // state.loading = false
    });
  },
});

export const { activeEvent, closeShowRemindEvent } = eventTestSlice.actions;
export const eventTestReducer = <
  T extends {
    eventTestReducer: Iprops;
  },
>(
  state: T,
) => state.eventTestReducer;
export default eventTestSlice.reducer;
