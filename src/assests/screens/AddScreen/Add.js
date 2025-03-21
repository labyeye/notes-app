import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  Animated,
  Image
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const Add = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  useEffect(() => {
    // Fade in and scale up animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    
    // Small animation feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
    
    // Navigate after a small delay for animation
    setTimeout(() => {
      navigation.navigate(option === 'notes' ? 'AddNotes' : 'AddTodo');
      setSelectedOption(null);
    }, 200);
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Action</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <Pressable
          onPress={() => handleOptionPress('notes')}
          style={({pressed}) => [
            styles.optionCard,
            styles.notesCard,
            pressed && styles.cardPressed,
            selectedOption === 'notes' && styles.selectedCard
          ]}
        >
          <View style={styles.lottieContainer}>
            <LottieView 
              style={styles.lottieAnimation}
              source={require('../../Animations/notes.json')} 
              autoPlay={true} 
              loop={true} 
            />
          </View>
          <Text style={styles.optionTitle}>Notes</Text>
          <Text style={styles.optionDescription}>
            Create and manage your important notes
          </Text>
          <View style={styles.iconContainer}>
            <Image 
              source={require('../../Images/graph.png')} 
              style={styles.optionIcon}
            />
          </View>
        </Pressable>

        <Pressable
          onPress={() => handleOptionPress('todo')}
          style={({pressed}) => [
            styles.optionCard, 
            styles.todoCard,
            pressed && styles.cardPressed,
            selectedOption === 'todo' && styles.selectedCard
          ]}
        >
          <View style={styles.lottieContainer}>
            <LottieView 
              style={styles.lottieAnimation}
              source={require('../../Animations/todo.json')} 
              autoPlay={true} 
              loop={true} 
            />
          </View>
          <Text style={styles.optionTitle}>Todo</Text>
          <Text style={styles.optionDescription}>
            Track your tasks and boost productivity
          </Text>
          <View style={styles.iconContainer}>
            <Image 
              source={require('../../Images/bin.png')} 
              style={[styles.optionIcon, { opacity: 0.7 }]}
            />
          </View>
        </Pressable>
      </View>

      <View style={styles.adContainer}>
        <BannerAd
          unitId={Platform.OS === 'ios' ? 'ca-app-pub-6119758783032593/4124837401' : null}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  header: {
    width: wp('100%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('6%'),
    paddingBottom: hp('2%'),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('2%'),
  },
  optionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
    gap: hp('4%'),
  },
  optionCard: {
    width: wp('85%'),
    height: hp('25%'),
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  notesCard: {
    backgroundColor: '#FFE8CC',
  },
  todoCard: {
    backgroundColor: '#CCEDFF',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: '#579BB1',
  },
  lottieContainer: {
    position: 'absolute',
    right: -wp('5%'),
    bottom: -hp('5%'),
    width: wp('40%'),
    height: hp('40%'),
    opacity: 0.8,
    zIndex: 0,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  optionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    zIndex: 1,
  },
  optionDescription: {
    fontSize: 16,
    color: '#555',
    maxWidth: '70%',
    zIndex: 1,
  },
  iconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 8,
  },
  optionIcon: {
    width: 20,
    height: 20,
  },
  adContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  }
});

export default Add;