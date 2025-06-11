import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import HeaderLogout from "@/utilities/HeaderLogout";

import colors from "@/assets/colors";

//screens
import ActivityScreen from "@/navigation/screens/ActivityScreen";
import BooksScreen from "@/navigation/screens/BooksScreen";
import HomeScreen from "@/navigation/screens/HomeScreen";
import StatsScreen from "@/navigation/screens/StatsScreen";

// screen names
const screens_names = {
  Home: "Home",
  Activity: "Activitys",
  Books: "Books",
  Stats: "Stats",
};

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <Tab.Navigator
      initialRouteName={screens_names.Home}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === screens_names.Home) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === screens_names.Activity) {
            iconName = focused ? 'pulse' : 'pulse-outline';
          } else if (route.name === screens_names.Books) {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === screens_names.Stats) {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
      })}
    >
      <Tab.Screen
        name={screens_names.Home}
        component={HomeScreen}
        options={{
          ...header_options,
          headerRight: () => <HeaderLogout />,
        }}
      />
      <Tab.Screen
        name={screens_names.Activity}
        component={ActivityScreen}
        options={{
          ...header_options,
          headerRight: () => <HeaderLogout />,
        }}
      />
      <Tab.Screen
        name={screens_names.Books}
        component={BooksScreen}
        options={{
          ...header_options,
          headerRight: () => <HeaderLogout />,
        }}
      />
      <Tab.Screen
        name={screens_names.Stats}
        component={StatsScreen}
        options={{
          ...header_options,
          headerRight: () => <HeaderLogout />,
        }}
      />
    </Tab.Navigator>
  );
}

const header_options = {
  headerTitleAlign: 'center',
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.background,
};