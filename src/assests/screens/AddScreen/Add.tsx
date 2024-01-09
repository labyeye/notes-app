import LottieView from "lottie-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
const Add = ({ navigation }) => {
    return (
        <View style={styles.background}>
            <Pressable onPress={() => navigation.navigate('AddNotes')}
                style={styles.notetab}>
                <LottieView style={{ height: "100%", width: "100%", alignSelf: 'center' }}
                    source={require('../../Animations/notes.json')} autoPlay={true} loop={true} />
            </Pressable>
            <Text style={{fontSize:30,color:'white'}}>Notes</Text>
            <Pressable onPress={() => navigation.navigate('AddTodo')}
                style={styles.todotab}>
                <LottieView style={{ height: "100%", width: "100%", }}
                    source={require('../../Animations/todo.json')} autoPlay={true} loop={true} />

            </Pressable>
            <Text style={{fontSize:30,color:'white'}}>Todo</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#023047",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'center',
        gap: 30
    },
    notetab: {
        backgroundColor:'#8ecae6',
        width: "48%",
        borderRadius:100,
        height: "29%",
        borderWidth: 1,
        justifyContent: 'center' 
    },
    todotab: {
        backgroundColor:'#8ecae6',
        borderRadius:100,
        width: "48%",
        height: "29%",
        borderWidth: 1,
        justifyContent: 'center' 
    },
});
export default Add;