import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, View } from "react-native";

const windowHeight  = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const LoginScreen = () => {
    return(
        <View style={{height:windowHeight,width:windowWidth,backgroundColor:'black'}}>
            <LottieView 
            style={{marginTop:-90,height:"30%",width:"100%",alignSelf:'center'}}  
            source={require('../../Animations/login.json')} autoPlay={true} loop={true}/>
        </View>
    );
}

export default LoginScreen;