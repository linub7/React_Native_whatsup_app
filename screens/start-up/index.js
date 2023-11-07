import { useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { commonStyles } from '../../constants/commonStyles';
import { useDispatch } from 'react-redux';
import { authenticate, setDidTryAutoLogin } from '../../store/slices/authSlice';
import { getUserData } from '../../utils/actions/userActions';
import Spinner from '../../components/shared/loading/Spinner';
import { colors } from '../../constants/colors';

const StartUpScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const storedAuthInfo = await AsyncStorage.getItem('userData');

      if (!storedAuthInfo) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const parsedData = JSON.parse(storedAuthInfo);
      const { userId, token } = parsedData;
      if (!token || !userId) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const data = await getUserData(token);
      dispatch(
        authenticate({
          token,
          userData: {
            _id: data?._id,
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            about: data?.about,
            imageUrl: data?.image?.url,
          },
        })
      );
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={commonStyles.center}>
      <Spinner size={'large'} color={colors.blue} />
    </View>
  );
};

export default StartUpScreen;
