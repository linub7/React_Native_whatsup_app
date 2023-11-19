import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../../../constants/colors';

const ChatListScreenCreateGroupChat = ({ onPress = () => {} }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.text}>New Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.blue,
    fontSize: 17,
    marginBottom: 5,
  },
});

export default ChatListScreenCreateGroupChat;
