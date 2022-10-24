import { Button, StyleSheet, Text, View } from 'react-native';

const ChatListScreen = ({ navigation }) => {
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
