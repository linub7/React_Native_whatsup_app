import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    storedUsers: {},
  },
  reducers: {
    setStoredUsers: (state, action) => {
      const {
        payload: { newUsers },
      } = action;

      const existingUsers = state.storedUsers;

      const usersArray = Object.values(newUsers);
      for (let i = 0; i < usersArray.length; i++) {
        const userData = usersArray[i];
        existingUsers[userData._id] = userData;
      }
      state.storedUsers = existingUsers;
    },
  },
});

export const {
  actions: { setStoredUsers },
} = userSlice;

export default userSlice.reducer;
