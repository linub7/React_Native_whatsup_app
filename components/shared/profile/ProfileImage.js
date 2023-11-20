import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import defaultImage from '../../../assets/images/userImage.jpeg';
import { colors } from '../../../constants/colors';
import { DEFAULT_GROUP_IMAGE_URL } from '../../../constants';

const ProfileImage = ({
  width,
  height,
  additionalStyle,
  onPress,
  imageUri,
  loadedImageUrlFromServer,
  isEditable = false,
  listItem = false,
  isGroup = false,
  showRemoveButton = false,
}) => {
  const Container = isEditable ? TouchableOpacity : View;
  return (
    <Container style={additionalStyle} onPress={onPress}>
      {loadedImageUrlFromServer ? (
        <Image
          source={{ uri: loadedImageUrlFromServer }}
          style={{ ...styles.image, ...{ width, height } }}
        />
      ) : imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ ...styles.image, ...{ width, height } }}
        />
      ) : (
        <Image
          source={isGroup ? { uri: DEFAULT_GROUP_IMAGE_URL } : defaultImage}
          style={{ ...styles.image, ...{ width, height } }}
        />
      )}
      {isEditable && !listItem && (
        <View style={styles.iconContainer}>
          <Ionicons name="camera-outline" size={19} color="black" />
        </View>
      )}
      {showRemoveButton && (
        <View style={styles.removeIconContainer}>
          <Ionicons name="close" size={15} color="black" />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderColor: colors.grey,
    borderWidth: 1,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.lightGrey,
    borderRadius: 20,
    padding: 4,
  },
  removeIconContainer: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: colors.lightGrey,
    borderRadius: 20,
    padding: 4,
  },
});

export default ProfileImage;
