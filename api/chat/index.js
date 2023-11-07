import client from '../client';

export const createChatHandler = async (payload, token) => {
  try {
    const { data } = await client.post(`/create-chat`, payload, {
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

export const findChatWithIds = async (selectedUserId, token) => {
  try {
    const { data } = await client.get(`/find-chat-with-ids/${selectedUserId}`, {
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

export const findLoggedInUserChats = async (token) => {
  try {
    const { data } = await client.get(`/find-logged-in-users-chats`, {
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
