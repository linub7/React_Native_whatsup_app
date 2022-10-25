import { useCallback, useReducer, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../constants/colors';
import { validateInput } from '../../../utils/actions/formActions';
import { formReducer } from '../../../utils/reducers/formReducer';
import SubmitButton from '../buttons/SubmitButton';
import CustomTextInput from '../input/CustomTextInput';
import FormsFooter from './FormsFooter';

const initialState = {
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  isFormValid: false,
};

const SignupForm = ({ setIsSignupContent }) => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [formState, dispatchFormState] = useReducer(formReducer, initialState);

  const [errorText, setErrorText] = useState(null);

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
        disabled={!formState.isFormValid}
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
