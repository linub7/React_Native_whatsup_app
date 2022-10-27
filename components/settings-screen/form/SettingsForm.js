import { useEffect, useReducer, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../../../constants/colors';
import { validateInput } from '../../../utils/actions/formActions';
import { formReducer } from '../../../utils/reducers/formReducer';
import CustomTextInput from '../../shared/input/CustomTextInput';
import Spinner from '../../shared/Spinner';
import SubmitButton from '../../auth-screen/buttons/SubmitButton';
import { logoutUser, updateUserInfo } from '../../../api/auth';
import { authenticate, logout } from '../../../store/slices/authSlice';

const initialState = {
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    about: false,
  },
  isFormValid: false,
};

const SettingsForm = () => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    about: '',
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { userData, token } = useSelector((state) => state.auth);

  useEffect(() => {
    setValues({
      ...values,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
      about: userData?.about,
    });

    return () => {
      setValues({
        firstName: '',
        lastName: '',
        email: '',
      });
    };
  }, [userData]);

  const [formState, dispatchFormState] = useReducer(formReducer, initialState);

  const handleInputChange = (inputId, inputValue) => {
    const validationResult = validateInput(inputId, inputValue);
    dispatchFormState({
      inputId,
      validationResult,
    });

    setValues({ ...values, [inputId]: inputValue });
  };

  const isUpdateButtonDisabled =
    !values?.firstName || !values.lastName || !values.email;

  const handleUpdate = async () => {
    const { firstName, lastName, email, about } = values;
    setLoading(true);
    const { err, data } = await updateUserInfo(
      {
        firstName,
        lastName,
        email,
        about,
      },
      token
    );

    if (err) {
      console.log(err);
      setLoading(false);
      Alert.alert('OOPS!', err?.error);
      return;
    }

    const { user, success } = data;
    if (success) {
      setLoading(false);
      Alert.alert('Well Done', 'Your profile updated Successfully ✅');
      dispatch(authenticate({ token, userData: user }));
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    await AsyncStorage.clear();
    dispatch(logout());
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
        id={'about'}
        label={'about'}
        value={values.about}
        icon={'book-outline'}
        size={24}
        color={colors.grey}
        iconPack={Ionicons}
        keyboardType="default"
        handleInputChange={handleInputChange}
        errorText={formState.inputValidities['about']}
      />

      {loading ? (
        <Spinner size={'large'} />
      ) : (
        <>
          <SubmitButton
            label={'Update'}
            disabled={isUpdateButtonDisabled}
            onPress={handleUpdate}
            additionalStyle={{ marginTop: 20 }}
          />
        </>
      )}
      <SubmitButton
        label={'Logout'}
        onPress={handleLogout}
        color={colors.red}
        additionalStyle={{ marginTop: 20 }}
      />
    </>
  );
};

export default SettingsForm;
