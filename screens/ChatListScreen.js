import { Button, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { logoutUser } from '../api/auth';

const ChatListScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.auth);

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
