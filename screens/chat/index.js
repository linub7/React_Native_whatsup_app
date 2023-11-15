import { useCallback, useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getChatMessagesHandler,
  sendMessageHandler,
  sendReplyMessageHandler,
  toggleStarMessageHandler,
} from '../../api/message';
import backgroundImage from '../../assets/images/droplet.jpeg';
import IconButton from '../../components/chat-screen/buttons/IconButton';
import Bubble from '../../components/shared/bubble';
import PageContainer from '../../components/shared/PageContainer';
import { colors } from '../../constants/colors';
import {
  getConversationFirstName,
  getConversationLastName,
  toCapitalizeWord,
} from '../../utils/general';
import SocketContext from '../../context/SocketContext';
import {
  addMessageToActiveConversationAction,
  setActiveConversationMessagesAction,
  updateActiveConversationAndItsMessagesAction,
  updateMessageStarStatusAction,
} from '../../store/slices/chatSlice';
import { HIDE_ERROR_BANNER_TEXT_DURATION } from '../../constants';
import ChatScreenReplyTo from '../../components/chat-screen/reply-to';

const ChatScreen = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorBannerText, setErrorBannerText] = useState('');
  const [replyingTo, setReplyingTo] = useState();

  const { userData, token } = useSelector((state) => state.auth);
  const { activeConversation, messages } = useSelector((state) => state.chat);

  const chatData = route?.params?.newChatData;

  useEffect(() => {
    if (!activeConversation) return;
    setFirstName(getConversationFirstName(userData, activeConversation?.users));
    setLastName(getConversationLastName(userData, activeConversation?.users));
    return () => {
      setFirstName();
      setLastName();
    };
  }, [activeConversation?._id]);

  const dispatch = useDispatch();

  const socket = useContext(SocketContext);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getChatTitleFromName(),
    });

    setChatUsers(activeConversation?.users);
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
  }, [activeConversation?._id]);

  useEffect(() => {
    socket.on('receive-message', (message) => {
      console.log('new-message received: ', message);
      dispatch(updateActiveConversationAndItsMessagesAction(message));
    });

    // listening to typing and stop-typing
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop-typing', () => setIsTyping(false));
  }, []);

  const getChatTitleFromName = () => {
    return `${toCapitalizeWord(firstName)} ${toCapitalizeWord(lastName)}`;
  };

  const handleChangeInput = (txt) => {
    setMessageText(txt);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', activeConversation?._id);
    }
    const lastTypingTime = new Date().getTime(); // getTime() returns in ms
    const timer = 2000;
    setTimeout(() => {
      const now = new Date().getTime();
      if (now - lastTypingTime >= timer && isTyping) {
        socket.emit('stop-typing', activeConversation?._id);
        setIsTyping(false);
      }
    }, timer);
  };

  const handleSendMessage = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('message', messageText);
      formData.append('chat', activeConversation?._id);
      if (!replyingTo) {
        const { err, data } = await sendMessageHandler(formData, token);
        if (err) {
          console.log(err);
          setErrorBannerText(err?.error);
          setTimeout(
            () => setErrorBannerText(''),
            HIDE_ERROR_BANNER_TEXT_DURATION
          );
          return;
        }
        await dispatch(addMessageToActiveConversationAction(data?.data?.data));
        socket.emit('send-message', data?.data?.data);
      } else {
        const { err, data } = await sendReplyMessageHandler(
          replyingTo?._id,
          formData,
          token
        );
        if (err) {
          console.log(err);
          setReplyingTo();
          setErrorBannerText(err?.error);
          setTimeout(
            () => setErrorBannerText(''),
            HIDE_ERROR_BANNER_TEXT_DURATION
          );
          return;
        }
        await dispatch(addMessageToActiveConversationAction(data?.data?.data));
        socket.emit('send-message', data?.data?.data);
        setReplyingTo();
      }
    } catch (error) {
      console.log(error);
      setErrorBannerText('OOPS! something went wrong! Try again later.');
      setTimeout(() => setErrorBannerText(''), HIDE_ERROR_BANNER_TEXT_DURATION);
      return;
    }
    setMessageText('');
  }, [messageText]);

  const handleToggleStarMessage = useCallback(async (item) => {
    const { err, data } = await toggleStarMessageHandler(
      item?._id,
      item?.chat,
      token
    );
    if (err) {
      console.log(err);
      setErrorBannerText(err?.error);
      setTimeout(() => setErrorBannerText(''), HIDE_ERROR_BANNER_TEXT_DURATION);
      return;
    }
    dispatch(updateMessageStarStatusAction(data?.data?.data));
  }, []);

  const handleSetReplyingTo = (item) => setReplyingTo(item);
  const handleCancelReplyingTo = () => {
    setReplyingTo();
    setMessageText('');
  };

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ImageBackground source={backgroundImage} style={styles.bgImage}>
          <PageContainer style={styles.contentContainer}>
            {errorBannerText !== '' && (
              <Bubble type={'error'} text={errorBannerText} />
            )}
            {messages?.length < 1 ? (
              <Bubble type={'system'} text={'This is a new chat. Say Hi!'} />
            ) : (
              <FlatList
                data={messages}
                keyExtractor={(el) => el?._id}
                renderItem={({ item }) => {
                  const message = item?.message;
                  const isOwnMessage = item?.sender?._id
                    ? item?.sender?._id === userData?._id
                    : item?.sender === userData?._id;
                  const messageType = isOwnMessage
                    ? 'myMessage'
                    : 'notMyMessage';
                  return (
                    <Bubble
                      type={messageType}
                      text={message}
                      isStared={item?.isStared}
                      date={item?.createdAt}
                      handleToggleStarMessage={() =>
                        handleToggleStarMessage(item)
                      }
                      handleSetReplyingTo={() => handleSetReplyingTo(item)}
                      repliedTo={item?.replyTo}
                    />
                  );
                }}
              />
            )}
          </PageContainer>
          {replyingTo && (
            <ChatScreenReplyTo
              replyingTo={replyingTo}
              onCancel={handleCancelReplyingTo}
            />
          )}
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
