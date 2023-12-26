import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // Perform registration logic (e.g., validation, server communication)
  
      // For demonstration, store user credentials in AsyncStorage
      const userCredentials = { name, email, password };
  
      // Retrieve existing user data from AsyncStorage
      const existingDataString = await AsyncStorage.getItem('allUserCredentials');
      let allUserCredentials = existingDataString ? JSON.parse(existingDataString) : [];
  
      // Add the new user to the array
      allUserCredentials.push(userCredentials);
  
      // Update the AsyncStorage with the new array of user data
      await AsyncStorage.setItem('allUserCredentials', JSON.stringify(allUserCredentials));
  
      // Navigate to the login screen
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration error (show error message to the user)
    }
  };
  
  
  

  return (
    <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'black', flexDirection: 'column', alignItems: 'center' }}>
      <LottieView
        style={{ marginTop: 30, height: "30%", width: "100%", alignSelf: 'center' }}
        source={require('../../Animations/register.json')} autoPlay={true} loop={true} />
      <Text style={styles.login}>Register</Text>
      <View style={{ gap: 10, width: '100%', height: '30%', alignItems: 'center', justifyContent: "center", marginTop: -30 }}>
        <TextInput placeholder="Name" style={styles.email} placeholderTextColor="white" value={name} onChangeText={setName} />
        <TextInput placeholder="Email Address" style={styles.email} placeholderTextColor="white" value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" style={styles.password} placeholderTextColor="white" value={password} onChangeText={setPassword} />
      </View>
      <Pressable onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.register}>Already a User? Login Here</Text>
      </Pressable>
      <TouchableOpacity style={styles.regbtn} onPress={handleRegister}>
        <Text style={{ fontSize: 20 }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  email: {
    width: "95%",
    fontSize: 20,
    padding: 10,
    height: "25%",
    borderRadius: 40,
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black'
  },
  regbtn: {
    marginTop: 10,
    width: "55%",
    fontSize: 20,
    height: "7%",
    borderRadius: 40,
    color: 'white',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  password: {
    width: "95%",
    fontSize: 20,
    padding: 10,
    height: "25%",
    borderRadius: 40,
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black'
  },
  login: {
    fontSize: 30,
    height: "10%",
    color: 'white',
    alignSelf: 'center',
    backgroundColor: 'black'
  },
  register: {
    color: 'white',
  },
});

export default RegisterScreen;