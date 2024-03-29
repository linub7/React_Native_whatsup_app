import 'react-native-gesture-handler';
import { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { io } from 'socket.io-client';
import { MenuProvider } from 'react-native-popup-menu';
import ToastManager from 'toastify-react-native';

import {
  APP_DEVELOPMENT,
  APP_BACKEND_DEVELOPMENT_URL,
  APP_BACKEND_PRODUCTION_URL,
} from '@env';
import AppNavigator from './navigation/AppNavigator';
import { store } from './store';
import SocketContext from './context/SocketContext';

SplashScreen.preventAutoHideAsync();

const socket = io(
  APP_DEVELOPMENT ? APP_BACKEND_DEVELOPMENT_URL : APP_BACKEND_PRODUCTION_URL
);

export default function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          black: require('./assets/fonts/Roboto-Black.ttf'),
          blackItalic: require('./assets/fonts/Roboto-BlackItalic.ttf'),
          bold: require('./assets/fonts/Roboto-Bold.ttf'),
          boldItalic: require('./assets/fonts/Roboto-BoldItalic.ttf'),
          italic: require('./assets/fonts/Roboto-Italic.ttf'),
          light: require('./assets/fonts/Roboto-Light.ttf'),
          lightItalic: require('./assets/fonts/Roboto-LightItalic.ttf'),
          medium: require('./assets/fonts/Roboto-Medium.ttf'),
          mediumItalic: require('./assets/fonts/Roboto-MediumItalic.ttf'),
          regular: require('./assets/fonts/Roboto-Regular.ttf'),
          thin: require('./assets/fonts/Roboto-Thin.ttf'),
          thinItalic: require('./assets/fonts/Roboto-ThinItalic.ttf'),
        });
      } catch (err) {
        console.log(err);
      } finally {
        setAppIsLoaded(true);
      }
    };

    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (appIsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsLoaded]);

  if (!appIsLoaded) return null;

  return (
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <SafeAreaProvider style={styles.container} onLayout={onLayout}>
          <MenuProvider>
            <ToastManager />
            <AppNavigator />
          </MenuProvider>
        </SafeAreaProvider>
      </SocketContext.Provider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'regular',
  },
});
