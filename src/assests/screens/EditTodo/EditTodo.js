import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EditTodo = ({ route, navigation }) => {
  const { todoItem, todoIndex } = route.params;
  const [editedTitle, setEditedTitle] = useState(todoItem.title);
  const [category, setCategory] = useState(todoItem.category || "Regular"); // Default to Regular if not set
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSaveChanges = async () => {
    try {
      // Retrieve the existing todos from AsyncStorage
      const storedTodos = await AsyncStorage.getItem('todo');
      let data = JSON.parse(storedTodos);
  
      if (data && data.data) {
        // Update the title and category of the corresponding todo
        data.data[todoIndex].title = editedTitle;
        data.data[todoIndex].category = category;
  
        // Log the updated data
        console.log('Updated Data:', data);
  
        // Save the updated todos back to AsyncStorage
        await AsyncStorage.setItem('todo', JSON.stringify(data));
  
        // Send back the updated note to the TodoHome screen
        navigation.goBack({ updatedNote: data.data[todoIndex] });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <StatusBar backgroundColor="#EFF6FF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={styles.backIcon}
            source={require('../../Images/back.png')}
            defaultSource={{ uri: 'https://via.placeholder.com/24' }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Todo</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Image
            style={styles.saveIcon}
            source={require('../../Images/diskette.png')}
            defaultSource={{ uri: 'https://via.placeholder.com/24' }}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Task</Text>
          <TextInput
            style={styles.titleInput}
            value={editedTitle}
            onChangeText={(text) => setEditedTitle(text)}
            placeholder="What do you need to do?"
            placeholderTextColor="#888"
          />
        </View>
        
        <View style={styles.categoryContainer}>
          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.categoryButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton, 
                category === "Regular" && styles.categoryButtonActive
              ]}
              onPress={() => setCategory("Regular")}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  category === "Regular" && styles.categoryButtonTextActive
                ]}
              >
                Regular
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton, 
                category === "Occasional" && styles.categoryButtonActive
              ]}
              onPress={() => setCategory("Occasional")}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  category === "Occasional" && styles.categoryButtonTextActive
                ]}
              >
                Occasional
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#EFF6FF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#579BB1',
  },
  saveButton: {
    padding: 8,
  },
  saveIcon: {
    width: 22,
    height: 22,
    tintColor: '#579BB1',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 18,
    color: '#333',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#579BB1',
    borderColor: '#579BB1',
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  saveButtonLarge: {
    backgroundColor: '#579BB1',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditTodo;