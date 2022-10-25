import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    userData: null,
  },
  reducers: {
    authenticate: (state, action) => {
      const {
        payload: { token, userData },
      } = action;
      state.token = token;
      state.userData = userData;
    },
  },
});

export const authenticate = authSlice.actions.authenticate;
export default authSlice.reducer;
