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
