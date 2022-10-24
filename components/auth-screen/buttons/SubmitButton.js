import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';

const SubmitButton = ({ disabled, label, color, onPress, additionalStyle }) => {
  const enabledBgColor = color || colors.green;
  const disabledBgColor = colors.lightGrey;
  const bgColor = disabled ? disabledBgColor : enabledBgColor;
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        ...additionalStyle,
        ...{ backgroundColor: bgColor },
      }}
      onPress={!disabled ? onPress : () => {}}
    >
      <Text style={disabled ? styles.disableText : styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disableText: {
    color: colors.grey,
  },
  text: {
    color: 'white',
  },
});

export default SubmitButton;
