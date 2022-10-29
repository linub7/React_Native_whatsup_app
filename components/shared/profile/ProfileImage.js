import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import defaultImage from '../../../assets/images/userImage.jpeg';
import { colors } from '../../../constants/colors';
import { useState } from 'react';

const ProfileImage = ({
  width,
  height,
  additionalStyle,
  onPress,
  imageUri,
  loadedImageUrlFromServer,
  isEditable = false,
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
          source={defaultImage}
          style={{ ...styles.image, ...{ width, height } }}
        />
      )}
      {isEditable && (
        <View style={styles.iconContainer}>
          <Ionicons name="camera-outline" size={19} color="black" />
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
    right: 144,
    backgroundColor: colors.lightGrey,
    borderRadius: 20,
    padding: 4,
  },
});

export default ProfileImage;
