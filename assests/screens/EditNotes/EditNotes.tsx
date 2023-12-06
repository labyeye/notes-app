import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
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
      <View style={{marginTop:100,width:"100%",alignItems:"center"}}>
        <Text style={{ color: 'white', alignSelf: 'flex-start', fontSize: 30, marginLeft: 20 }}>
                    Title
        </Text>
        <TextInput
            style={styles.addtitle}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
        />
        <Text style={{ color: 'white', alignSelf: 'flex-start', fontSize: 30, marginLeft: 20,marginTop:20 }}>Description
        </Text>
        <TextInput
            style={styles.adddesc}
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
            multiline
        />
        <TouchableOpacity style={{width:"80%",alignItems:"center",justifyContent:'center',height:"8%",borderRadius:20,marginTop:20,backgroundColor:'yellow'}}onPress={saveChanges}>
            <Text style={{color:'black'}}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    addtitle: {
        marginTop: 20,
        borderRadius: 10,
        width: "90%",
        fontSize:30,
        padding:10,
        height: "10%",
        backgroundColor: 'white'
    },
    delete: {
        marginVertical: -50,
        width: 30,
        height: 40,
        position: "absolute",
        right: "10%"
    },
    adddesc: {
        marginTop: 20,
        borderRadius: 10,
        width: "90%",
        fontSize:20,
        padding:10,
        height: "40%",
        backgroundColor: 'white'
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
        width: "85%",
        height: "20%",
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
        height: 100,
        backgroundColor: '#fcaf08',
        width: "100%",
    },
    noteback: {
        height: windowHeight,
        width: windowWidth,
    }
});

export default EditNotesScreen;
