// import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { getChatsHandler } from '../api/chat';
import ChatScreen from '../screens/chat';
import ChatListScreen from '../screens/chat-list';
import SettingsScreen from '../screens/settings';
import ChatSettingsScreen from '../screens/chat-settings';
import NewChatScreen from '../screens/new-chat';
import { getConversationsAction } from '../store/slices/chatSlice';

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
            headerTitle: 'Settings',
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
      </Stack.Group>
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { userData, token } = useSelector((state) => state.auth);
  const { storedUsers } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleGetChats = async () => {
      const { err, data } = await getChatsHandler(token);
      if (err) {
        console.log(err);
        return;
      }
      dispatch(getConversationsAction(data?.data?.data));
    };
    handleGetChats();
  }, []);

  return <StackNavigator />;
};

export default MainNavigator;
