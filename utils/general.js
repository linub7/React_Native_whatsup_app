export const toCapitalizeWord = (word) =>
  word?.charAt(0)?.toUpperCase() + word?.slice(1);

export const getReceiverId = (user, users) =>
  users[0]?._id === user?.id ? users[1]?._id : users[0]?._id;

export const getConversationFirstName = (user, users) =>
  users[0]?._id === user?.id ? users[1]?.firstName : users[0]?.firstName;

export const getConversationLastName = (user, users) =>
  users[0]?._id === user?.id ? users[1]?.lastName : users[0]?.lastName;

export const getConversationPicture = (user, users) =>
  users[0]?._id === user?.id ? users[1]?.picture?.url : users[0]?.picture?.url;

export const getConversationId = (user, users) =>
  users[0]?._id !== user?._id ? users[1]?._id : users[0]?._id;
