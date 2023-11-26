import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../../constants/colors';

const ChatSettingsScreenActionItem = ({
  name,
  title,
  iconIsHide = false,
  onPress = () => {},
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        {!iconIsHide && (
          <View style={styles.leftIconContainer}>
            <Ionicons name={name} size={24} color={colors.blue} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.title,
              color: iconIsHide ? colors.textColor : colors.blue,
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 50,
  },
  leftIconContainer: {
    backgroundColor: colors.extraLightGrey,
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginLeft: 14,
  },
  title: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default ChatSettingsScreenActionItem;
