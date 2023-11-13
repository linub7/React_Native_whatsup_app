import client from '../client';

export const getChatMessagesHandler = async (chatId, token) => {
  try {
    const { data } = await client.get(`/messages/${chatId}`, {
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

export const sendMessageHandler = async (formData, token) => {
  try {
    const { data } = await client.post(`/messages`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const toggleStarMessageHandler = async (messageId, chatId, token) => {
  try {
    const { data } = await client.put(
      `/messages/${messageId}`,
      { chatId },
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
