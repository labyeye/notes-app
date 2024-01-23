import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditTodo = ({ route, navigation }) => {
    const { noteTotodo, index } = route.params;
    const [editedTitle, setEditedTitle] = useState(noteTotodo.title);
  
    const handleSaveChanges = async () => {
        try {
          // Retrieve the existing todos from AsyncStorage
          const storedTodos = await AsyncStorage.getItem('todo');
          let data = JSON.parse(storedTodos);
      
          if (data && data.data) {
            // Update the title of the corresponding todo
            data.data[index].title = editedTitle;
      
            // Log the updated data
            console.log('Updated Data:', data);
      
            // Save the updated todos back to AsyncStorage
            await AsyncStorage.setItem('todo', JSON.stringify(data));
      
            // Navigate back to TodoHome
            navigation.goBack();
          }
        } catch (error) {
          console.error('Error saving changes:', error);
        }
      };
      
  
    return (
      <View style={{marginTop:150}}>
        <Text>Edit Todo</Text>
        <TextInput
          value={editedTitle}
          onChangeText={(text) => setEditedTitle(text)}
          placeholder="Enter new title"
        />
        <Button title="Save Changes" onPress={handleSaveChanges} />
      </View>
    );
  };
  

export default EditTodo;
