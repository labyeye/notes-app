import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


const windowHeight  = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const LoginScreen = ({navigation}) => {
    const[email,setemail] = useState("");
    const[password,setpassword] = useState("");
    const handleLogin = async () => {
        try {
          console.log('Starting login...');
      
          // Retrieve user credentials from AsyncStorage using the entered email
          const storedUserCredentialsString = await AsyncStorage.getItem(email);
          console.log('Stored user credentials string:', storedUserCredentialsString);
      
          if (!storedUserCredentialsString) {
            console.error('Login failed: No user credentials found');
            return;
          }
      
          // Parse stored credentials
          const storedUserCredentials = JSON.parse(storedUserCredentialsString);
          console.log('Stored user credentials:', storedUserCredentials);
      
          // Ensure email and password are defined
          const enteredEmail = email ? email.trim().toLowerCase() : '';
          const enteredPassword = password ? password.trim() : '';
      
          const storedEmail = storedUserCredentials.email ? storedUserCredentials.email.trim().toLowerCase() : '';
          const storedPassword = storedUserCredentials.password ? storedUserCredentials.password.trim() : '';
      
          // Perform authentication
          if (enteredEmail === storedEmail && enteredPassword === storedPassword) {
            console.log('Authentication successful.');
      
            // For demonstration, store a user token in AsyncStorage
            await AsyncStorage.setItem('userToken', 'user_auth_token');
      
            // Navigate to the main app screen
            navigation.navigate('Main', { screen: 'HomeScreen' });
          } else {
            console.error('Login failed: Invalid credentials');
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      };
      
      

    return(
        <View style={{height:windowHeight,width:windowWidth,backgroundColor:'black',flexDirection:'column',alignItems:'center'}}>
            <LottieView 
            style={{marginTop:30,height:"30%",width:"100%",alignSelf:'center'}}  
            source={require('../../Animations/login.json')} autoPlay={true} loop={true}/>
            <Text style={styles.login}>Login</Text>
            <View style={{gap:10,width:'100%',height:'25%',alignItems:'center',justifyContent:"center"}}>
                <TextInput placeholder="Email Address"  style={styles.email} placeholderTextColor="white" value={email} onChangeText={(text) => setemail(text)}/>
                <TextInput placeholder="Password"  style={styles.password} placeholderTextColor="white" value={password} onChangeText={(text) => setpassword(text)}/>
            </View>
            <Pressable onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.register}>Not a User ? Register Here</Text>
            </Pressable>
            <TouchableOpacity style={styles.logbtn} onPress={handleLogin}>
                <Text style={{fontSize:20}}>Login</Text>
            </TouchableOpacity>

        </View>
    );
}
const styles = StyleSheet.create({
    logbtn: {
        marginTop:10,
        width: "55%",
        fontSize:20,
        height: "7%",
        borderRadius:40,
        color:'white',
        backgroundColor: 'white',
        alignItems:'center',
        justifyContent:'center'
    },
    email: {
        width: "95%",
        fontSize:20,
        padding:10,
        height: "35%",
        borderRadius:40,
        color:'white',
        borderWidth:1,
        borderColor:'white',
        backgroundColor: 'black'
    },
    password: {
        width: "95%",
        fontSize:20,
        padding:10,
        height: "35%",
        borderRadius:40,
        color:'white',
        borderWidth:1,
        borderColor:'white',
        backgroundColor: 'black'
    },
    login: {
        fontSize:30,
        height: "10%",
        color:'white',
        alignSelf:'center',
        backgroundColor: 'black'
    },
    register: {
        color:'white',
    },
})

export default LoginScreen;