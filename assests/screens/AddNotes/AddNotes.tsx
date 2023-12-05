import * as React from "react";
import { StyleSheet, View, Text, Pressable, Image, Dimensions, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import EncryptedStorage from "react-native-encrypted-storage";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddNotes = ({ navigation }) => {
    const [title, setitle] = useState("");
    const [desc, setdesc] = useState("");
    const savenote = async () => {
        try {
            // Retrieve existing notes
            let existingNotes = await EncryptedStorage.getItem('notes');
            existingNotes = existingNotes ? JSON.parse(existingNotes).data : [];
    
            // Add the new note
            const newNote = { title, desc };
            existingNotes.push(newNote);
    
            // Save the updated notes
            await EncryptedStorage.setItem('notes', JSON.stringify({ data: existingNotes }));
    
            // Navigate back
            navigation.goBack();
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };
    return (
        <View style={styles.background}>
            <View style={styles.searchtab}>
                <Pressable onPress={() => navigation.navigate("HomeScreen")}>
                    <Image style={styles.searchimg} source={require('../../back.png')} />
                </Pressable>
            </View>
            <View style={styles.back}>
                <Text style={{ color: 'white', alignSelf: 'flex-start', fontSize: 30, marginLeft: 20 }}>
                    Title
                </Text>
                <TextInput style={styles.addtitle} value={title} onChangeText={(txt) => setitle(txt)} />
                <Text style={{ color: 'white', alignSelf: 'flex-start', fontSize: 30, marginLeft: 20 }}>
                    Description
                </Text>
                <TextInput style={styles.adddesc} value={desc} onChangeText={(txt) => setdesc(txt)} />
                <TouchableOpacity style={styles.addbtn} onPress={() => savenote()}>
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>Add Notes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    addbtn: { 
        borderRadius: 20,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: 'gray',
        height: "8%",
        width: "80%",
        marginTop: 10

    },
    back: {
        gap: 10,
        flexDirection: "column",
        width: "100%",
        alignItems: "center"
    },
    addtitle: {
        marginTop: 20,
        borderRadius: 10,
        width: "90%",
        fontSize:30,
        padding:10,
        height: "10%",
        backgroundColor: 'white'
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
    plusimg: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    searchimg: {
        width: 30,
        height: 30,
        marginLeft: 30,
    },
    input: {
        width: "75%",
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
        backgroundColor: 'black',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

export default AddNotes;


