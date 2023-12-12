import * as React from "react";
import { StyleSheet, View, Text, Pressable, Image, Dimensions, TextInput, FlatList, TouchableOpacity } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";

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

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [allnotes, setAll] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAllNotes();
  }, [isFocused]);

  const deleteNote = async index => {
    let temp = allnotes.slice();
    temp.splice(index, 1);
    await EncryptedStorage.setItem('notes', JSON.stringify({ data: temp }));
    getAllNotes();
  }

  const navigateToEditScreen = (index) => {
    const noteToEdit = allnotes[index];
    navigation.navigate("EditNotesScreen", { noteToEdit, index, allnotes, onNoteUpdate: getAllNotes });
  }

  const getAllNotes = async () => {
    let x = [];
    let y = await EncryptedStorage.getItem('notes');
    let data = JSON.parse(y);
    if (data && data.data) {
      data.data.map(item => {
        x.push(item);
      });
    }
    setAll(x);
  };

  const filteredNotes = allnotes.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderItem = ({ item, index }) => {
    const noteColor = getRandomColor();

    return (
      <TouchableOpacity onPress={() => navigateToEditScreen(index)}>
        <View style={[styles.notetab, { backgroundColor: noteColor }]}>
          <View style={{ width: "80%", height: "50%" }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
          <TouchableOpacity style={{ height: "100%", justifyContent: 'center' }} onPress={() => deleteNote(index)}>
            <Image style={styles.delete} source={require('../../bin.png')} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.background}>
      <View style={styles.searchtab}>
        <Image style={styles.searchimg} source={require('../../search.png')} />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Pressable onPress={() => navigation.navigate("AddNotes")}>
          <Image style={styles.plusimg} source={require('../../plus.png')} />
        </Pressable>
      </View>
      <View style={styles.noteback}>
        <FlatList
          data={filteredNotes}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  delete: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  title: {
    marginLeft: 10,
    marginTop: 10,
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
  noteback: {
    height: windowHeight,
    width: windowWidth,
  }
});

export default HomeScreen;
