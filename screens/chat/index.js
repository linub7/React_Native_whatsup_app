import { useCallback, useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

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
  makeEmptyActiveConversationAction,
  setActiveConversationMessagesAction,
  updateActiveConversationAndItsMessagesAction,
  updateMessageStarStatusAction,
} from '../../store/slices/chatSlice';
import { HIDE_ERROR_BANNER_TEXT_DURATION } from '../../constants';
import ChatScreenReplyTo from '../../components/chat-screen/reply-to';
import { launchImagePicker, openCamera } from '../../utils/imagePickerHelper';
import CustomHeaderButton from '../../components/chat-list-screen/buttons/CustomHeaderButton';

const ChatScreen = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [chatTitle, setChatTitle] = useState('');
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorBannerText, setErrorBannerText] = useState('');
  const [replyingTo, setReplyingTo] = useState();
  const [tempImageUri, setTempImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //TODO: get older messages by scrolling to top to optimize state management size

  const flatListRef = useRef();

  const { userData, token } = useSelector((state) => state.auth);
  const { activeConversation, messages } = useSelector((state) => state.chat);

  useEffect(() => {
    if (!activeConversation) return;
    setFirstName(getConversationFirstName(userData, activeConversation?.users));
    setLastName(getConversationLastName(userData, activeConversation?.users));
    activeConversation?.name && setChatTitle(activeConversation?.name);
    return () => {
      setFirstName('');
      setLastName('');
      setChatTitle('');
      // handleMakeEmptyActiveConversation();
    };
  }, [activeConversation?._id]);

  const dispatch = useDispatch();

  const socket = useContext(SocketContext);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: activeConversation?.name
        ? toCapitalizeWord(chatTitle)
        : getChatTitleFromName(),
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {activeConversation?._id && (
              <Item
                title="Chat Settings"
                iconName="settings-outline"
                onPress={handleOnPressSettingsIcon}
              />
            )}
          </HeaderButtons>
        );
      },
    });

    setChatUsers(activeConversation?.users);
  }, [chatUsers, activeConversation]);

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

  // const handleMakeEmptyActiveConversation = () =>
  //   dispatch(makeEmptyActiveConversationAction());

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

  const handleSetReplyingTo = (item) => setReplyingTo(item);

  const handleCancelReplyingTo = () => {
    setReplyingTo();
    setMessageText('');
  };

  const handleCancelSendImage = () => setTempImageUri('');

  const handleOnPressSettingsIcon = () => {
    const otherUser = activeConversation?.users?.find(
      (item) => item?._id !== userData?._id
    );
    activeConversation?.isGroup
      ? console.log('to chat settings screen')
      : navigation.navigate('Contact', { user: otherUser });
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

  const handlePickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (tempUri === undefined) return;

      setTempImageUri(tempUri?.assets[0]?.uri);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const handleOpenCamera = useCallback(async () => {
    try {
      const tempUri = await openCamera();
      if (tempUri === undefined) return;

      setTempImageUri(tempUri?.assets[0]?.uri);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const handleConfirmSendImage = useCallback(async () => {
    setIsLoading(true);

    let filename = tempImageUri?.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append('files', { uri: tempImageUri, name: filename, type });
    formData.append('chat', activeConversation?._id);

    const { err, data } = await sendMessageHandler(formData, token);
    if (err) {
      setReplyingTo(null);
      console.log(err);
      setErrorBannerText(err?.error);
      setIsLoading(false);
      setTempImageUri('');
      setTimeout(() => setErrorBannerText(''), HIDE_ERROR_BANNER_TEXT_DURATION);
      return;
    }
    setReplyingTo(null);
    setTempImageUri('');
    setIsLoading(false);
    await dispatch(addMessageToActiveConversationAction(data?.data?.data));
    socket.emit('send-message', data?.data?.data);
  }, [isLoading, tempImageUri]);

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.bgImage}>
        <PageContainer style={styles.contentContainer}>
          {errorBannerText !== '' && (
            <Bubble type={'error'} text={errorBannerText} />
          )}
          {messages?.length < 1 ? (
            <Bubble
              type={'system'}
              text={'This is a new chat. Say Hi!'}
              isShowDateAndStar={false}
            />
          ) : (
            <FlatList
              ref={(ref) => (flatListRef.current = ref)}
              onContentSizeChange={() =>
                flatListRef.current.scrollToEnd({ animated: false })
              }
              onLayout={() => flatListRef.current.scrollToEnd()}
              showsVerticalScrollIndicator={false}
              data={messages}
              keyExtractor={(el) => el?._id}
              renderItem={({ item }) => {
                const message = item?.message;
                const isOwnMessage = item?.sender?._id
                  ? item?.sender?._id === userData?._id
                  : item?.sender === userData?._id;
                const messageType = isOwnMessage ? 'myMessage' : 'notMyMessage';
                const senderFullName = `${item?.sender?.firstName} ${item?.sender?.lastName}`;
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
                    imageUrl={item?.files[0]?.url}
                    fullName={senderFullName}
                    isShowFullName={
                      !item?.chat?.isGroup || isOwnMessage
                        ? undefined
                        : senderFullName
                    }
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
          onPress={handlePickImage}
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
            onPress={handleOpenCamera}
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

        <AwesomeAlert
          show={tempImageUri !== ''}
          title="Send Image?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Cancel"
          confirmText="Send Image"
          confirmButtonColor={colors.green}
          cancelButtonColor={colors.red}
          titleStyle={styles.popupTitleStyle}
          onCancelPressed={handleCancelSendImage}
          onConfirmPressed={handleConfirmSendImage}
          onDismiss={handleCancelSendImage}
          customView={
            <View>
              {isLoading && (
                <ActivityIndicator size={'small'} color={colors.green} />
              )}
              {!isLoading && tempImageUri !== '' && (
                <Image
                  source={{ uri: tempImageUri }}
                  style={styles.tempImageUriStyle}
                />
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
  popupTitleStyle: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  tempImageUriStyle: {
    width: 200,
    height: 200,
  },
});

export default ChatScreen;
