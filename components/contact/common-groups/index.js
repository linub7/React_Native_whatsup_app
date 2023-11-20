import { StyleSheet, Text, View } from 'react-native';

import ChatListScreenChatItem from '../../chat-list-screen/chat-item';
import { colors } from '../../../constants/colors';

const ContactScreenCommonChats = ({
  commonChats,
  userData,
  token,
  socket,
  onlineUsers,
}) => {
  return (
    <>
      <Text style={styles.heading}>
        {commonChats?.length} {commonChats?.length === 1 ? 'Group' : 'Groups'}{' '}
        in Common
      </Text>
      {commonChats?.map((chat) => (
        <ChatListScreenChatItem
          key={chat?._id}
          item={chat}
          userData={userData}
          token={token}
          socket={socket}
          onlineUsers={onlineUsers}
          type="link"
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'bold',
    letterSpacing: 0.3,
    color: colors.textColor,
    marginVertical: 8,
  },
});

export default ContactScreenCommonChats;
