import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../constants/colors';

const CreateChatBubble = ({ label, onPress }) => {
  return (
    <View style={styles.wrapperStyle}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: colors.borderColor,
    borderWidth: 1,
  },
  text: {
    fontFamily: 'regular',
    letterSpacing: 0.3,
    color: colors.blue,
  },
});

export default CreateChatBubble;
