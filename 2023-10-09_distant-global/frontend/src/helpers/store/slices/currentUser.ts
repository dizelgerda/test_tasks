import { TUser } from "@helpers/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: null as TUser | null,
  reducers: {
    setCurrentUser(_state, action: PayloadAction<TUser>) {
      return action.payload;
    },
    removeCurrentUser() {
      return null;
    },
  },
});

export const { setCurrentUser, removeCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
