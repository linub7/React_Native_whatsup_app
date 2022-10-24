import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../constants/colors';
import SubmitButton from '../buttons/SubmitButton';
import CustomTextInput from '../input/CustomTextInput';
import FormsFooter from './FormsFooter';

const SigninForm = ({ setIsSignupContent, isSignupContent }) => {
  const handleLogin = () => {
    console.log('Sign in');
  };
  return (
    <>
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
        label={'Sign in'}
        // disabled={true}
        onPress={handleLogin}
        additionalStyle={{ marginTop: 20 }}
      />
      <FormsFooter
        footer={"Don't have an account? Signup"}
        onPress={() => setIsSignupContent(true)}
      />
    </>
  );
};

export default SigninForm;
