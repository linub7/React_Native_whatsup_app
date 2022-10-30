import client from '../client';

export const createMessage = async (content, chatId, token) => {
  try {
    const { data } = await client.post(
      `/create-message`,
      { content, chatId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};
