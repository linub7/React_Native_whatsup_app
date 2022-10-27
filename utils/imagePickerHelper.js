import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export const launchImagePicker = async () => {
  await checkMediaPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  console.log({ result });

  if (!result.cancelled) {
    return result;
  }
};

const checkMediaPermissions = async () => {
  if (Platform.OS !== 'web') {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      return Promise.reject('We need Permission to access your photos');
    }

    return Promise.resolve();
  }
};
