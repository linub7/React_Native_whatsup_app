import client from '../client';

export const createOrOpenChatHandler = async (receiverId, token) => {
  try {
    const { data } = await client.post(
      `/chats`,
      { receiverId },
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

export const getChatsHandler = async (token) => {
  try {
    const { data } = await client.get(`/chats`, {
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
