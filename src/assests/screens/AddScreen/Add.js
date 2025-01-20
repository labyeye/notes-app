import LottieView from "lottie-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
const Add = ({ navigation }) => {
    return (
        <View style={styles.background}>
            <Pressable onPress={() => navigation.navigate('AddNotes')}
                style={styles.notetab}>
                <LottieView style={{ height: "80%", width: "80%", alignSelf: 'center' }}
                    source={require('../../Animations/notes.json')} autoPlay={true} loop={true} />
            </Pressable>
            <Text style={{fontSize:30,color:'white'}}>Notes</Text>
            <Pressable onPress={() => navigation.navigate('AddTodo')}
                style={styles.todotab}>
                <LottieView style={{ height: "80%", width: "80%", }}
                    source={require('../../Animations/todo.json')} autoPlay={true} loop={true} />

            </Pressable>
            <Text style={{fontSize:30,color:'white'}}>Todo</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#C4DFDF",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'center',
        gap: 30
    },
    notetab: {
        backgroundColor:'#E3F4F4',
        width: "38%",
        borderRadius:100,
        height: "20%",
        justifyContent: 'center' 
    },
    todotab: {
        backgroundColor:'#E3F4F4',
        borderRadius:100,
        width: "38%",
        height: "20%",
        alignItems:'center',
        justifyContent: 'center' 
    },
});
export default Add;