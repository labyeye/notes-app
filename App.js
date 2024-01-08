import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "./src/assests/screens/Home/HomeScreen";
import Start from "./src/assests/screens/Start";
import TodoHome from "./src/assests/screens/TodoHome";
import { Image, StyleSheet } from "react-native";
import StatTodo from "./src/assests/screens/TodoStat/StatTodo";
import DoneTodo from "./src/assests/screens/DoneTodo/DoneTodo";
import AddNotes from "./src/assests/screens/AddNotes/AddNotes";

import { AuthProvider } from "./AuthContext";
import { navigationRef } from "./navigationRef";
import EditNotesScreen from "./src/assests/screens/EditNotes/EditNotes";
import AddTodo from "./src/assests/screens/AddTodo/AddTodo";

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    activeColor="white"
    inactiveColor="gray"
    barStyle={{ backgroundColor: 'black' }}
    shifting={true}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image source={require('./src/assests/Images/noty.png')} style={{ tintColor: focused ? 'white' : 'gray' }} />
        ),
      }}
    />
    <Tab.Screen
      name="Todo"
      component={TodoHome}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image source={require('./src/assests/Images/done.png')} style={{ tintColor: focused ? 'white' : 'gray' }} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

  React.useEffect(() => {
    // Simulate a delay for the splash screen
    const timer = setTimeout(() => {
      setHideSplashScreen(false);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Start"
            component={Start}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="StatTodo" component={StatTodo} />
          <Stack.Screen name="AddNotes" component={AddNotes} />
          <Stack.Screen name="DoneTodo" component={DoneTodo} />
          <Stack.Screen name="AddTodo" component={AddTodo} />

          <Stack.Screen name="EditNotesScreen" component={EditNotesScreen} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  shadow: {},
});

export default App;
