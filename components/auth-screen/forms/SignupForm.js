import { useReducer, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../../../constants/colors';
import { validateInput } from '../../../utils/actions/formActions';
import { formReducer } from '../../../utils/reducers/formReducer';
import SubmitButton from '../buttons/SubmitButton';
import FormsFooter from './FormsFooter';
import { signupUser } from '../../../api/auth';
import { Alert } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { authenticate } from '../../../store/slices/authSlice';
import CustomTextInput from '../../shared/input/CustomTextInput';
import Spinner from '../../shared/loading/Spinner';

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

  const dispatch = useDispatch();

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

    const { success, token, user } = data;
    if (success) {
      setLoading(false);
      dispatch(authenticate({ token, userData: user }));
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          token,
          userId: user._id,
        })
      );
    }
  };
  return (
    <>
      <CustomTextInput
        id={'firstName'}
        label={'First Name'}
        value={values.firstName}
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
        value={values.lastName}
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
        value={values.email}
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
        value={values.password}
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
