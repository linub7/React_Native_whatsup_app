import { useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/chat-list-screen/buttons/CustomHeaderButton';
import SocketContext from '../../context/SocketContext';

const ChatListScreen = ({ navigation, route }) => {
  const { userData } = useSelector((state) => state.auth);

  const socket = useContext(SocketContext);

  const selectedUser = route?.params?.selectedUserId;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New Chat"
              iconName="create-outline"
              onPress={() => navigation.navigate('ٔNewChatScreen')}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const chatUsers = [selectedUser, userData._id];

    const navigationProps = {
      newChatData: { users: chatUsers },
    };

    navigation.navigate('ChatScreen', navigationProps);
  }, [route?.params]);

  useEffect(() => {
    socket.emit('join', userData?._id);
  }, [userData]);

  return (
    <View style={styles.container}>
      <Text>Chat List</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatListScreen;
