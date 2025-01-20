import React, { useState, useEffect } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StatTodo = ({ navigation, route }) => {
  const [regularCheckboxCount, setRegularCheckboxCount] = useState({});
  const [series, setSeries] = useState([]);

  const [alltodos, setAllTodos] = useState([]);
  const sliceColor = [
    "#FF0000", "#FF4500", "#FFA500", "#FFFF00", "#ADFF2F",
    "#32CD32", "#008000", "#006400", "#00FFFF", "#00BFFF",
    "#0000FF", "#8A2BE2", "#4B0082", "#800080", "#FF00FF",
    "#FF1493", "#FF69B4", "#FFC0CB", "#FFD700", "#FFFFE0",
    "#EEE8AA", "#F0E68C", "#DAA520", "#B8860B"
  ];
  
  const fetchData = async () => {
    try {
      let storedTodos = await AsyncStorage.getItem('todo');
      if (storedTodos == null)
        return
      let data = JSON.parse(storedTodos);
      let storedCounts = await AsyncStorage.getItem('checkbox');
      console.log(["Stored Counts:", storedCounts]);

      if (storedCounts) {
        let counts = JSON.parse(storedCounts);
        console.log(counts);
        setRegularCheckboxCount(counts || {});
        setSeries(Object.values(counts || {}));
      } else {
        setRegularCheckboxCount({});
        setSeries([]);
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
      <Text style={styles.listItemText}>{item.title}: {regularCheckboxCount[index] || 0} Times Done</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <View style={{width:"15%"}}>
        <Pressable onPress={() => navigation.navigate("Main", { screen: "TodoHome" })}>
          <Image style={styles.searchimg} source={require("../../Images/back.png")} />
        </Pressable>
        </View>
        <View style={{width:"100%",marginLeft:70}}>
        <Text style={{ color: '#579BB1', fontSize: 20 ,alignSelf:'center'}}>Statistics Screen</Text>
      </View>
      </View>
      
      <View style={styles.pie}>
        {series.length > 0 ? (
          <PieChart series={series} sliceColor={sliceColor.slice(0, series.length)} widthAndHeight={300} />
        ) : (
          <Text style={{ color: '#579BB1' }}>No data available for the pie chart</Text>
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
    backgroundColor: '#C4DFDF',
  },
  search: {
    width: "50%",
    height: "4%",
    flexDirection: 'row',
    marginTop: 80,
  },
  searchimg: {
    width: "100%",
    height: "100%",
    marginLeft: 20,
  },
  pie: {
    width: "100%",
    alignItems: 'center',
    marginTop: 60,

  },
  flatListContainer: {
    height: "50%",
    width: "100%",
    marginTop: 30,
  },
  listItem: {
    backgroundColor: "#579BB1",
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
