import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../constants/colors';

const ChatScreenReplyTo = ({ replyingTo, onCancel = () => {} }) => {
  const name = `${replyingTo?.sender?.firstName} ${replyingTo?.sender?.lastName}`;
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1}>{replyingTo?.message}</Text>
      </View>

      <TouchableOpacity onPress={onCancel}>
        <Ionicons name="close-circle-outline" size={24} color={colors.blue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.extraLightGrey,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: colors.blue,
    borderLeftWidth: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 5,
  },
  name: {
    color: colors.blue,
    fontFamily: 'medium',
    letterSpacing: 0.3,
  },
});

export default ChatScreenReplyTo;
