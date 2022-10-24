import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';

const FormsFooter = ({ footer, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{footer}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    color: colors.blue,
    textAlign: 'center',
    fontFamily: 'medium',
    letterSpacing: 0.3,
  },
});

export default FormsFooter;
