import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";

const StatTodo = ({ navigation }) => {
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']

    return (
        <View style={styles.container}>
            <View style={styles.searchtab}>
                <Pressable onPress={() => navigation.navigate("StatTodo")}>
                    <Image style={styles.searchimg} source={require('../../Images/graph.png')} />
                </Pressable>
            </View>
            <View style={styles.pie}>
                <PieChart series={series} sliceColor={sliceColor} widthAndHeight={250} />
            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black'
    },
    searchtab: {
        width: "100%",
        height: "5%",
        marginTop: 60,
        flexDirection: "row",
        alignItems: "center",
        borderColor: 'white',
        borderWidth: 1
    },
    title: {
        fontSize: 24,
        margin: 50,
        color: 'white'
    },
    pie: {
        width: "100%",
        alignItems: 'center',
        marginTop: 20,
        borderColor: 'white',
        borderWidth: 1
    },
    searchimg: {
        width: 20,
        height: 20,
        marginLeft: 30,

    },
})
export default StatTodo;