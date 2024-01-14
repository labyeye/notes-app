import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Pressable, Image } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EditNotesScreen = ({ route, navigation }) => {
    const {noteToEdit, index, onNoteUpdate } = route.params;
    const [title, setTitle] = useState(noteToEdit.title);
    const [desc, setDesc] = useState(noteToEdit.desc);
    const [allnotes, setAllnotes] = useState([]); // Initialize an empty state for the notes
    useEffect(() => {
        // Fetch the notes from the local storage when the component mounts
        const fetchNotes = async () => {
        try {
            const notes = await EncryptedStorage.getItem('notes');
            if (notes) {
            setAllnotes(JSON.parse(notes).data);
            }
        } catch (error) {
            console.log('Error fetching notes:', error);
        }
        };
        fetchNotes();
    }, []);
    const saveChanges = async () => {
        let temp = [...allnotes];
        temp [index] = { title, desc };
        await EncryptedStorage.setItem('notes', JSON.stringify({ data: temp }));
        onNoteUpdate();
        navigation.goBack();
     }
  return (
    <View style={styles.background}>
        <View style={styles.searchtab}>
                <Pressable onPress={() => navigation.navigate("Home")}>
                    <Image style={styles.searchimg} source={require('../../Images/back.png')} />
                </Pressable>
                <Pressable onPress={() => saveChanges()}>
                    <Image style={styles.saveimg} source={require('../../Images/diskette.png')} />
                </Pressable>
            </View>
      <View style={{width:windowWidth,alignItems:"center"}}>
        <TextInput
            style={[styles.addtitle,{fontSize: 39 }]} placeholderTextColor="white"
            value={title}
            onChangeText={setTitle}
            placeholder="Title" 
        />
        <TextInput
            style={styles.adddesc}
            placeholder="Type Something"
            value={desc}
            onChangeText={setDesc}
            multiline
            placeholderTextColor="white"

        />
        <TouchableOpacity style={{width:"80%",alignItems:"center",justifyContent:'center',height:"8%",borderRadius:20,marginTop:20,backgroundColor:'yellow'}}onPress={saveChanges}>
            <Text style={{color:'black'}}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    searchtab: {
        width: "100%",
        height: "10%",
        marginTop: 60,
        gap: 10,
        justifyContent:'space-between',
        flexDirection: "row",
        alignItems: "center"
    },
    saveimg: {
        width: 30,
        height: 30,
        marginRight: 30,
    },
    addtitle: {
        width: windowWidth,
        fontSize:30,
        padding:10,
        height: "10%",
        color:'white',
        backgroundColor: '#023047'
    },
    adddesc: {
        width: windowWidth,
        fontSize:20,
        padding:10,
        color:'white',
        height: windowHeight,
        backgroundColor: '#023047'
    },
    delete: {
        marginVertical: -50,
        width: 30,
        height: 40,
        position: "absolute",
        right: "10%"
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
        marginLeft: 15,
    },
    input: {
        width: "85%",
        height: "20%",
        borderColor: 'gray',
        borderWidth: 3,
        borderRadius: 20,
        marginLeft: 10,
        color: 'white'
    },
    
    background: {
        height: windowHeight,
        width: windowWidth,
        backgroundColor: "#023047",
        flexDirection: 'column',
        alignItems: 'center',
    },
    notetab: {
        borderRadius: 20,
        marginTop: 10,
        height: 100,
        backgroundColor: '#023047',
        width: "100%",
    },
    noteback: {
        height: windowHeight,
        width: windowWidth,
    }
});

export default EditNotesScreen;
