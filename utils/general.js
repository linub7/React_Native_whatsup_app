export const toCapitalizeWord = (word) =>
  word?.charAt(0)?.toUpperCase() + word?.slice(1);

export const getReceiverId = (user, users) =>
  users[0]?._id === user?._id ? users[1]?._id : users[0]?._id;

export const getConversationFirstName = (user, users) => {
  return users[0]?._id === user?._id
    ? users[1]?.firstName
    : users[0]?.firstName;
};

export const getConversationLastName = (user, users) =>
  users[0]?._id === user?._id ? users[1]?.lastName : users[0]?.lastName;

export const getConversationPicture = (user, users) =>
  users[0]?._id === user?._id ? users[1]?.image?.url : users[0]?.image?.url;

export const getConversationId = (user, users) =>
  users[0]?._id !== user?._id ? users[1]?._id : users[0]?._id;

export const getFormattedTime = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
};
