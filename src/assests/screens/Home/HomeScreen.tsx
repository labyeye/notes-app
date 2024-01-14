import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import EncryptedStorage from "react-native-encrypted-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../AuthContext";
const colors = ["#ADE8F4", "#90E0EF", "#48CAE4", "#0096C7", "#0077B6", "#CAF0F8"];
const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
type Note = {
  title: string;
  desc: string;
  
};
interface NoteColors {
  [index: number]: string;
}
const HomeScreen = ({ navigation }) => {
  
  const { userToken, signOut } = useAuth();
  const [noteColors, setNoteColors] = useState<NoteColors>({});
  const isFocused = useIsFocused();
  const [allnotes, setAll] = useState<Note[]>([]);
  const [allColors, setAllColors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllNotes();
  }, [isFocused]);



  const getNoteColor = (index:number) => {
    if (noteColors[index]) {
      return noteColors[index];
    } else {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setNoteColors((prevColors) => ({ ...prevColors, [index]: randomColor }));
      return randomColor;
    }
  };

  const saveNote = async (newNote: Note) => {
    let temp = allnotes.slice();
    let tempColors: { [key: number]: string } = { ...allColors };
  
    const noteIndex = temp.length;
    const noteColor = tempColors[noteIndex];
  
    temp.push(newNote);
    tempColors[noteIndex] = noteColor;
  
    await EncryptedStorage.setItem("notes", JSON.stringify({ data: temp }));
    await EncryptedStorage.setItem("noteColors", JSON.stringify(tempColors));
  
    getAllNotes();
  };
  

  const deleteNote = async (index:number) => {
    let newColors = { ...noteColors };
    let tempColors: { [key: number]: string } = { ...allColors };

    delete newColors[index];
    setNoteColors(newColors);
    let temp = allnotes.slice();
    temp.splice(index, 1);
    delete tempColors[index];

    await EncryptedStorage.setItem("notes", JSON.stringify({ data: temp }));
    await EncryptedStorage.setItem("noteColors", JSON.stringify(tempColors));

    getAllNotes();
  };

  const navigateToEditScreen = (index:number) => {
    const noteToEdit = allnotes[index];
    navigation.navigate("EditNotesScreen", {
      noteToEdit,
      index,
      allnotes,
      onNoteUpdate: getAllNotes,
    });
  };

  const getAllNotes = async () => {
    try {
      let x = [];
      let y = await EncryptedStorage.getItem("notes");

      if (y !== null) {
        let data = JSON.parse(y);
        if (data && data.data) {
          x = data.data;
        }
      }

      setAll(x);

      let colorData: string | null = await EncryptedStorage.getItem("noteColors");
      let colors: { [key: string]: string } = {};

      if (colorData) {
        colors = JSON.parse(colorData);
      }
      setAllColors(colors || {});
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };


  const filteredNotes = allnotes.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item, index }: { item: Note; index: number }) => {
    const noteColor = getNoteColor(index);

    return (
      <TouchableOpacity onPress={() => navigateToEditScreen(index)} style={{alignItems:'center'}}>
        <View style={styles.notetab}>
          <View style={{ width: "80%", height: "100%"}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
          <TouchableOpacity
            style={{ height: "100%",width:'15%', justifyContent: "center",}}
            onPress={() => deleteNote(index)}
          >
            <Image style={styles.delete} source={require("../../Images/bin.png")} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.background}>

      <View style={styles.searchtab}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        
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
    position:'absolute',
    width: 35,
    height: 35,
  },
  title: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 30,
  },
  desc: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 20,
  },
  plusimg: {
    width: 20,
    height: 20,
  },
  searchimg: {
    width: 20,
    height: 20,
    marginLeft: 30,
  },
  input: {
    width: "100%",
    height: "60%",
    borderColor: "white",
    borderWidth: 1.5,
    borderRadius: 20,
    color: "white",
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
  background: {
    flex:1,
    backgroundColor: "#023047",
    flexDirection: "column",
    alignItems: "center",
  },
  notetab: {
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    height: 100, // Set a fixed height for each note
    backgroundColor: "#219ebc",
    width: "95%",
    paddingHorizontal: 10, // Add some padding for better separation
    justifyContent: 'space-between', // Align items vertically
  },
  
  noteback: {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
});

export default HomeScreen;
