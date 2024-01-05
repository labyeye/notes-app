import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Image, Dimensions, TextInput, FlatList, TouchableOpacity } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import { useIsFocused } from "@react-navigation/native";
import StatTodo from "../TodoStat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TodoHome = ({ navigation }) => {
  const colors = ["#ADE8F4", "#90E0EF", "#48CAE4", "#0096C7", "#0077B6", "#CAF0F8"];
  const [showDoneAnimation, setShowDoneAnimation] = React.useState(false);
  const isFocused = useIsFocused();
  const [noteColors, setNoteColors] = useState({});
  const [regularCheckboxCount, setRegularCheckboxCount] = useState<Record<string, number>>({});
  const [alltodos, setAllTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    navigation.setParams({
      regularCheckboxCount: regularCheckboxCount,
    });
    console.log(["check",JSON.stringify(regularCheckboxCount)])
    AsyncStorage.setItem('checkbox', JSON.stringify(regularCheckboxCount));
  }, [regularCheckboxCount]);

  const handledone = async (category, index) => {
    setShowDoneAnimation(true);
    setTimeout(() => {
      setShowDoneAnimation(false);
      if (category === "Regular") {
        setRegularCheckboxCount((prevCounts) => {
          const updatedCounts = { ...prevCounts, [index]: (prevCounts[index] || 0) + 1 };
          console.log("Index",[index]);
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
  const handleDelete = async (index, category) => {
    try {
      const filteredTodos = alltodos.filter(todo => todo.category === category);
      const updatedTodos = [...filteredTodos];
      updatedTodos.splice(index, 1);
      const newAllTodos = alltodos.filter(todo => todo.category !== category);
      const finalTodos = newAllTodos.concat(updatedTodos);
      setAllTodos(finalTodos);
      await AsyncStorage.setItem('todo', JSON.stringify({ data: finalTodos }));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, [isFocused]);

  const getAllTodos = async () => {
    try {
      let storedTodos = await AsyncStorage.getItem('todo');
      let data = JSON.parse(storedTodos);

      if (data && data.data) {
        setAllTodos(data.data);
      }
    } catch (error) {
      console.error("Error retrieving todos:", error);
    }
};

  const renderItem = ({ item, index }) => {
    const noteColor = getNoteColor(index);

    return (
      <TouchableOpacity>
        <View style={[styles.notetab, { backgroundColor: noteColor }]}>
          <View style={{ width: "80%", height: "100%", flexDirection: "row",alignSelf:'center' }}>
            <View style={{ justifyContent: "center", height: "100%", alignItems: "center", width: '25%', alignSelf: 'flex-start', borderColor: 'black' }}>
              <TouchableOpacity style={{ justifyContent: 'center', alignItems: "center", width: "80%", borderColor: 'black', marginLeft: 10, borderWidth: 1, borderRadius: 20 }}
                onPress={() => handledone(item.category, index)}>
                <Text>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center' ,width:"60%",height:'60%',alignSelf:'center'}}>
              <Text style={styles.title}>{item.title}</Text>
            </View>

          </View>
          <Pressable style={{ height: "100%", justifyContent: 'center' }} onPress={() => handleDelete(index, item.category)}>
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
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Pressable onPress={() => navigation.navigate("AddTodo")}>
          <Image style={styles.plusimg} source={require('../../Images/plus.png')} />
        </Pressable>
      </View>
      <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>Regular Todos</Text>
      <View style={styles.noteback}>
        <FlatList
          data={alltodos.filter(todo => todo.category === "Regular")}
          renderItem={renderItem}
          keyExtractor={(item, index) => `Regular_${index}`}
        />
      </View>
      <Text style={{ color: 'white', fontSize: 20, marginTop: 15 }}>Occasional Todos</Text>
      <View style={styles.noteback}>
        <FlatList
          data={alltodos.filter(todo => todo.category === "Occasional")}
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
    height: windowHeight,
    width: windowWidth,
    backgroundColor: 'black',
    flexDirection: 'column',
    alignItems: 'center',
  },
  notetab: {
    borderRadius: 20,
    marginTop: 10,
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#fcaf08',
    width: "100%",
    gap: 20
  },
  delete: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  title: {
    width: "100%",
    height:"100%",
    marginLeft: 10,
    fontSize: 25,
    borderColor:'black',
    borderWidth:1,
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
    marginLeft: 30,
  },
  input: {
    width: "65%",
    height: "60%",
    borderColor: 'gray',
    borderWidth: 3,
    borderRadius: 20,
    marginLeft: 10,
    color: 'white'
  },
  searchtab: {
    width: "100%",
    height: "10%",
    marginTop: 60,
    gap: 10,
    flexDirection: "row",
    alignItems: "center"
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
