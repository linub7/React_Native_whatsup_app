import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { colors } from '../../../constants/colors';
import { validateInput } from '../../../utils/actions/formActions';
import SubmitButton from '../buttons/SubmitButton';
import CustomTextInput from '../input/CustomTextInput';
import FormsFooter from './FormsFooter';

const SignupForm = ({ setIsSignupContent }) => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errorText, setErrorText] = useState(null);

  const handleInputChange = (inputId, inputValue) => {
    console.log(validateInput(inputId, inputValue));
    setValues({ ...values, [inputId]: inputValue });
  };

  console.log(values);

  const handleRegister = () => {
    console.log('Register');
  };
  return (
    <>
      <CustomTextInput
        id={'firstName'}
        label={'First Name'}
        icon={'person-outline'}
        size={24}
        color={colors.grey}
        iconPack={Ionicons}
        keyboardType="default"
        handleInputChange={handleInputChange}
        errorText={errorText}
        setErrorText={setErrorText}
      />
      <CustomTextInput
        id={'lastName'}
        label={'Last Name'}
        icon={'person-outline'}
        size={24}
        color={colors.grey}
        iconPack={Ionicons}
        keyboardType="default"
        handleInputChange={handleInputChange}
        errorText={errorText}
        setErrorText={setErrorText}
      />
      <CustomTextInput
        id={'email'}
        label={'Email'}
        icon={'mail-outline'}
        size={24}
        color={colors.grey}
        iconPack={Ionicons}
        keyboardType="email-address"
        handleInputChange={handleInputChange}
        errorText={errorText}
        setErrorText={setErrorText}
      />
      <CustomTextInput
        id={'password'}
        label={'Password'}
        icon={'lock-closed-outline'}
        size={24}
        color={colors.grey}
        iconPack={Ionicons}
        secureTextEntry={true}
        handleInputChange={handleInputChange}
        errorText={errorText}
        setErrorText={setErrorText}
        autoCapitalize="none"
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
