import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

import { colors } from '../../../constants/colors';
import SubmitButton from '../buttons/SubmitButton';
import CustomTextInput from '../input/CustomTextInput';
import FormsFooter from './FormsFooter';

const SignupForm = ({ setIsSignupContent, isSignupContent }) => {
  const handleRegister = () => {
    console.log('Register');
  };
  return (
    <>
      <CustomTextInput
        label={'First Name'}
        icon={'person-outline'}
        size={24}
        color={colors.grey}
        iconPack={Ionicons}
        keyboardType="default"
      />
      <CustomTextInput
        label={'Last Name'}
        icon={'person-outline'}
        size={24}
        color={colors.grey}
        iconPack={Ionicons}
        keyboardType="default"
      />
      <CustomTextInput
        label={'Email'}
        icon={'mail-outline'}
        size={24}
        color={colors.grey}
        iconPack={Ionicons}
        keyboardType="email-address"
      />
      <CustomTextInput
        label={'Password'}
        icon={'lock-closed-outline'}
        size={24}
        color={colors.grey}
        iconPack={Ionicons}
        secureTextEntry={true}
      />

      <SubmitButton
        label={'Sign up'}
        // disabled={true}
        onPress={handleRegister}
        additionalStyle={{ marginTop: 20 }}
      />
      <FormsFooter
        footer={'Already have an account? Signin'}
        onPress={() => setIsSignupContent(false)}
      />
    </>
  );
};

export default SignupForm;
