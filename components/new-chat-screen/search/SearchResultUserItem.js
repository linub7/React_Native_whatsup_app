import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors } from '../../../constants/colors';
import ProfileImage from '../../shared/profile/ProfileImage';

const SearchResultUserItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item._id)}>
      <View style={styles.container}>
        <ProfileImage
          imageUri={item?.image?.url}
          width={40}
          height={40}
          isEditable={false}
        />
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {item?.firstName} {item?.lastName}
          </Text>
          {item?.about && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {item?.about}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
});
export default SearchResultUserItem;
