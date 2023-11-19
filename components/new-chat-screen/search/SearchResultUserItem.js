import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../constants/colors';
import ProfileImage from '../../shared/profile/ProfileImage';

const SearchResultUserItem = ({
  item,
  onPress,
  type = '',
  isChecked = false,
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => onPress(item)}>
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

        {type === 'checkbox' && (
          <View
            style={{
              ...styles.iconContainer,
              ...(isChecked && styles.checkedStyle),
            }}
          >
            <Ionicons name="checkmark" size={18} color={'white'} />
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
    flex: 1,
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
  iconContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    backgroundColor: 'white',
  },
  checkedStyle: {
    backgroundColor: colors.green,
    borderColor: 'transparent',
  },
});
export default SearchResultUserItem;
