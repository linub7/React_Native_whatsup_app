import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import MainNavigator from './MainNavigator';
import AuthScreen from '../screens/auth';
import StartUpScreen from '../screens/start-up';

const AppNavigator = ({}) => {
  const { token, didTryAutoLogin } = useSelector((state) => state.auth);
  const isAuth = token !== null && token !== '' ? true : false;

  return (
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && didTryAutoLogin && <AuthScreen />}
      {!isAuth && !didTryAutoLogin && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
