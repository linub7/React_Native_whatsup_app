// import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { colors } from '../constants/colors';
import { getChatsHandler } from '../api/chat';
import ChatScreen from '../screens/chat';
import ChatListScreen from '../screens/chat-list';
import SettingsScreen from '../screens/settings';
import ChatSettingsScreen from '../screens/chat-settings';
import NewChatScreen from '../screens/new-chat';
import { getConversationsAction } from '../store/slices/chatSlice';
import { commonStyles } from '../constants/commonStyles';
import ContactScreen from '../screens/contact';
import DataListScreen from '../screens/data-list';
import AddUsersScreen from '../screens/add-users';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ChatList') {
            iconName = focused
              ? 'ios-chatbubble-sharp'
              : 'ios-chatbubble-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings-sharp' : 'settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: 'gray',
        headerTitle: '',
        headerShadowVisible: false,
      })}
    >
      <BottomTabs.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ tabBarLabel: 'Chats' }}
      />
      <BottomTabs.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </BottomTabs.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatSettings"
          component={ChatSettingsScreen}
          options={{
            headerTitle: '',
            headerTitleAlign: 'center',
            headerBackTitle: 'Back',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{
            headerTitle: 'Contact Info',
            headerTitleAlign: 'center',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerBackTitle: 'Back',
            headerTitleAlign: 'center',
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="DataList"
          component={DataListScreen}
          options={{
            headerBackTitle: 'Back',
            headerTitleAlign: 'center',
            headerTitle: '',
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'containedModal' }}>
        <Stack.Screen
          name="ٔNewChatScreen"
          component={NewChatScreen}
          options={{
            headerBackTitle: 'Back',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="ٔAddUsersScreen"
          component={AddUsersScreen}
          options={{
            headerBackTitle: 'Back',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleGetChats = async () => {
      setIsLoading(true);
      const { err, data } = await getChatsHandler(token);
      if (err) {
        console.log(err);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      dispatch(getConversationsAction(data?.data?.data));
    };
    handleGetChats();
  }, []);

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       // handle received notifications
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log('Notification Tapped');
  //       console.log(response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  if (isLoading)
    return (
      <View style={commonStyles.center}>
        <ActivityIndicator size={'large'} color={colors.green} />
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StackNavigator />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

// const registerForPushNotificationsAsync = async () => {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     // Learn more about projectId:
//     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//     token = (
//       await Notifications.getExpoPushTokenAsync({
//         projectId: 'your-project-id',
//       })
//     ).data;
//   } else {
//     console.log('Must use physical device for Push Notifications');
//   }

//   return token;
// };

export default MainNavigator;
