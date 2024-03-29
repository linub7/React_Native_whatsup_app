import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PageContainer from '../../components/shared/PageContainer';
import PageTitle from '../../components/shared/PageTitle';
import ProfileImage from '../../components/shared/profile/ProfileImage';
import { launchImagePicker } from '../../utils/imagePickerHelper';
import {
  deleteGroupChatByAdminHandler,
  leaveUserFromGroupChatHandler,
  updateGroupChatHandler,
} from '../../api/chat';
import {
  getConversationsAction,
  makeEmptyConversationsAction,
  setActiveConversationAction,
  updateConversationsAction,
} from '../../store/slices/chatSlice';
import CustomAwesomeAlert from '../../components/shared/custom-alert';
import { formReducer } from '../../utils/reducers/formReducer';
import ChatSettingsScreenSubmit from '../../components/chat-settings/submit';
import ChatSettingsScreenChatNameOrInput from '../../components/chat-settings/chat-name-input';
import { validateInput } from '../../utils/actions/formActions';
import ChatSettingsScreenChatUsers from '../../components/chat-settings/chat-users';
import SocketContext from '../../context/SocketContext';
import SubmitButton from '../../components/auth-screen/buttons/SubmitButton';
import { colors } from '../../constants/colors';

const ChatSettingsScreen = ({ navigation, route }) => {
  const [mainConversation, setMainConversation] = useState({});
  const [tempImageUri, setTempImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteOrLeaveLoading, setDeleteOrLeaveLoading] = useState(false);
  const [values, setValues] = useState({ chatName: mainConversation?.name });

  const conversation = route?.params?.conversation;
  const image = mainConversation?.picture?.url;

  const { userData, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!conversation) return;
    setMainConversation(conversation);
    setValues({ chatName: conversation?.name });

    return () => {
      setTempImageUri('');
      setIsLoading(false);
      setMainConversation({});
    };
  }, [conversation]);

  const initialState = {
    inputValidities: {
      chatName: false,
    },
    isFormValid: false,
  };

  const [formState, dispatchFormState] = useReducer(formReducer, initialState);

  const isUpdateButtonDisabled =
    !formState.isFormValid ||
    !values?.chatName ||
    values?.chatName === mainConversation?.name;

  const handleInputChange = (inputId, inputValue) => {
    const validationResult = validateInput(inputId, inputValue);
    dispatchFormState({
      inputId,
      validationResult,
    });

    setValues({ ...values, [inputId]: inputValue });
  };

  const handleCancelSendImage = () => setTempImageUri('');

  const handleUpdate = useCallback(async () => {
    const { chatName } = values;
    const formData = new FormData();
    formData.append('name', chatName);
    setLoading(true);
    const { err, data } = await updateGroupChatHandler(
      mainConversation?._id,
      formData,
      token
    );
    if (err) {
      console.log(err);
      setLoading(false);
      Alert.alert('OOPS', err?.error);
      return;
    }

    setLoading(false);
    setMainConversation(data?.data?.data);
    Alert.alert('Well Done', 'Your group name updated Successfully ✅');
    await dispatch(setActiveConversationAction(data?.data?.data));
    await dispatch(updateConversationsAction(data?.data?.data));
  }, [values, isLoading, dispatch, mainConversation]);

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

    const { err, data } = await updateGroupChatHandler(
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

  const handleDeleteChat = useCallback(async () => {
    setDeleteOrLeaveLoading(true);
    const { err, data } = await deleteGroupChatByAdminHandler(
      mainConversation?._id,
      token
    );
    if (err) {
      console.log(err);
      setDeleteOrLeaveLoading(false);
      Alert.alert('OOPS', err?.error);
      return;
    }
    dispatch(makeEmptyConversationsAction());
    dispatch(getConversationsAction(data?.data?.data));
    navigation.navigate('ChatList');
  }, [deleteOrLeaveLoading, mainConversation, dispatch, navigation]);

  const handleLeaveChat = useCallback(async () => {
    setDeleteOrLeaveLoading(true);
    const { err, data } = await leaveUserFromGroupChatHandler(
      mainConversation?._id,
      token
    );
    if (err) {
      console.log(err);
      setDeleteOrLeaveLoading(false);
      Alert.alert('OOPS', err?.error);
      return;
    }
    dispatch(getConversationsAction(data?.data?.data));
    navigation.navigate('ChatList');
  }, [deleteOrLeaveLoading, mainConversation, dispatch, navigation]);

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
        <ChatSettingsScreenChatNameOrInput
          userId={userData?._id}
          chatAdminId={mainConversation?.admin?._id}
          conversationName={conversation?.name}
          errorText={formState.inputValidities['chatName']}
          value={values?.chatName}
          handleInputChange={handleInputChange}
        />
        {userData?._id === mainConversation?.admin?._id && (
          <ChatSettingsScreenSubmit
            loading={loading}
            isUpdateButtonDisabled={isUpdateButtonDisabled}
            handleUpdate={handleUpdate}
          />
        )}
        <ChatSettingsScreenChatUsers
          userId={userData?._id}
          chatAdminId={mainConversation?.admin?._id}
          userLength={mainConversation?.users?.length}
          users={mainConversation?.users}
          onlineUsers={[]}
          socket={socket}
          token={token}
          userData={userData}
          conversationId={mainConversation?._id}
          isGroup={mainConversation?.isGroup}
          conversationName={mainConversation?.name}
        />

        {mainConversation?.admin?._id === userData?._id ? (
          <SubmitButton
            label={`Delete ${mainConversation?.name} Chat?!`}
            onPress={handleDeleteChat}
            disabled={deleteOrLeaveLoading}
            color={colors.red}
            additionalStyle={styles.submitBtn}
          />
        ) : (
          <SubmitButton
            label={`Leave ${mainConversation?.name} Chat?`}
            onPress={handleLeaveChat}
            disabled={deleteOrLeaveLoading}
            color={colors.red}
            additionalStyle={styles.submitBtn}
          />
        )}
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
    height: '100%',
  },
  submitBtn: {
    marginBottom: 10,
    width: '100%',
  },
});

export default ChatSettingsScreen;
