import { StyleSheet, Text, View } from 'react-native';

import CustomTextInput from '../../shared/input/CustomTextInput';
import { toCapitalizeWord } from '../../../utils/general';

const ChatSettingsScreenChatNameOrInput = ({
  userId,
  chatAdminId,
  value,
  errorText,
  conversationName,
  handleInputChange = () => {},
}) => {
  return userId === chatAdminId ? (
    <CustomTextInput
      id={'chatName'}
      label="Chat name"
      autoCapitalized="none"
      value={value}
      allowEmpty={false}
      handleInputChange={handleInputChange}
      errorText={errorText}
    />
  ) : (
    <Text>{toCapitalizeWord(conversationName)}</Text>
  );
};

export default ChatSettingsScreenChatNameOrInput;

const styles = StyleSheet.create({});
