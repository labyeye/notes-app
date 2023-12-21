import React from "react";
import { Image,Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LottieView from "lottie-react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Start = ({navigation}) => {
    return(
        <View style={styles.container}>
            <View style={{gap:40,height:windowHeight,width:windowWidth,alignItems:'center',justifyContent:'center'}}>    
                <LottieView
                    style={{marginTop:-90,height:"30%",width:"100%",alignSelf:'center'}}  
                    source={require('../../Animations/notes.json')} autoPlay={true} loop={true}/>
                <Text style={styles.title}>Noty</Text>
                <Text style={styles.desc}>"Think, Note, Thrive."</Text>
                <TouchableOpacity style={styles.getbtn} onPress={() => navigation.navigate('HomeScreen')}>
                    <Text style={{textAlign:"center"}}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    getbtn:{
        justifyContent:"center",
        borderRadius:60,
        width:"90%",
        height:"6%",
        marginTop:50,
        backgroundColor:'white'
    },
    title:{
        color:'white',
        fontSize:40,
    },
    desc:{
        color:'white',
        fontSize:20,
    },
    container:{
        height:windowHeight,
        width:windowWidth,
        backgroundColor:'black',
        justifyContent:'center',
        alignItems:'center'

    }
})
export default Start;