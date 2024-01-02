import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import doneAnimation from '../../Animations/done.json'; // Replace with the actual path

const DoneTodo = ({ navigation }) => {
  const onAnimationFinish = () => {
    // Navigate back to the previous screen (TodoHome) after animation finishes
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={doneAnimation}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  animation: {
    width: 200, // Adjust the size as needed
    height: 200,
  },
});

export default DoneTodo;
