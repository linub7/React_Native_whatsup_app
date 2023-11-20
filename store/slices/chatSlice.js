import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  activeConversation: {},
  notifications: [],
  messages: [],
  files: [],
  groupChatUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversationAction: (state, action) => {
      const { payload } = action;
      state.activeConversation = payload;
    },
    getConversationsAction: (state, action) => {
      const { payload } = action;
      state.conversations = payload;
    },
    addToConversationsAction: (state, action) => {
      const { payload } = action;
      state.conversations.push(payload);
    },
    setActiveConversationMessagesAction: (state, action) => {
      const { payload } = action;
      state.messages = payload;
    },
    addMessageToActiveConversationAction: (state, action) => {
      const { payload } = action;
      state.messages = [...state.messages, payload];
      const relatedConversation = state.conversations.find(
        (conversation) =>
          conversation?._id?.toString() === payload?.chat?._id?.toString()
      );
      const conversation = {
        ...relatedConversation,
        latestMessage: payload,
      };
      const idx = state.conversations.findIndex(
        (el) => el?._id === conversation._id
      );
      state.conversations.splice(idx, 1);
      state.conversations.unshift(conversation);
    },
    updateActiveConversationAndItsMessagesAction: (state, action) => {
      const { payload } = action;
      const activeConversation = state.activeConversation;
      // update messages
      if (activeConversation?._id === payload?.conversation?._id) {
        state.messages = [...state.messages, payload];
      }
      // update conversation
      const relatedConversation = state.conversations.find(
        (conversation) =>
          conversation?._id?.toString() ===
          payload?.conversation?._id?.toString()
      );
      const conversation = {
        ...relatedConversation,
        latestMessage: payload,
      };
      const idx = state.conversations.findIndex(
        (el) => el?._id === conversation._id
      );
      state.conversations.splice(idx, 1);
      state.conversations.unshift(conversation);
    },
    updateMessageStarStatusAction: (state, action) => {
      const { payload } = action;
      let tmpMessages = [...state.messages];
      tmpMessages = tmpMessages.map((msg) =>
        msg?._id !== payload?._id ? msg : payload
      );

      state.messages = tmpMessages;
    },
    addFilesAction: (state, action) => {
      const { payload } = action;
      state.files = [...state.files, payload];
    },
    updateFilesAction: (state, action) => {
      const { payload } = action;
      const files = [...state.files];
      const fileToRemove = [files[payload]];
      state.files = files.filter((file) => !fileToRemove.includes(file));
    },
    makeEmptyFilesAction: (state, action) => {
      state.files = [];
    },
    toggleSelectedUsersForGroupChatAction: (state, action) => {
      const { payload } = action;

      const tmpGroupChatUsers = [...state.groupChatUsers];

      const idx = tmpGroupChatUsers.findIndex(
        (user) => user?._id === payload?._id
      );

      if (idx !== -1) {
        state.groupChatUsers = tmpGroupChatUsers?.filter(
          (user) => user?._id !== payload?._id
        );
      } else {
        state.groupChatUsers = [...tmpGroupChatUsers, payload];
      }
    },
    makeEmptySelectedUsersForGroupChatAction: (state, action) => {
      state.groupChatUsers = [];
    },
    // makeEmptyActiveConversationAction: (state, action) => {
    //   state.activeConversation = {};
    // },
  },
});

export const {
  actions: {
    setActiveConversationAction,
    getConversationsAction,
    addToConversationsAction,
    setActiveConversationMessagesAction,
    addMessageToActiveConversationAction,
    updateActiveConversationAndItsMessagesAction,
    updateMessageStarStatusAction,
    addFilesAction,
    updateFilesAction,
    makeEmptyFilesAction,
    toggleSelectedUsersForGroupChatAction,
    makeEmptySelectedUsersForGroupChatAction,
    // makeEmptyActiveConversationAction,
  },
} = chatSlice;

export default chatSlice.reducer;
