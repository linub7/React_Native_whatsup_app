import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import ProfileImage from '../../../shared/profile/ProfileImage';
import { colors } from '../../../../constants/colors';
import { toCapitalizeWord } from '../../../../utils/general';

const ChatSettingsScreenChatUsersItem = ({ item, userData }) => {
  const navigation = useNavigation();

  const handleNavigateToContactScreen = () =>
    navigation.navigate('Contact', { user: item });

  return (
    <TouchableWithoutFeedback onPress={() => handleNavigateToContactScreen()}>
      <View style={styles.container}>
        <ProfileImage
          imageUri={item?.image?.url}
          width={40}
          height={40}
          isEditable={false}
        />
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {toCapitalizeWord(item?.firstName)}{' '}
            {toCapitalizeWord(item?.lastName)}
          </Text>
        </View>

        {item?._id !== userData?._id && (
          <View style={styles.iconContainer}>
            <Ionicons name="chevron-forward" size={18} color={colors.grey} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outerHeight: { flex: 1 },
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 50,
  },
  textContainer: {
    marginLeft: 14,
  },
  title: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: 'regular',
    color: colors.grey,
    letterSpacing: 0.3,
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  iconContainer: {
    marginLeft: 'auto',
  },
});

export default ChatSettingsScreenChatUsersItem;
