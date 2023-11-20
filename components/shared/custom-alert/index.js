import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import { colors } from '../../../constants/colors';

const CustomAwesomeAlert = ({
  tempImageUri,
  isLoading,
  onCancelPressed = () => {},
  onConfirmPressed = () => {},
  onDismiss = () => {},
}) => {
  return (
    <AwesomeAlert
      show={tempImageUri !== ''}
      title="Send Image?"
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText="Cancel"
      confirmText="Send Image"
      confirmButtonColor={colors.green}
      cancelButtonColor={colors.red}
      titleStyle={styles.popupTitleStyle}
      onCancelPressed={onCancelPressed}
      onConfirmPressed={onConfirmPressed}
      onDismiss={onDismiss}
      customView={
        <View>
          {isLoading && (
            <ActivityIndicator size={'small'} color={colors.green} />
          )}
          {!isLoading && tempImageUri !== '' && (
            <Image
              source={{ uri: tempImageUri }}
              style={styles.tempImageUriStyle}
            />
          )}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  popupTitleStyle: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  tempImageUriStyle: {
    width: 200,
    height: 200,
  },
});

export default CustomAwesomeAlert;
