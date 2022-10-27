import { Ionicons } from '@expo/vector-icons';
import { useReducer, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { signinUser } from '../../../api/auth';
import { colors } from '../../../constants/colors';
import { authenticate } from '../../../store/slices/authSlice';
import { validateInput } from '../../../utils/actions/formActions';
import { formReducer } from '../../../utils/reducers/formReducer';

import SubmitButton from '../buttons/SubmitButton';
import FormsFooter from './FormsFooter';
import CustomTextInput from '../../shared/input/CustomTextInput';
import Spinner from '../../shared/loading/Spinner';

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

  const handleLogin = async () => {
    if (!formState.isFormValid) return;

    setLoading(true);

    const { err, data } = await signinUser(values);

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
      />

      {loading ? (
        <Spinner size={'large'} />
      ) : (
        <>
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
      )}
    </>
  );
};

export default SigninForm;
