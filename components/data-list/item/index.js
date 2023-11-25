import ChatSettingsScreenChatUsersItem from '../../chat-settings/chat-users/item';

const DataListScreenItem = ({
  item,
  conversationId,
  conversationName,
  userData,
}) => {
  return (
    <ChatSettingsScreenChatUsersItem
      conversationId={conversationId}
      conversationName={conversationName}
      isGroup={true}
      item={item}
      userData={userData}
    />
  );
};

export default DataListScreenItem;
