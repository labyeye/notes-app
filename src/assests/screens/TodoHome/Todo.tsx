import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Image, Dimensions, TextInput, FlatList, TouchableOpacity } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import { useIsFocused } from "@react-navigation/native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Colors } from "react-native/Libraries/NewAppScreen";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const TodoHome = ({ navigation }) => {
  const [isChecked,setIsChecked] = useState(false);
  const isFocused = useIsFocused();
  const [alltodos, setAllTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    getAllTodos();
  }, [isFocused]);

  const deleteTodo = async (index) => {
    try {
      let temp = alltodos.slice();
      temp.splice(index, 1);
      await EncryptedStorage.setItem('todos', JSON.stringify({ data: temp }));
      getAllTodos(); // Ensure you are fetching the updated list
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  
  const getAllTodos = async () => {
    let todos = [];
    let storedTodos = await EncryptedStorage.getItem('todos');
    let data = JSON.parse(storedTodos);
    if (data && data.data) {
        data.data.forEach(item => {
            todos.push(item);
        });
    }
    setAllTodos(todos);
};
  const renderItem = ({ item, index }) => {
    const noteColor = getRandomColor();
    

    return (
      <TouchableOpacity>
        <View style={[styles.notetab, { backgroundColor: noteColor }]}>
          <View style={{ width: "80%", height: "50%" ,flexDirection:"row"}}>
            <BouncyCheckbox
              size={25}
              fillColor="white"
              unfillColor="#FFFFFF"
              isChecked={isChecked}
              onPress={() => setIsChecked(!isChecked)}
              style={{marginTop:40,marginLeft:10}}
            />
            <View style={{flexDirection:"column"}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          </View>
          <TouchableOpacity style={{ height: "100%", justifyContent: 'center' }} onPress={() => deleteTodo(index)}>
            <Image style={styles.delete} source={require('../../Images/bin.png')} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.background}>
      <View style={styles.searchtab}>
        <TouchableOpacity onPress={() => navigation.navigate("StatTodo")}>
          <Image style={styles.searchimg} source={require('../../Images/graph.png')} />
        </TouchableOpacity>
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
      <View style={styles.noteback}>
        <FlatList
          data={alltodos}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
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
    marginLeft: 50,
    marginTop: 5,
    fontSize: 30
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
    marginTop:35,
    marginLeft:10
    
  },
  checkedCheckbox: {
    backgroundColor: "white",
  },
  noteback: {
    height: windowHeight,
    width: windowWidth,
  }
});

export default TodoHome;
