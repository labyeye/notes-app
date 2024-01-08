import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Image, Dimensions, TextInput, FlatList, TouchableOpacity } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import StatTodo from "../TodoStat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RFValue from "react-native-responsive-fontsize";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TodoHome = ({ navigation }) => {
  const colors = ["#52D726", "#FFEC00", "#FF7300", "#FF0000", "#007ED6", "#7CDDDD"];
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
      console.log(["check", JSON.stringify(regularCheckboxCount)])
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
          console.log("Updated Counts:", updatedCounts);
          return updatedCounts;
        });

        // Add the marked todo to the 0 screen
        const updatedTodo = alltodos.find((todo, i) => todo.category === "Regular" && i === index);
        navigation.navigate("StatTodo", { updatedTodo });
        console.log(updatedTodo)
      }
    }, 10);

    try {
      const storedTodos = await AsyncStorage.getItem('todo');
      let data = JSON.parse(storedTodos);

      if (data && data.data) {
        setAllTodos(data.data);
      }
    } catch (error) {
      console.error("Error retrieving todos:", error);
    }
  };
  const getNoteColor = (index) => {
    if (noteColors[index]) {
      return noteColors[index];
    } else {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setNoteColors((prevColors) => ({ ...prevColors, [index]: randomColor }));
      return randomColor;
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
      const key = `${category}_${index}`;
      setCheckedItems((prev) => {
        const { [key]: removedKey, ...rest } = prev;
        return rest;
      });

      const filteredTodos = alltodos.filter((todo) => todo.category === category);
      const updatedTodos = [...filteredTodos];
      updatedTodos.splice(index, 1);
      const newAllTodos = alltodos.filter((todo) => todo.category !== category);
      const finalTodos = newAllTodos.concat(updatedTodos);
      setAllTodos(finalTodos);
      await AsyncStorage.setItem("todo", JSON.stringify({ data: finalTodos }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };


  useEffect(() => {
    getAllTodos();
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
    const noteColor = getNoteColor(index);
    const isChecked = checkedItems[`${item.category}_${index}`] || false;


    return (
      <TouchableOpacity>
        <View style={styles.notetab}>
          <View style={{ width: "80%", height: "100%", flexDirection: "row", alignSelf: 'center' }}>
            <View style={{ justifyContent: "center", height: "100%", alignItems: "center", width: '25%', alignSelf: 'flex-start' }}>
              <BouncyCheckbox
                size={25}
                fillColor="red"
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
            <View style={{ justifyContent: 'center', width: "60%", height: '60%', alignSelf: 'center' }}>
              <Text style={styles.title}>{item.title}</Text>
            </View>

          </View>
          
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
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
        />
        <Pressable onPress={() => navigation.navigate("AddTodo")}>
          <Image style={styles.plusimg} source={require('../../Images/plus.png')} />
        </Pressable>
      </View>
      <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>Regular Todos</Text>
      <View style={styles.noteback}>
        <FlatList
          data={filteredTodos.filter(todo => todo.category === "Regular")}
          renderItem={renderItem}
          keyExtractor={(item, index) => `Regular_${index}`}
        />
      </View>
      <Text style={{ color: 'white', fontSize: 20, marginTop: 15 }}>Occasional Todos</Text>
      <View style={styles.noteback}>
        <FlatList
          data={filteredTodos.filter(todo => todo.category === "Occasional")}
          renderItem={renderItem}
          keyExtractor={(item, index) => `Occasional_${index}`}
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
    backgroundColor: 'black',
    flexDirection: 'column',
    alignItems: 'center',
  },
  notetab: {
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#32CD32',
    width: "100%",
    gap: 20
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
    width: "65%",
    height: "60%",
    borderColor: 'gray',
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
    height: "30%",
    width: windowWidth,
    marginTop: 10
  }
});

export default TodoHome;