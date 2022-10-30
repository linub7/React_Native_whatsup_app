import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';
import CustomHeaderButton from '../components/chat-list-screen/buttons/CustomHeaderButton';

const ChatListScreen = ({ navigation, route }) => {
  const { userData } = useSelector((state) => state.auth);

  const selectedUser = route?.params?.selectedUserId;
  console.log(selectedUser);

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

  return (
    <View style={styles.container}>
      <Text>Chat List</Text>
      <Button
        title="Go to Chat Screen"
        onPress={() => navigation.navigate('ChatScreen')}
      />
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
