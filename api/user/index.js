import client from '../client';

export const updateProfilePhoto = async (formData, token) => {
  try {
    const { data } = await client.post(`/upload-profile-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      },
    });
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const searchUsers = async (query, token) => {
  try {
    const { data } = await client.get(`/users/search?name=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};
