import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../constants/colors';

const Bubble = ({ text, type }) => {
  const wrapperStyle = { ...styles.wrapperStyle };
  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };

  switch (type) {
    case 'system':
      textStyle.color = colors.systemTextColor;
      bubbleStyle.backgroundColor = colors.beige;
      bubbleStyle.alignItems = 'center';
      bubbleStyle.marginTop = 10;
      break;
    case 'error':
      textStyle.color = 'white';
      bubbleStyle.backgroundColor = colors.red;
      bubbleStyle.marginTop = 10;
      break;
    case 'myMessage':
      wrapperStyle.justifyContent = 'flex-end';
      bubbleStyle.backgroundColor = '#E7FED6';
      bubbleStyle.maxWidth = '90%';
      break;
    case 'notMyMessage':
      wrapperStyle.justifyContent = 'flex-start';
      bubbleStyle.maxWidth = '90%';
      break;

    default:
      break;
  }
  return (
    <View style={wrapperStyle}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{text}</Text>
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
  },
});

export default Bubble;
