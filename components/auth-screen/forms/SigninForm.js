import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { colors } from '../../../constants/colors';
import { validateInput } from '../../../utils/actions/formActions';
import SubmitButton from '../buttons/SubmitButton';
import CustomTextInput from '../input/CustomTextInput';
import FormsFooter from './FormsFooter';

const SigninForm = ({ setIsSignupContent }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errorText, setErrorText] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);

  const handleInputChange = (inputId, inputValue) => {
    console.log(validateInput(inputId, inputValue));
    setValues({ ...values, [inputId]: inputValue });
  };

  console.log(values);

  const handleLogin = () => {
    console.log('Sign in');
  };
  return (
    <>
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
      />

      <SubmitButton
        label={'Sign in'}
        disabled={!formIsValid}
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
