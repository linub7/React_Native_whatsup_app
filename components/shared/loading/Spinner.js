import { ActivityIndicator, StyleSheet } from 'react-native';

const Spinner = ({ size, color }) => {
  return <ActivityIndicator size={size} style={styles.spinner} color={color} />;
};

const styles = StyleSheet.create({
  spinner: {
    marginTop: 30,
  },
});

export default Spinner;
