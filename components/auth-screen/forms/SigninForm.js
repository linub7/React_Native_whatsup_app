import { Ionicons } from '@expo/vector-icons';
import { useCallback, useReducer, useState } from 'react';

import { colors } from '../../../constants/colors';
import { validateInput } from '../../../utils/actions/formActions';
import { formReducer } from '../../../utils/reducers/formReducer';
import SubmitButton from '../buttons/SubmitButton';
import CustomTextInput from '../input/CustomTextInput';
import FormsFooter from './FormsFooter';

const initialState = {
  inputValidities: {
    email: false,
    password: false,
  },
  isFormValid: false,
};

const SigninForm = ({ setIsSignupContent }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errorText, setErrorText] = useState(null);
  const [formState, dispatchFormState] = useReducer(formReducer, initialState);

  const handleInputChange = useCallback(
    (inputId, inputValue) => {
      const validationResult = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult,
      });
      setValues({ ...values, [inputId]: inputValue });
    },
    [dispatchFormState]
  );

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
        disabled={!formState.isFormValid}
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
