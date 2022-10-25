import { useReducer, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../constants/colors';
import { validateInput } from '../../../utils/actions/formActions';
import { formReducer } from '../../../utils/reducers/formReducer';
import SubmitButton from '../buttons/SubmitButton';
import CustomTextInput from '../input/CustomTextInput';
import FormsFooter from './FormsFooter';
import { signupUser } from '../../../api/auth';
import { Alert } from 'react-native';
import Spinner from '../../shared/Spinner';

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
  const [loading, setLoading] = useState(false);

  const [formState, dispatchFormState] = useReducer(formReducer, initialState);

  const handleInputChange = (inputId, inputValue) => {
    const validationResult = validateInput(inputId, inputValue);
    dispatchFormState({
      inputId,
      validationResult,
    });

    setValues({ ...values, [inputId]: inputValue });
  };

  const handleRegister = async () => {
    if (!formState.isFormValid) return;

    setLoading(true);

    const { err, data } = await signupUser(values);

    if (err) {
      console.log(err);
      setLoading(false);
      Alert.alert('OOPS!', err?.error);
      return;
    }

    console.log(data);
    setLoading(false);
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
        errorText={formState.inputValidities['firstName']}
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
        errorText={formState.inputValidities['lastName']}
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
        errorText={formState.inputValidities['email']}
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
        errorText={formState.inputValidities['password']}
        autoCapitalize="none"
      />

      {loading ? (
        <Spinner size={'large'} />
      ) : (
        <>
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
      )}
    </>
  );
};

export default SignupForm;
