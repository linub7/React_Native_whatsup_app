import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import PageContainer from '../../components/shared/PageContainer';
import ProfileImage from '../../components/shared/profile/ProfileImage';
import PageTitle from '../../components/shared/PageTitle';
import { colors } from '../../constants/colors';
import { toCapitalizeWord } from '../../utils/general';
import { getCommonChatsHandler } from '../../api/chat';
import ContactScreenCommonChats from '../../components/contact/common-groups';
import SocketContext from '../../context/SocketContext';

const ContactScreen = ({ route }) => {
  const [commonChats, setCommonChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = route?.params?.user;

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
});

export default ContactScreen;
