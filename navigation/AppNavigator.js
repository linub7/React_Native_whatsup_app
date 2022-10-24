import { NavigationContainer } from '@react-navigation/native';
import AuthScreen from '../screens/AuthScreen';
import MainNavigator from './MainNavigator';

const AppNavigator = ({}) => {
  const isAuth = false;
  return (
    <NavigationContainer>
      {isAuth ? <MainNavigator /> : <AuthScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
