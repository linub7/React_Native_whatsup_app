import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

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
import { DEFAULT_GROUP_IMAGE_URL } from '../../../constants';

const ChatListScreenChatItem = ({
  item,
  userData,
  token,
  socket,
  onlineUsers,
  type,
}) => {
  const firstName = getConversationFirstName(userData, item?.users);
  const lastName = getConversationLastName(userData, item?.users);

  const image =
    item?.isGroup && item?.picture?.url
      ? item?.picture?.url
      : item?.isGroup && !item?.picture?.url
      ? DEFAULT_GROUP_IMAGE_URL
      : getConversationPicture(userData, item?.users);

  const otherUserId = item?.isGroup
    ? item?._id
    : getReceiverId(userData, item?.users);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleNavigateToChatListScreen = async (userId) => {
    const receiverId = userId;
    const isGroup = item?.isGroup;

    const { err, data } = await createOrOpenChatHandler(
      receiverId,
      isGroup,
      token
    );
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
    <TouchableWithoutFeedback
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
            {item?.isGroup
              ? item?.name
              : `${toCapitalizeWord(firstName)} ${toCapitalizeWord(lastName)}`}
          </Text>
          {item?.latestMessage?.message && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {item?.latestMessage?.message}
            </Text>
          )}
          {item?.latestMessage?.files[0]?.url && (
            <Image
              source={{ uri: item?.latestMessage?.files[0]?.url }}
              style={styles.image}
            />
          )}
        </View>

        {type === 'link' && (
          <View style={styles.iconContainer}>
            <Ionicons name="chevron-forward" size={18} color={colors.grey} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
  image: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  iconContainer: {
    marginLeft: 'auto',
  },
});

export default ChatListScreenChatItem;
