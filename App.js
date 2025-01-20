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
import Add from "./src/assests/screens/AddScreen/Add";
import EditTodo from "./src/assests/screens/EditTodo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    activeColor="#4F6F52"
    inactiveColor="white"
    barStyle={{ backgroundColor: "#BFD8AF" }}
    shifting={true}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image
            source={require("./src/assests/Images/noty.png")}
            style={{ tintColor: focused ? "black" : "white" }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Add"
      component={Add}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image
            source={require("./src/assests/Images/plus.png")}
            style={{
              tintColor: focused ? "black" : "white",
              width: "50%",
              justifyContent: "center",
            }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Todo"
      component={TodoHome}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image
            source={require("./src/assests/Images/done.png")}
            style={{ tintColor: focused ? "black" : "white" }}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [initialRoute, setInitialRoute] = React.useState("Start");

  React.useEffect(() => {
    const checkStartScreenSeen = async () => {
      try {
        const startScreenSeen = await AsyncStorage.getItem("startScreenSeen");
        setInitialRoute(startScreenSeen === "true" ? "Main" : "Start");
      } catch (error) {
        console.error("Error checking start screen status:", error);
      }
    };

    checkStartScreenSeen();
  }, []);

  if (!initialRoute) {
    // Optional splash screen or loading indicator
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
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
          <Stack.Screen name="DoneTodo" component={DoneTodo} />
          <Stack.Screen name="AddTodo" component={AddTodo} />
          <Stack.Screen name="AddNotes" component={AddNotes} />
          <Stack.Screen name="EditTodo" component={EditTodo} />
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
