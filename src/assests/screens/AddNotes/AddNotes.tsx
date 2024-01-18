import * as React from "react";
import { StyleSheet, View, Text, Pressable, Image, Dimensions, TextInput, TouchableOpacity } from "react-native";
import { useState,useEffect } from "react";
import EncryptedStorage from "react-native-encrypted-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
            // Show the interstitial ad if loaded
           

            navigation.goBack();
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };
    return (
        <View style={styles.background}>
            <View style={styles.searchtab}>
                <Pressable onPress={() => navigation.navigate("Home")}>
                    <Image style={styles.searchimg} source={require('../../Images/back.png')} />
                </Pressable>
                <Pressable onPress={() => savenote()}>
                    <Image style={styles.saveimg} source={require('../../Images/diskette.png')} />
                </Pressable>
            </View>
            <View style={styles.back}>
                <TextInput placeholder="Title" style={[styles.addtitle, { fontSize: 39 }]} placeholderTextColor="white" value={title} onChangeText={(txt) => setitle(txt)} />

                <TextInput placeholder="Type Something" placeholderTextColor="white" style={styles.adddesc} value={desc} onChangeText={(txt) => setdesc(txt)} multiline />

            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    back: {
        flexDirection: "column",
        width: "100%",
        alignItems: "center"
    },
    addtitle: {
        width: windowWidth,
        fontSize: 30,
        padding: 10,
        height: "10%",
        color: 'white',
        backgroundColor: "#023047",
    },
    adddesc: {
        width: windowWidth,
        fontSize: 20,
        padding: 10,
        color: 'white',
        height: windowHeight,
        backgroundColor: "#023047",
    },
    searchimg: {
        width: 30,
        height: 30,
        marginLeft: 30,
    },
    saveimg: {
        width: 30,
        height: 30,
        marginRight: 30,
    },
    searchtab: {
        width: wp('100%'),
        height: hp('10%'),
        marginTop: hp('5%'),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    background: {
        height: windowHeight,
        backgroundColor: "#023047",
        flexDirection: 'column',
        alignItems: 'center',
    },
});

export default AddNotes;


