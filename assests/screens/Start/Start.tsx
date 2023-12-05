import React from "react";
import { Image,Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Start = ({navigation}) => {
    return(
        <View style={styles.container}>
            <View style={{gap:40,height:windowHeight,width:windowWidth,alignItems:'center',justifyContent:'center'}}>
                <Image style={{width:"20%",height:"10%"}}source={require ('../../playstore.png')}/>
                <Text style={styles.txt}>Notes</Text>
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
        backgroundColor:'white'
    },
    txt:{
        color:'white',
        fontSize:40,
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