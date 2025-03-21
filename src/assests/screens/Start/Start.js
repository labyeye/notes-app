import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Animated } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const Start = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [buttonAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    checkIfStartScreenSeen().then((startScreenSeen) => {
      if (startScreenSeen) {
        navigation.replace('Main', { screen: 'HomeScreen' });
      } else {
        // Start animations when component mounts
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(buttonAnim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }
    });
  }, [navigation, fadeAnim, slideAnim, buttonAnim]);

  const checkIfStartScreenSeen = async () => {
    try {
      const startScreenSeen = await AsyncStorage.getItem('startScreenSeen');
      return startScreenSeen === 'true';
    } catch (error) {
      console.error('Error checking start screen status:', error);
      return false;
    }
  };

  const markStartScreenAsSeen = async () => {
    try {
      await AsyncStorage.setItem('startScreenSeen', 'true');
    } catch (error) {
      console.error('Error setting start screen status:', error);
    }
  };

  const handleGetStarted = async () => {
    // Scale animation on button press
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      await markStartScreenAsSeen();
      navigation.replace('Main', { screen: 'HomeScreen' });
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <LottieView
            style={styles.lottieAnimation}
            source={require('../../Animations/notes.json')}
            autoPlay={true}
            loop={true}
          />
        </View>
        
        <View style={styles.textContainer}>
          <Animated.Text 
            style={[
              styles.title,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            Note Sphere
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.desc,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            "Think, Note, Thrive."
          </Animated.Text>
        </View>
        
        <View style={styles.featureContainer}>
          <FeatureItem 
            icon={require('../../Images/bin.png')} 
            text="Organize your notes" 
            delay={100}
          />
          <FeatureItem 
            icon={require('../../Images/bin.png')} 
            text="Categorize by topics" 
            delay={200}
          />
          <FeatureItem 
            icon={require('../../Images/bin.png')} 
            text="Search instantly" 
            delay={300}
          />
        </View>
        
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: buttonAnim,
              transform: [{ scale: buttonAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.getStartedButton}
            activeOpacity={0.8}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// Feature item component
const FeatureItem = ({ icon, text, delay }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, slideAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.featureItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.featureIcon} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: hp('8%'),
    paddingHorizontal: wp('5%'),
  },
  logoContainer: {
    height: hp('25%'),
    width: wp('70%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  lottieAnimation: {
    height: '100%',
    width: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: hp('5%'),
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  desc: {
    fontSize: 18,
    color: '#579BB1',
    fontWeight: '500',
    marginBottom: hp('3%'),
  },
  featureContainer: {
    width: wp('90%'),
    marginBottom: hp('5%'),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    backgroundColor: '#E8F4F8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureIcon: {
    width: 20,
    height: 20,
    tintColor: '#579BB1',
  },
  featureText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  buttonContainer: {
    width: wp('90%'),
    alignItems: 'center',
    position: 'absolute',
    bottom: hp('5%'),
  },
  getStartedButton: {
    backgroundColor: '#579BB1',
    width: '100%',
    height: hp('7%'),
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Start;