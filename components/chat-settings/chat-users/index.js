import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../constants/colors';
import ChatSettingsScreenChatUsersAdd from './add';
import ChatSettingsScreenChatUsersItem from './item';

const ChatSettingsScreenChatUsers = ({
  userLength,
  userId,
  chatAdminId,
  users,
  userData,
  conversationId,
  isGroup,
  conversationName,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{userLength} Participants</Text>
      {userId === chatAdminId && (
        <ChatSettingsScreenChatUsersAdd
          title={'Add Users'}
          onPress={() => console.log('Add users')}
        />
      )}

      {users?.map((user) => (
        <ChatSettingsScreenChatUsersItem
          key={user?._id}
          item={user}
          userData={userData}
          conversationId={conversationId}
          isGroup={isGroup}
          conversationName={conversationName}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    flex: 1,
  },
  heading: {
    marginVertical: 8,
    color: colors.textColor,
    fontFamily: 'bold',
    letterSpacing: 0.3,
  },
});

export default ChatSettingsScreenChatUsers;
