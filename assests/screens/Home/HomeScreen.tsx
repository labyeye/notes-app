import * as React from "react";
import { StyleSheet, View, Text, Pressable, Image, Dimensions, TextInput, FlatList, TouchableOpacity } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [allnotes, setAll] = useState([]);
  useEffect(() => {
    getAllNotes();
  }, [isFocused]);
  const deleteNote = async index => {
    let temp = allnotes;;
    let x = [];
    temp.map((item,ind) => {
      if(ind!=index){
        x.push(item);
      }
    })
    
    await EncryptedStorage.setItem('notes', JSON.stringify({ data: x }));
    getAllNotes();
  }

  const getAllNotes = async () => {
    let x=[];
    let y = await EncryptedStorage.getItem('notes');
    let data = JSON.parse(y);
    data.data.map(item => {
      x.push(item);
    });
    setAll(x);
  };

  return (
    <View style={styles.background}>
      <View style={styles.searchtab}>
        <Image style={styles.searchimg} source={require('../../search.png')} />
        <TextInput
          style={styles.input}
          placeholder="Search..."
        />
        <Pressable onPress={() => navigation.navigate("AddNotes")}>
          <Image style={styles.plusimg} source={require('../../plus.png')} />
        </Pressable>
      </View>
      <View style={styles.noteback}>
        <FlatList
          data={allnotes}
          renderItem={({ item, index }) => (
            <View style={styles.notetab}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
              <TouchableOpacity onPress={() => {
                  deleteNote(index);
                }}>
                  <Image style={styles.delete}source={require ('../../delete.png')}/>
                </TouchableOpacity>

            </View>
          )}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  delete:{
    marginVertical:-50,
    width:30,
    height:40,
    position:"absolute",
    right:"10%"
  },
  title:{
    marginLeft:10,
    marginTop:10,
    fontSize:30
  },
  desc:{
    marginLeft:10,
    marginTop:10,
    fontSize:20
  },
  plusimg:{
    width:20,
    height:20,
    marginLeft:10,
  },
  searchimg:{
    width:20,
    height:20,
    marginLeft:30,
  },
  input: {
    width:"65%",
    height:"60%",
    borderColor: 'gray',
    borderWidth: 3,
    borderRadius: 20,
    marginLeft:10,
    color:'white'
  },
  searchtab:{
    width:"100%",
    height:"10%",
    marginTop:60,
    gap:10,
    flexDirection:"row",
    alignItems:"center"
  },
  background:{
    height: windowHeight,
    width:windowWidth,
    backgroundColor: 'black',
    flexDirection:'column',
    alignItems:'center',
  },
  notetab:{
    borderRadius:20,
    marginTop:10,
    height:100,
    backgroundColor:'#fcaf08',
    width:"100%",
  },
  noteback:{
    height: windowHeight,
    width:windowWidth,
  }
});

export default HomeScreen;
