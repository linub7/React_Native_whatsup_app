import { ActivityIndicator, StyleSheet } from 'react-native';

const Spinner = ({ size }) => {
  return <ActivityIndicator size={size} style={styles.spinner} />;
};

const styles = StyleSheet.create({
  spinner: {
    marginTop: 30,
  },
});

export default Spinner;
