import client from '../client';

export const signupUser = async (values) => {
  try {
    const { data } = await client.post(`/register`, values);
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const signinUser = async (values) => {
  try {
    const { data } = await client.post(`/login`, values);
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await client.get(`/logout`);
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const updateUserPassword = async (password, token) => {
  try {
    const { data } = await client.put(
      `/update-password`,
      { password },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const forgotUserPassword = async (email) => {
  try {
    const { data } = await client.post(`/forgot-password`, { email });
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const resetUserPassword = async (values) => {
  try {
    const { data } = await client.put(`/reset-password`, values);
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};
