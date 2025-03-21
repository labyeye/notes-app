import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "./src/assests/screens/Home/HomeScreen";
import Start from "./src/assests/screens/Start";
import TodoHome from "./src/assests/screens/TodoHome";
import { Image, StyleSheet, View, Platform, Dimensions } from "react-native";
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

const { width } = Dimensions.get('window');

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    activeColor="#D2E9E9"
    inactiveColor="#FFFFFF"
    labeled={true}
    shifting={true}
    barStyle={styles.tabBar}
    sceneAnimationEnabled={true}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
            <Image
              source={require("./src/assests/Images/noty.png")}
              style={[
                styles.tabIcon,
                { tintColor: focused ? "#4F6F52" : "white" }
              ]}
              resizeMode="contain"
            />
          </View>
        ),
        tabBarColor: "#D2E9E9"
      }}
    />
    <Tab.Screen
      name="Add"
      component={Add}
      options={{
        tabBarIcon: ({ focused }) => (
          <View style={styles.addIconContainer}>
            <Image
              source={require("./src/assests/Images/plus.png")}
              style={[
                styles.addIcon,
                { tintColor: "white" }
              ]}
              resizeMode="contain"
            />
          </View>
        ),
        tabBarColor: "#D2E9E9"
      }}
    />
    <Tab.Screen
      name="Todo"
      component={TodoHome}
      options={{
        tabBarIcon: ({ focused }) => (
          <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
            <Image
              source={require("./src/assests/Images/done.png")}
              style={[
                styles.tabIcon,
                { tintColor: focused ? "#4F6F52" : "white" }
              ]}
              resizeMode="contain"
            />
          </View>
        ),
        tabBarColor: "#D2E9E9"
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [initialRoute, setInitialRoute] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkStartScreenSeen = async () => {
      try {
        const startScreenSeen = await AsyncStorage.getItem("startScreenSeen");
        setInitialRoute(startScreenSeen === "true" ? "Main" : "Start");
      } catch (error) {
        console.error("Error checking start screen status:", error);
        setInitialRoute("Start"); // Default to Start screen on error
      } finally {
        setIsLoading(false);
      }
    };

    checkStartScreenSeen();
  }, []);

  if (isLoading || !initialRoute) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#EFF6FF' }
          }}
        >
          <Stack.Screen name="Start" component={Start} />
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
  tabBar: {
    backgroundColor: "#D2E9E9",
    height: 55,
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: "transparent",
    justifyContent: "center",
    paddingBottom: 5,
  },
  iconContainer: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  addIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#579BB1',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    borderWidth: 3,
    borderColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addIcon: {
    width: 32,
    height: 32,
  }
});

export default App;