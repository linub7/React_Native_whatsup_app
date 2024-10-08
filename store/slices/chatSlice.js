import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  activeConversation: {},
  notifications: [],
  messages: [],
  files: [],
  groupChatUsers: [],
  chatInfoMessages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversationAction: (state, action) => {
      const { payload } = action;
      state.activeConversation = payload;
    },
    makeEmptyConversationsAction: (state, action) => {
      state.conversations = [];
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
      relatedConversation.latestMessage = payload;
      const idx = state.conversations.findIndex(
        (el) => el?._id?.toString() === relatedConversation?._id?.toString()
      );
      state.conversations.splice(idx, 1);
      state.conversations.unshift(relatedConversation);
    },
    updateActiveConversationAndItsMessagesAction: (state, action) => {
      const { payload } = action;
      const activeConversation = state.activeConversation;
      // update messages
      if (
        activeConversation?._id?.toString() !== payload?.chat?._id?.toString()
      )
        return;
      state.messages = [...state.messages, payload];

      // update conversation
      const relatedConversation = state.conversations.find(
        (conversation) =>
          conversation?._id?.toString() === payload?.chat?._id?.toString()
      );
      relatedConversation.latestMessage = payload;
      const idx = state.conversations.findIndex(
        (el) => el?._id?.toString() === relatedConversation?._id?.toString()
      );
      state.conversations.splice(idx, 1);
      state.conversations.unshift(relatedConversation);
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
    updateConversationsAction: (state, action) => {
      const { payload } = action;

      let tmpConversations = [...state.conversations];
      tmpConversations = tmpConversations.map((conversation) =>
        conversation?._id !== payload?._id ? conversation : payload
      );

      state.conversations = tmpConversations;
    },
    getInfoMessageToMainConversationAction: (state, action) => {
      const { payload } = action;
      state.chatInfoMessages = payload;
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
    updateConversationsAction,
    getInfoMessageToMainConversationAction,
    makeEmptyConversationsAction,
    // makeEmptyActiveConversationAction,
  },
} = chatSlice;

export default chatSlice.reducer;
