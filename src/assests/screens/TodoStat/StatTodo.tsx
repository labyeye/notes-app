import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

interface StatTodoProps {
  completedCount: number;
}


const StatTodo: React.FC<StatTodoProps> = ({ completedCount }) => {
  return (
    <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'black', alignItems: 'center' }}>
      <View style={{ marginTop: 70, borderColor: 'white', width: '40%', borderWidth: 1, height: '20%' }}>
        <Text style={{ fontSize: 20, color: 'white' }}>Regular</Text>
        <Text style={{ color: 'white' }}>{`${completedCount}`}</Text>
      </View>
    </View>
  );
};

export default StatTodo;
