import client from '../client';

export const createOrOpenChatHandler = async (receiverId, isGroup, token) => {
  try {
    const { data } = await client.post(
      `/chats`,
      { receiverId, isGroup },
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

export const createGroupChatHandler = async (users, name, token) => {
  try {
    const { data } = await client.post(
      `/chats/group`,
      { users, name },
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

export const getCommonChatsHandler = async (otherUser, token) => {
  try {
    const { data } = await client.get(`/chats/common?otherUser=${otherUser}`, {
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

export const getChatStarredMessagesHandler = async (chatId, token) => {
  try {
    const { data } = await client.get(`/chats/starred-messages/${chatId}`, {
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

export const removeUserFromGroupChatHandler = async (
  id,
  removedUser,
  token
) => {
  try {
    const { data } = await client.put(
      `/chats/users/${id}`,
      { removedUser },
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

export const addUsersToGroupChatHandler = async (id, userIds, token) => {
  try {
    const { data } = await client.post(
      `/chats/users/${id}`,
      { userIds },
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

export const updateGroupChatHandler = async (id, formData, token) => {
  try {
    const { data } = await client.put(`/chats/${id}`, formData, {
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

export const leaveUserFromGroupChatHandler = async (id, token) => {
  try {
    const { data } = await client.put(
      `/chats/leave/${id}`,
      {},
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

export const deleteGroupChatByAdminHandler = async (id, token) => {
  try {
    const { data } = await client.delete(`/chats/${id}`, {
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
