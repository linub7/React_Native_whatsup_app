import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../../constants/colors';
import ChatSettingsScreenChatUsersItem from './item';
import ChatSettingsScreenActionItem from './action-item';

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
  const navigation = useNavigation();
  const handlePressViewAll = () =>
    navigation.navigate('DataList', {
      title: 'Participants',
      data: users,
      type: 'users',
      conversationId,
      conversationName,
    });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{userLength} Participants</Text>
      {userId === chatAdminId && (
        <ChatSettingsScreenActionItem
          title={'Add Users'}
          name={'add-outline'}
          onPress={() => console.log('Add users')}
        />
      )}

      {users?.slice(0, 4).map((user) => (
        <ChatSettingsScreenChatUsersItem
          key={user?._id}
          item={user}
          userData={userData}
          conversationId={conversationId}
          isGroup={isGroup}
          conversationName={conversationName}
        />
      ))}

      {users?.length > 4 && (
        <ChatSettingsScreenActionItem
          title={'View All'}
          imageIsHide={true}
          onPress={handlePressViewAll}
        />
      )}
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
