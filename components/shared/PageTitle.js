import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

const PageTitle = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  text: {
    fontSize: 28,
    color: colors.textColor,
    fontFamily: 'bold',
    letterSpacing: 0.3,
  },
});

export default PageTitle;
