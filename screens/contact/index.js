import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PageContainer from '../../components/shared/PageContainer';
import ProfileImage from '../../components/shared/profile/ProfileImage';
import PageTitle from '../../components/shared/PageTitle';
import { colors } from '../../constants/colors';
import { toCapitalizeWord } from '../../utils/general';
import {
  getCommonChatsHandler,
  removeUserFromGroupChatHandler,
} from '../../api/chat';
import ContactScreenCommonChats from '../../components/contact/common-groups';
import SocketContext from '../../context/SocketContext';
import SubmitButton from '../../components/auth-screen/buttons/SubmitButton';
import {
  setActiveConversationAction,
  setActiveConversationMessagesAction,
} from '../../store/slices/chatSlice';

const ContactScreen = ({ navigation, route }) => {
  const [commonChats, setCommonChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = route?.params?.user;
  const conversationId = route?.params?.conversationId;
  const isGroup = route?.params?.isGroup;
  const conversationName = route?.params?.conversationName;

  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const { userData, token } = useSelector((state) => state.auth);

  useEffect(() => {
    handleGetCommonChats();
    return () => {
      setCommonChats([]);
    };
  }, [user?._id]);

  const handleGetCommonChats = async () => {
    setLoading(true);
    const { err, data } = await getCommonChatsHandler(user?._id, token);
    if (err) {
      console.log(err);
      setLoading(false);
      Alert.alert('OOPS', err?.error);
      return;
    }
    setLoading(false);
    setCommonChats(data?.data?.data);
  };

  const handleRemoveUserFromGroupChat = useCallback(async () => {
    setIsLoading(true);
    const removedUser = user?._id;

    const { err, data } = await removeUserFromGroupChatHandler(
      conversationId,
      removedUser,
      token
    );
    if (err) {
      console.log(err);
      setIsLoading(false);
      Alert.alert('OOPS', err?.error);
      return;
    }
    dispatch(setActiveConversationAction(data?.data?.data?.chat));
    dispatch(setActiveConversationMessagesAction(data?.data?.data?.messages));
    navigation.navigate('ChatSettings', {
      conversation: data?.data?.data?.chat,
    });
  }, [conversationId, isLoading, user, navigation, dispatch]);

  return (
    <PageContainer>
      <View style={styles.topContainer}>
        <ProfileImage
          imageUri={user?.image?.url}
          width={80}
          height={80}
          additionalStyle={styles.profileImageStyle}
        />

        <PageTitle
          title={`${toCapitalizeWord(user?.firstName)} ${toCapitalizeWord(
            user?.lastName
          )}`}
        />
        {user?.about && (
          <Text style={styles.about} numberOfLines={2}>
            {user?.about}
          </Text>
        )}
      </View>
      {loading ? (
        <ActivityIndicator size={'small'} />
      ) : commonChats?.length > 0 ? (
        <ContactScreenCommonChats
          commonChats={commonChats}
          userData={userData}
          token={token}
          socket={socket}
          onlineUsers={[]}
        />
      ) : null}

      {conversationId && isGroup && (
        <SubmitButton
          color={colors.red}
          onPress={handleRemoveUserFromGroupChat}
          label={`Remove ${toCapitalizeWord(
            user?.firstName
          )} from ${conversationName}?`}
          additionalStyle={styles.removeButton}
          disabled={isLoading}
        />
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  profileImageStyle: {
    marginBottom: 20,
  },
  about: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3,
    color: colors.grey,
  },
  removeButton: {
    marginTop: 30,
  },
});

export default ContactScreen;
