import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import {
  getConversationFirstName,
  getConversationLastName,
  getConversationPicture,
  getReceiverId,
  toCapitalizeWord,
} from '../../../utils/general';
import ProfileImage from '../../shared/profile/ProfileImage';
import { colors } from '../../../constants/colors';
import { createOrOpenChatHandler } from '../../../api/chat';
import { setActiveConversationAction } from '../../../store/slices/chatSlice';

const ChatListScreenChatItem = ({
  item,
  userData,
  token,
  socket,
  onlineUsers,
}) => {
  const firstName = getConversationFirstName(userData, item?.users);
  const lastName = getConversationLastName(userData, item?.users);
  const image = getConversationPicture(userData, item?.users);
  const otherUserId = getReceiverId(userData, item?.users);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleNavigateToChatListScreen = async (userId) => {
    const receiverId = userId;
    const { err, data } = await createOrOpenChatHandler(receiverId, token);
    if (err) {
      console.log(err);
      Alert.alert('OOPS!', err?.error);
      return;
    }
    await dispatch(setActiveConversationAction(data?.data?.data));
    socket.emit('join-chat', data?.data?.data?._id);
    const chatUsers = [receiverId, userData._id];
    const navigationProps = {
      newChatData: {
        users: chatUsers,
        chatId: data?.data?.data?._id,
        onlineUsers,
      },
    };
    navigation.navigate('ChatScreen', navigationProps);
  };

  return (
    <TouchableOpacity
      onPress={() => handleNavigateToChatListScreen(otherUserId)}
    >
      <View style={styles.container}>
        <ProfileImage
          imageUri={image}
          width={40}
          height={40}
          isEditable={false}
        />
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {toCapitalizeWord(firstName)} {toCapitalizeWord(lastName)}
          </Text>
          {item?.latestMessage?.message && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {item?.latestMessage?.message}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outerHeight: { flex: 1 },
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 50,
  },
  textContainer: {
    marginLeft: 14,
  },
  title: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: 'regular',
    color: colors.grey,
    letterSpacing: 0.3,
  },
});

export default ChatListScreenChatItem;
