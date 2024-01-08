import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const Start = ({ navigation }) => {
  

  const checkIfStartScreenSeen = async () => {
    try {
      const startScreenSeen = await AsyncStorage.getItem('startScreenSeen');
      return startScreenSeen === 'true';
    } catch (error) {
      console.error('Error checking start screen status:', error);
      return false;
    }
  };


  useEffect(() => {
    // Check if the start screen has been seen before
    checkIfStartScreenSeen().then((startScreenSeen) => {
      if (startScreenSeen) {
        // If seen before, remove the Start screen from the navigation stack
        navigation.replace('Main', { screen: 'HomeScreen' });
      }
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={{ gap: 40, height: windowHeight, width: windowWidth, alignItems: 'center', justifyContent: 'center' }}>
        <LottieView
          style={{ marginTop: -90, height: "30%", width: "100%", alignSelf: 'center' }}
          source={require('../../Animations/notes.json')} autoPlay={true} loop={true} />
        <Text style={styles.title}>Note Sphere</Text>
        <Text style={styles.desc}>"Think, Note, Thrive."</Text>
        <TouchableOpacity style={styles.getbtn} onPress={() => navigation.navigate('Main', { screen: 'HomeScreen' })}>
          <Text style={{ textAlign: "center" }}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  getbtn: {
    justifyContent: "center",
    borderRadius: 60,
    width: "90%",
    height: "6%",
    marginTop: 50,
    backgroundColor: '#8ecae6'
  },
  title: {
    color: 'white',
    fontSize: 40,
  },
  desc: {
    color: 'white',
    fontSize: 20,
  },
  container: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: '#023047',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Start;
