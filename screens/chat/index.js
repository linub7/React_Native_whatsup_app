import { useCallback, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createChatHandler } from '../../api/chat';
import { createMessage } from '../../api/message';
import backgroundImage from '../../assets/images/droplet.jpeg';
import CreateChatBubble from '../../components/chat-screen/bubble/CreateChatBubble';
import IconButton from '../../components/chat-screen/buttons/IconButton';
import Bubble from '../../components/shared/bubble';
import PageContainer from '../../components/shared/PageContainer';
import { colors } from '../../constants/colors';
import { toCapitalizeWord } from '../../utils/general';
import SocketContext from '../../context/SocketContext';

const ChatScreen = ({ navigation, route }) => {
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [chatId, setChatId] = useState();

  const chatData = route?.params?.newChatData;

  const { storedUsers } = useSelector((state) => state.users);
  const { userData, token } = useSelector((state) => state.auth);

  const socket = useContext(SocketContext);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getChatTitleFromName(),
    });

    setChatUsers(chatData?.users);
  }, [chatUsers]);

  useEffect(() => {
    socket.emit('join', userData?._id);
  }, []);

  // useEffect(() => {
  //   const findChat = async () => {
  //     const { err, data } = await findChatWithIds(chatData.users[0], token);
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     console.log('findChatWithIds data: ', data);
  //     setChatId(data?.existedChat._id);
  //   };

  //   findChat();
  // }, []);

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.filter((id) => id !== userData._id);
    const otherUserData = storedUsers[otherUserId];

    return `${toCapitalizeWord(otherUserData?.firstName)} ${toCapitalizeWord(
      otherUserData?.lastName
    )}`;
  };

  const handleChangeInput = (txt) => setMessageText(txt);

  const handleCreateChat = async () => {
    const { err, data } = await createChatHandler(
      { chatUsers: [chatUsers[0], chatUsers[1]] },
      token
    );
    if (err) {
      console.log(err);
      return;
    }
    if (data?.success) {
      setChatId(data?.createdChatId);
    }
  };

  // const handleSendMessage = useCallback(async () => {
  //   try {
  //     if (!chatId) {
  //       // No Chat ID. create the chat
  //       const { err, data } = await createMessage(messageText, chatId, token);
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //       console.log('createMessage: ', data);
  //     } else {
  //     }
  //   } catch (error) {}
  //   setMessageText('');
  // }, [messageText]);

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ImageBackground source={backgroundImage} style={styles.bgImage}>
          <PageContainer style={styles.contentContainer}>
            {!chatId && (
              <>
                <Bubble type={'system'} text={'This is a new chat, Say Hi'} />
                <CreateChatBubble
                  label={'Tap here to create a chat'}
                  onPress={handleCreateChat}
                />
              </>
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
            // onSubmitEditing={handleSendMessage}
            onSubmitEditing={() => {}}
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
              // onPress={handleSendMessage}
              onPress={() => {}}
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
