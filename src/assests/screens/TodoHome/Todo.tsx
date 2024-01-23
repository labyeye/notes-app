import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Image, Dimensions, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import StatTodo from "../TodoStat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const TodoHome = ({ navigation }) => {
  const [showDoneAnimation, setShowDoneAnimation] = React.useState(false);
  const isFocused = useIsFocused();
  const [noteColors, setNoteColors] = useState({});
  const [regularCheckboxCount, setRegularCheckboxCount] = useState<{ [key: string]: number }>({});
  const [alltodos, setAllTodos] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);

  useEffect(() => {
    if (Object.keys(regularCheckboxCount).length > 0) {
      navigation.setParams({
        regularCheckboxCount: regularCheckboxCount,
      });
      AsyncStorage.setItem('checkbox', JSON.stringify(regularCheckboxCount));
    }
  }, [regularCheckboxCount]);

  
  



  const handledone = async (category, index) => {
    setShowDoneAnimation(true);
    setTimeout(() => {
      setShowDoneAnimation(false);
      if (category === "Regular") {
        setRegularCheckboxCount((prevCounts) => {
          const updatedCounts = { ...prevCounts, [index]: (prevCounts[index] || 0) + 1 };
          return updatedCounts;
        });
  
        // Add the marked todo to the 0 screen
        const updatedTodo = alltodos.find((todo, i) => todo.category === "Regular" && i === index);
        navigation.navigate("StatTodo", { updatedTodo });
      }
    }, 10);
  
    try {
      // Retrieve the updated todos from AsyncStorage
      const storedTodos = await AsyncStorage.getItem('todo');
      let data = JSON.parse(storedTodos);
  
      if (data && data.data) {
        setAllTodos(data.data);
        setFilteredTodos(data.data);
      }
    } catch (error) {
      console.error("Error retrieving todos:", error);
    }
  };
  
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setCheckedItems({});
    });

    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  const handleCheckboxPress = (index, category) => {
    const key = `${category}_${index}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDelete = async (index, category) => {
    try {
      const filteredTodos = alltodos.filter(todo => todo.category === category);
      const updatedTodos = [...filteredTodos];
      updatedTodos.splice(index, 1);
      const newAllTodos = alltodos.filter(todo => todo.category !== category);
      const finalTodos = newAllTodos.concat(updatedTodos);
      setAllTodos(finalTodos);
      await AsyncStorage.setItem('todo', JSON.stringify({ data: finalTodos }));
      setFilteredTodos(finalTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };





  useEffect(() => {
    if (isFocused) {
      getAllTodos();
    }
  }, [isFocused]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredList = alltodos.filter(todo =>
      todo.title.toLowerCase().includes(query.toLowerCase()) ||
      todo.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTodos(filteredList);
  };

  const getAllTodos = async () => {
    try {
      let storedTodos = await AsyncStorage.getItem('todo');
      let data = JSON.parse(storedTodos);

      if (data && data.data) {
        setAllTodos(data.data);
        setFilteredTodos(data.data);
      }
    } catch (error) {
      console.error("Error retrieving todos:", error);
    }
  };


  const renderItem = ({ item, index }) => {
    const isChecked = checkedItems[`${item.category}_${index}`] || false;
    const backgroundColor = item.category === "Regular" ? "#fb8500" : "#ffb703";
    return (
      <TouchableOpacity>
        <View style={styles.notetab}>
          <View style={{ width: "99%", height: "100%", flexDirection: "row", alignSelf: 'center' }}>
            <View style={{ justifyContent: "center", height: "100%", alignItems: "center", width: '20%', alignSelf: 'flex-start' }}>
              <BouncyCheckbox
                size={25}
                fillColor="black"
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "black" }}
                innerIconStyle={{ borderWidth: 2 }}
                onPress={() => {
                  handleCheckboxPress(index, item.category);
                  handledone(item.category, index);
                }}
                isChecked={checkedItems[`${item.category}_${index}`]}
              />
            </View>
            <View style={{ justifyContent: 'center', width: "60%", height: '100%', alignSelf: 'center', }}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
            <Pressable
              style={{ justifyContent: 'center', alignItems: 'flex-end',height:"100%",width:"0%"}}
              onPress={() => handleDelete(index, item.category)}>
              <Image style={styles.delete} source={require('../../Images/bin.png')} />
            </Pressable>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.background}>
      <View style={styles.searchtab}>
        <Pressable onPress={() => navigation.navigate("StatTodo")}>
          <Image style={styles.searchimg} source={require('../../Images/graph.png')} />
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          textAlign="center"
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
        />

      </View>
      <View style={{ width: "100%", flexDirection: 'row', alignItems: 'flex-start', marginLeft: 30, marginTop: 20 }}>
        <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>Regular Todos</Text>
      </View>
      <View style={styles.noteback}>
        <FlatList
          data={filteredTodos.filter(todo => todo.category === "Regular")}
          renderItem={renderItem}
          keyExtractor={(item, index) => `Regular_${index}`}
        />
      </View>
      <View style={{ width: "100%", flexDirection: 'row', alignItems: 'flex-start', marginLeft: 30, marginTop: 10 }}>
        <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>Occasional Todos</Text>
      </View>
      <View style={styles.noteback}>
        <FlatList
          data={filteredTodos.filter(todo => todo.category === "Occasional")}
          renderItem={renderItem}
          keyExtractor={(item, index) => `Occasional_${index}`}
        />
      </View>
      <View>
        <BannerAd
          unitId={Platform.OS === 'ios'
            ? 'ca-app-pub-6119758783032593/4124837401'
            : null}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
      <StatTodo regularCheckboxCount={regularCheckboxCount} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%",
    backgroundColor: '#99BC85',
    flexDirection: 'column',
    alignItems: 'center',
  },
  notetab: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    backgroundColor: "#E1F0DA",
    width: "100%",
  },
  delete: {
    position: 'absolute',
    width: 25,
    height: 30,
  },
  title: {
    width: "100%",
    height: "100%",
    marginLeft: 10,
    fontSize: 25,

  },
  desc: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 20
  },
  plusimg: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  searchimg: {
    width: 20,
    height: 20,

  },
  input: {
    width: "85%",
    height: "60%",
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 20,
    marginLeft: 5,
    color: 'white'
  },
  searchtab: {
    width: wp('100%'),
    height: hp('10%'),
    marginTop: hp('5%'),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp('5%'), // Adjust the paddingHorizontal value as needed
    alignItems: "center",
  },
  checkbox: {
    width: 30,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
    marginTop: 35,
    marginLeft: 10
  },
  checkedCheckbox: {
    backgroundColor: "white",
  },
  noteback: {
    height: "40%",
    width: "100%",
    marginTop: 10,
    alignItems: 'center'
  }
});

export default TodoHome;