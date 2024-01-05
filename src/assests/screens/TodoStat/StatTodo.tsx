import React, { useState, useEffect, useCallback } from "react";
import {FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";
import EncryptedStorage from "react-native-encrypted-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StatTodo = ({ navigation, route }) => {
 const [regularCheckboxCount, setRegularCheckboxCount] = useState<Record<string, number>>({});
 const [series, setSeries] = useState<number[]>([]);
 const [alltodos, setAllTodos] = useState([]);
 const sliceColor = ["#3498db", // Blue
    "#2ecc71", // Green
    "#e74c3c", // Red
    "#f39c12", // Orange
    "#9b59b6", // Purple
    "#1abc9c", // Turquoise
    "#3498db", // Light Blue
    "#2c3e50", // Midnight Blue
    "#d35400", // Pumpkin
    "#e74c3c", // Bright Red
    "#16a085", // Green Sea
    "#8e44ad", // Wisteria
    "#f1c40f", // Sunflower
    "#2980b9", // Belize Hole
    "#27ae60"];

 const fetchData = async () => {
    try {

      let storedTodos  = await AsyncStorage.getItem('todo');
      if(storedTodos == null )
      return 
      let data = JSON.parse(storedTodos);
      // Retrieve regularCheckboxCount from local storage
      let storedCounts = await AsyncStorage.getItem('checkbox');
      console.log(["Stored Counts:",storedCounts]);
      if (storedCounts) {
        
        let counts = JSON.parse(storedCounts);
        console.log(counts);
        setRegularCheckboxCount(counts || {});
        setSeries(Object.values(counts || {}));
      }
      if (data && data.data) {
        setAllTodos(data.data);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
 };

 useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribeFocus;
 }, [navigation, route?.params?.updatedTodo]);

 useEffect(() => {
    console.log("Regular Checkbox Count:", regularCheckboxCount);

 }, [regularCheckboxCount, alltodos]);

 const renderItem = ({ item, index }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.title}: {regularCheckboxCount[index] || 0} clicks</Text>
    </View>
 );

 return (
    <View style={styles.container}>
      <View style={styles.search}>
        <Pressable onPress={() => navigation.navigate("Main", { screen: "TodoHome" })}>
          <Image style={styles.searchimg} source={require("../../Images/back.png")} />
        </Pressable>
      </View>
      <View style={styles.pie}>
        {series.length > 0 ? (
          <PieChart series={series} sliceColor={sliceColor.slice(0, series.length)} widthAndHeight={300} />
        ) : (
          <Text style={{ color: 'white' }}>No data available for the pie chart</Text>
        )}
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={alltodos.filter(todo => todo.category === "Regular")}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
 );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: "100%",
    height: "100%",
    alignItems: 'center',
    backgroundColor: 'black',
  },
  search: {
    width: "100%",
    height: "5%",
  },
  searchimg: {
    width: "10%",
    height: "22%",
    marginTop: 80,
    marginLeft: 10,
  },
  pie: {
    width: "100%",
    alignItems: 'center',
    marginTop: 110,

  },
  flatListContainer: {
    height: "50%",
    width: "100%",
    marginTop: 30,
  },
  listItem: {
    backgroundColor: '#fcaf08',
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 10,
    padding: 15
  },
  listItemText: {
    color: 'black',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Salina-Trial-Bold.ttf'

  },
});

export default StatTodo;