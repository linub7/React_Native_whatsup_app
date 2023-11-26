import { useCallback } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../../constants/colors';
import ChatSettingsScreenChatUsersItem from './item';
import ChatSettingsScreenActionItem from './action-item';
import { getChatStarredMessagesHandler } from '../../../api/chat';
import { getGroupChatInfoMessagesHandler } from '../../../api/message';

const ChatSettingsScreenChatUsers = ({
  userLength,
  userId,
  chatAdminId,
  users,
  userData,
  conversationId,
  isGroup,
  conversationName,
  token,
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

  const handlePressAddUsers = () =>
    navigation.navigate('ٔAddUsersScreen', {
      isGroupChat: true,
      existingUsers: users,
      conversationId,
    });

  const handlePressStarredMessages = useCallback(async () => {
    const { err, data } = await getChatStarredMessagesHandler(
      conversationId,
      token
    );
    if (err) {
      console.log(err);
      Alert.alert('OOPS', err?.error);
      return;
    }

    navigation.navigate('DataList', {
      title: 'Starred Messages',
      data: data?.data?.data,
      type: 'messages',
      conversationId,
      conversationName,
    });
  }, [conversationId]);

  const handlePressSystemInfoMessages = useCallback(async () => {
    const { err, data } = await getGroupChatInfoMessagesHandler(
      conversationId,
      token
    );
    if (err) {
      console.log(err);
      Alert.alert('OOPS', err?.error);
      return;
    }

    navigation.navigate('DataList', {
      title: 'Info Messages',
      data: data?.data?.data,
      type: 'info-messages',
      conversationId,
      conversationName,
    });
  }, [conversationId]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{userLength} Participants</Text>
      {userId === chatAdminId && (
        <ChatSettingsScreenActionItem
          title={'Add Users'}
          name={'add-outline'}
          onPress={handlePressAddUsers}
        />
      )}

      {users?.slice(0, 2).map((user) => (
        <ChatSettingsScreenChatUsersItem
          key={user?._id}
          item={user}
          userData={userData}
          conversationId={conversationId}
          isGroup={isGroup}
          conversationName={conversationName}
        />
      ))}

      {users?.length > 2 && (
        <ChatSettingsScreenActionItem
          title={'View All'}
          iconIsHide={true}
          onPress={handlePressViewAll}
        />
      )}

      <ChatSettingsScreenActionItem
        title={'Starred messages'}
        iconIsHide={true}
        onPress={handlePressStarredMessages}
      />

      {userId === chatAdminId && (
        <ChatSettingsScreenActionItem
          title={'System Info Messages'}
          iconIsHide={true}
          onPress={handlePressSystemInfoMessages}
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
