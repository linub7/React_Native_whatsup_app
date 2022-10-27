import { Button, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { logoutUser } from '../api/auth';

AsyncStorage.clear();

const ChatListScreen = ({ navigation }) => {
  const dispatch = useDispatch();

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
