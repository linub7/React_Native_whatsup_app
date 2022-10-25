import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AuthScreen from '../screens/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import MainNavigator from './MainNavigator';

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
