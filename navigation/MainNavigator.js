import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ChatListScreen from '../screens/ChatListScreen';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatScreen from '../screens/ChatScreen';
import { colors } from '../constants/colors';

const Stack = createStackNavigator();
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

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="ChatSettings"
        component={ChatSettingsScreen}
        options={{
          headerTitle: 'Settings',
          headerBackTitle: 'Back',
        }}
      /> */}
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerBackTitle: 'Back',
          headerTitleAlign: 'center',
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
