import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';

const IconButton = ({ onPress, icon, size, sendButton = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={sendButton ? styles.sendButtonStyle : styles.mediaButton}
    >
      <Ionicons
        name={icon}
        size={sendButton ? 18 : size}
        color={sendButton ? 'white' : colors.blue}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mediaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
  },
  sendButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    backgroundColor: colors.blue,
    borderRadius: 50,
    color: 'white',
    // padding: ,
    width: 35,
  },
});

export default IconButton;
