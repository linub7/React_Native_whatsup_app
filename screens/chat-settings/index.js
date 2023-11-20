import { useCallback, useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PageContainer from '../../components/shared/PageContainer';
import PageTitle from '../../components/shared/PageTitle';
import ProfileImage from '../../components/shared/profile/ProfileImage';
import { toCapitalizeWord } from '../../utils/general';
import { launchImagePicker } from '../../utils/imagePickerHelper';
import { updateChatPictureHandler } from '../../api/chat';
import {
  setActiveConversationAction,
  updateConversationsAction,
} from '../../store/slices/chatSlice';
import CustomAwesomeAlert from '../../components/shared/custom-alert';
import CustomTextInput from '../../components/shared/input/CustomTextInput';

const ChatSettingsScreen = ({ navigation, route }) => {
  const [mainConversation, setMainConversation] = useState({});
  const [tempImageUri, setTempImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const conversation = route?.params?.conversation;
  const image = mainConversation?.picture?.url;

  useEffect(() => {
    if (!conversation) return;
    setMainConversation(conversation);

    return () => {
      setTempImageUri('');
      setIsLoading(false);
      setMainConversation({});
    };
  }, [conversation]);

  const { userData, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleCancelSendImage = () => setTempImageUri('');

  const handlePickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (tempUri === undefined) return;

      setTempImageUri(tempUri?.assets[0]?.uri);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const handleConfirmSendImage = useCallback(async () => {
    setIsLoading(true);

    let filename = tempImageUri?.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append('picture', { uri: tempImageUri, name: filename, type });

    const { err, data } = await updateChatPictureHandler(
      mainConversation?._id,
      formData,
      token
    );
    if (err) {
      console.log(err);
      setIsLoading(false);
      setTempImageUri('');
      Alert.alert('OOPS', err?.error);
      return;
    }
    setTempImageUri('');
    setIsLoading(false);
    setMainConversation(data?.data?.data);
    await dispatch(setActiveConversationAction(data?.data?.data));
    await dispatch(updateConversationsAction(data?.data?.data));
  }, [isLoading, tempImageUri, mainConversation]);

  return (
    <PageContainer>
      <PageTitle title={'Chat Settings'} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProfileImage
          isEditable={
            userData?._id === mainConversation?.admin?._id ? true : false
          }
          height={80}
          width={80}
          imageUri={image}
          isGroup={true}
          onPress={handlePickImage}
        />

        {/* {userData?._id === mainConversation?.admin?._id ? (
          <CustomTextInput  />
        ) : (
          <Text>{toCapitalizeWord(conversation?.name)}</Text>
        )} */}
      </ScrollView>
      <CustomAwesomeAlert
        tempImageUri={tempImageUri}
        isLoading={isLoading}
        onCancelPressed={handleCancelSendImage}
        onDismiss={handleCancelSendImage}
        onConfirmPressed={handleConfirmSendImage}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatSettingsScreen;
