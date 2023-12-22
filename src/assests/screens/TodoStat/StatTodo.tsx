import React from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const StatTodo = () => {
  return(
  <View style={{ height: windowHeight ,width:windowWidth , backgroundColor:'black',alignItems:'center'}}>
    <View style={{marginTop:70,borderColor:'white' ,width:"40%",borderWidth:1,height:"20%"}}>
      <Text style={{fontSize:20,color:'white'}}>Regular</Text>
      <Text></Text>
    </View>
    <View style={{marginTop:70,borderColor:'white' ,width:"40%",borderWidth:1,height:"20%"}}>
      <Text style={{fontSize:20,color:'white'}}>Occasional</Text>
      <Text></Text>
    </View>
  </View>
  );
};

export default StatTodo;
