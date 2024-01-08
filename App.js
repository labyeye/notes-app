import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./src/assests/screens/Home/HomeScreen";
import Start from "./src/assests/screens/Start";
import EditNotesScreen from "./src/assests/screens/EditNotes/EditNotes";
import TodoHome from "./src/assests/screens/TodoHome";
import AddNotes from "./src/assests/screens/AddNotes/AddNotes";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AddTodo from "./src/assests/screens/AddTodo/AddTodo";
import EditTodo from "./src/assests/screens/EditTodo";
import StatTodo from "./src/assests/screens/TodoStat/StatTodo";
import { AuthProvider } from "./AuthContext";
import { navigationRef } from "./navigationRef";
import DoneTodo from "./src/assests/screens/DoneTodo/DoneTodo";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{
    tabBarStyle: {backgroundColor:'black'}}}>
    <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image source={require('./src/assests/Images/noty.png')} style={{ tintColor: focused ? 'white' : 'white' }} />
          ),
        }}
      />
    
    <Tab.Screen name="Todo" component={TodoHome} options={{
      headerShown: false,
      tabBarIcon: ({ focused }) => {
        return (
          <Image source={require('./src/assests/Images/done.png')} 
          style={{ tintColor: focused ? 'white' : 'white' }}/>
        );
      }
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
  
          <Stack.Screen name="EditNotesScreen" component={EditNotesScreen} />
          <Stack.Screen name="EditTodo" component={EditTodo} />
          <Stack.Screen name="AddTodo" component={AddTodo} />  
          <Stack.Screen name="StatTodo" component={StatTodo} /> 
          <Stack.Screen name="DoneTodo" component={DoneTodo} />  
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

const styles=StyleSheet.create({
  shadow:{

  }
});

export default App;