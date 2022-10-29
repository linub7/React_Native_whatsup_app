import { useEffect } from 'react';
import { useCallback, useState } from 'react';
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
import { useSelector } from 'react-redux';
import backgroundImage from '../assets/images/droplet.jpeg';
import IconButton from '../components/chat-screen/buttons/IconButton';
import { colors } from '../constants/colors';

const ChatScreen = ({ navigation, route }) => {
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);

  const chatData = route?.params?.newChatData;
  const { storedUsers } = useSelector((state) => state.users);
  const { userData } = useSelector((state) => state.auth);

  console.log({ chatUsers });
  console.log({ userData });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getChatTitleFromName(),
    });

    setChatUsers(chatData?.users);

    // return () => {
    //   setMessageText('');
    //   setChatUsers([]);
    // };
  }, [chatUsers]);

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.filter((id) => id !== userData._id);
    console.log({ otherUserId });
    const otherUserData = storedUsers[otherUserId];
    console.log({ otherUserData });

    return `${otherUserData?.firstName} ${otherUserData?.lastName}`;
  };

  const handleChangeInput = (txt) => setMessageText(txt);

  const handleSendMessage = useCallback(() => {
    console.log('Send Clicked');
    setMessageText('');
  }, [messageText]);

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.bgImage}
        ></ImageBackground>

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
