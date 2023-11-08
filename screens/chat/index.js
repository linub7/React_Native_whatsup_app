import { useCallback, useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getChatMessagesHandler, sendMessageHandler } from '../../api/message';
import backgroundImage from '../../assets/images/droplet.jpeg';
import IconButton from '../../components/chat-screen/buttons/IconButton';
import Bubble from '../../components/shared/bubble';
import PageContainer from '../../components/shared/PageContainer';
import { colors } from '../../constants/colors';
import { toCapitalizeWord } from '../../utils/general';
import SocketContext from '../../context/SocketContext';
import {
  addMessageToActiveConversationAction,
  setActiveConversationMessagesAction,
} from '../../store/slices/chatSlice';

const ChatScreen = ({ navigation, route }) => {
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);

  const chatData = route?.params?.newChatData;

  const dispatch = useDispatch();

  const { storedUsers } = useSelector((state) => state.users);
  const { userData, token } = useSelector((state) => state.auth);
  const { activeConversation, messages } = useSelector((state) => state.chat);

  console.log({ activeConversation, messages });

  const socket = useContext(SocketContext);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getChatTitleFromName(),
    });

    setChatUsers(chatData?.users);
  }, [chatUsers]);

  useEffect(() => {
    const handleGetChatMessages = async () => {
      const { err, data } = await getChatMessagesHandler(
        activeConversation?._id,
        token
      );
      if (err) {
        console.log(err);
        return Alert.alert(err?.error);
      }
      dispatch(setActiveConversationMessagesAction(data?.data?.data));
    };

    if (activeConversation?._id) handleGetChatMessages();

    return () => {};
  }, []);

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.filter((id) => id !== userData._id);
    const otherUserData = storedUsers[otherUserId];

    return `${toCapitalizeWord(otherUserData?.firstName)} ${toCapitalizeWord(
      otherUserData?.lastName
    )}`;
  };

  const handleChangeInput = (txt) => setMessageText(txt);

  const handleSendMessage = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('message', messageText);
      formData?.append('chat', chatData?.chatId);
      const { err, data } = await sendMessageHandler(formData, token);
      if (err) {
        console.log(err);
        return Alert.alert(err?.error);
      }
      await dispatch(addMessageToActiveConversationAction(data?.data?.data));
      socket.emit('send-message', data?.data?.data);
    } catch (error) {
      return Alert.alert('OOPS! something went wrong!');
    }
    setMessageText('');
  }, [messageText]);

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ImageBackground source={backgroundImage} style={styles.bgImage}>
          <PageContainer style={styles.contentContainer}>
            {!activeConversation?.latestMessage && (
              <Bubble type={'system'} text={'This is a new chat. Say Hi!'} />
            )}
          </PageContainer>
        </ImageBackground>

        <View style={styles.inputContainer}>
          <IconButton
            icon={'add'}
            onPress={() => console.log('add clicked')}
            size={24}
            color={colors.blue}
          />
          <TextInput
            style={styles.textBox}
            value={messageText}
            onChangeText={handleChangeInput}
            onSubmitEditing={handleSendMessage}
            selectionColor={colors.blue}
          />
          {messageText === '' ? (
            <IconButton
              icon={'camera-outline'}
              onPress={() => console.log('camera clicked')}
              size={24}
              color={colors.blue}
            />
          ) : (
            <IconButton
              sendButton={true}
              icon={'send-outline'}
              onPress={handleSendMessage}
              size={24}
              color={colors.blue}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  screen: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    marginHorizontal: 15,
    paddingHorizontal: 12,
  },
});

export default ChatScreen;
