import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PageContainer from '../../components/shared/PageContainer';
import PageTitle from '../../components/shared/PageTitle';
import SettingsForm from '../../components/settings-screen/form/SettingsForm';
import ProfileImage from '../../components/shared/profile/ProfileImage';
import { launchImagePicker } from '../../utils/imagePickerHelper';
import { updateProfilePhoto } from '../../api/user';
import { authenticate } from '../../store/slices/authSlice';
import Spinner from '../../components/shared/loading/Spinner';
import { colors } from '../../constants/colors';

const SettingsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const [uri, setUri] = useState(null);
  const { token, userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handlePickImage = async () => {
    const tempUri = await launchImagePicker();

    if (tempUri === undefined) return;

    setUri(tempUri?.uri);

    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = tempUri?.uri;
    let filename = localUri?.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append('image', { uri: localUri, name: filename, type });
    setLoading(true);

    const { err, data } = await updateProfilePhoto(formData, token);

    if (err) {
      console.log(err);
      setLoading(false);
      Alert.alert('OOPS!', err?.error);
      return;
    }
    setLoading(false);

    dispatch(
      authenticate({
        token,
        userData: {
          _id: data?._id,
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          about: data?.about,
          imageUrl: data?.image?.url,
        },
      })
    );
  };
  return (
    <PageContainer>
      <PageTitle title={'Settings'} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          keyboardVerticalOffset={100}
        >
          {loading ? (
            <Spinner size={35} color={colors.blue} />
          ) : (
            <ProfileImage
              width={80}
              height={80}
              additionalStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handlePickImage}
              imageUri={uri}
              loadedImageUrlFromServer={userData?.imageUrl}
              isEditable={true}
            />
          )}

          <SettingsForm />
        </KeyboardAvoidingView>
      </ScrollView>
    </PageContainer>
    // <View>
    //   <Text>Hi</Text>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    flex: 1,
    // backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SettingsScreen;
