import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  Animated,
  ScrollView
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import StatTodo from "../TodoStat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

// Define color palettes at the top level to avoid naming conflicts
const TODO_COLOR_PALETTES = {
  "Regular": ["#FFE8CC", "#FFD8A9", "#FFC078", "#FFB54D", "#FFA31A"],
  "Occasional": ["#CCEDFF", "#A9DFFF", "#78CAFF", "#4DB8FF", "#1AA3FF"]
};

const TodoHome = ({ navigation }) => {
  const [showDoneAnimation, setShowDoneAnimation] = useState(false);
  const isFocused = useIsFocused();
  const [todoColorMap, setTodoColorMap] = useState({});
  const [regularCheckboxCount, setRegularCheckboxCount] = useState({});
  const [alltodos, setAllTodos] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const categories = ["All", "Regular", "Occasional"];

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (Object.keys(regularCheckboxCount).length > 0) {
      navigation.setParams({
        regularCheckboxCount: regularCheckboxCount,
      });
      AsyncStorage.setItem('checkbox', JSON.stringify(regularCheckboxCount));
    }
  }, [regularCheckboxCount]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setCheckedItems({});
    });

    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      getAllTodos();
    }
  }, [isFocused, activeCategory]);

  const getTodoColor = (category, index) => {
    const key = `${category}_${index}`;
    if (todoColorMap[key]) {
      return todoColorMap[key];
    } else {
      const categoryColors = category === "Regular" ? TODO_COLOR_PALETTES.Regular : TODO_COLOR_PALETTES.Occasional;
      const randomColor = categoryColors[Math.floor(Math.random() * categoryColors.length)];
      setTodoColorMap(prevColors => ({...prevColors, [key]: randomColor}));
      return randomColor;
    }
  };

  const handledone = async (category, index) => {
    setShowDoneAnimation(true);
    setTimeout(() => {
      setShowDoneAnimation(false);
      if (category === "Regular") {
        setRegularCheckboxCount((prevCounts) => {
          const updatedCounts = { ...prevCounts, [index]: (prevCounts[index] || 0) + 1 };
          return updatedCounts;
        });
  
        // Add the marked todo to the StatTodo screen
        const updatedTodo = alltodos.find((todo, i) => todo.category === "Regular" && i === index);
        if (updatedTodo) {
          navigation.navigate("StatTodo", { updatedTodo });
        }
      }
    }, 10);
  
    try {
      // Retrieve the updated todos from AsyncStorage
      const storedTodos = await AsyncStorage.getItem('todo');
      if (storedTodos) {
        let data = JSON.parse(storedTodos);
  
        if (data && data.data) {
          setAllTodos(data.data);
          setFilteredTodos(data.data);
        }
      }
    } catch (error) {
      console.error("Error retrieving todos:", error);
    }
  };

  const handleCheckboxPress = (index, category) => {
    const key = `${category}_${index}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDelete = async (index, category) => {
    try {
      if (!alltodos || alltodos.length === 0) return;
      
      const filteredTodos = alltodos.filter(todo => todo.category === category);
      const updatedTodos = [...filteredTodos];
      updatedTodos.splice(index, 1);
      const newAllTodos = alltodos.filter(todo => todo.category !== category);
      const finalTodos = newAllTodos.concat(updatedTodos);
      setAllTodos(finalTodos);
      await AsyncStorage.setItem('todo', JSON.stringify({ data: finalTodos }));
      setFilteredTodos(finalTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!alltodos || alltodos.length === 0) return;
    
    const filteredList = alltodos.filter(todo =>
      todo.title.toLowerCase().includes(query.toLowerCase()) ||
      todo.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTodos(filteredList);
  };

  const getAllTodos = async () => {
    try {
      let storedTodos = await AsyncStorage.getItem('todo');
      
      // Initialize with empty array if no todos exist yet
      let data = storedTodos ? JSON.parse(storedTodos) : { data: [] };
      
      // Ensure data.data exists
      if (data && data.data) {
        let todos = data.data;
        
        // Filter by category if needed
        if (activeCategory !== "All") {
          todos = todos.filter(todo => todo.category === activeCategory);
        }
        
        setAllTodos(todos);
        setFilteredTodos(todos);
      } else {
        // Ensure we set empty arrays if data.data doesn't exist
        setAllTodos([]);
        setFilteredTodos([]);
      }
    } catch (error) {
      console.error("Error retrieving todos:", error);
      // Set empty arrays on error
      setAllTodos([]);
      setFilteredTodos([]);
    }
  };

  const handleEditTodo = (item, index) => {
    // Navigate to EditTodo screen with the todo item data
    navigation.navigate("EditTodo", { 
      todoItem: item,
      todoIndex: index 
    });
  };

  const renderItem = ({ item, index }) => {
    if (!item) return null;
    
    const isChecked = checkedItems[`${item.category}_${index}`] || false;
    const scale = new Animated.Value(1);
    const backgroundColor = getTodoColor(item.category, index);
    
    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };
    
    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
        onPress={() => handleEditTodo(item, index)}>
        <Animated.View 
          style={[
            styles.todoItem, 
            { 
              backgroundColor,
              transform: [{scale}],
              opacity: isChecked ? 0.6 : 1
            }
          ]}>
          <View style={styles.checkboxContainer}>
            <BouncyCheckbox
              size={25}
              fillColor="#0077B6"
              unfillColor="#FFFFFF"
              iconStyle={{ borderColor: "#0077B6" }}
              innerIconStyle={{ borderWidth: 2 }}
              onPress={(isChecked) => {
                // Prevent triggering edit when checkbox is pressed
                handleCheckboxPress(index, item.category);
                handledone(item.category, index);
              }}
              isChecked={isChecked}
            />
          </View>
          <View style={styles.todoTextContainer}>
            <Text 
              style={[
                styles.todoTitle,
                isChecked && styles.checkedText
              ]}>
              {item.title}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              // Stop event propagation to prevent triggering edit
              e.stopPropagation();
              handleDelete(index, item.category);
            }}>
            <Image style={styles.deleteIcon} source={require('../../Images/bin.png')} />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("AddTodo")}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Image 
            source={require('../../Images/graph.png')} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor="#579BB1"
            value={searchQuery}
            onChangeText={(text) => handleSearch(text)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category)}>
              <Text 
                style={[
                  styles.categoryButtonText, 
                  activeCategory === category && styles.activeCategoryText
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.todoListContainer}>
        {!filteredTodos || filteredTodos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tasks found</Text>
            <Text style={styles.emptyStateSubText}>
              {searchQuery ? 'Try a different search term' : 'Create your first task'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTodos}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item?.category || 'unknown'}_${index}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 12}} />}
          />
        )}
      </View>

      <View style={styles.adContainer}>
        <BannerAd
          unitId={Platform.OS === 'ios' ? 'ca-app-pub-6119758783032593/4124837401' : null}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  header: {
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('6%'),
    paddingBottom: hp('2%'),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#579BB1',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    width: wp('100%'),
    height: hp('8%'),
    marginTop: hp('1%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  clearButton: {
    color: '#888',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
    width: '100%',
  },
  categoryScrollContent: {
    paddingHorizontal: wp('5%'),
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#E8F4F8',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D2E9E9',
  },
  activeCategoryButton: {
    backgroundColor: '#579BB1',
    borderColor: '#579BB1',
  },
  categoryButtonText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoListContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: wp('5%'),
  },
  listContent: {
    paddingBottom: 20,
  },
  todoItem: {
    flexDirection: 'row',
    height: 80,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  checkboxContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  categoryBadge: {
    backgroundColor: 'rgba(87, 155, 177, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#0077B6',
    fontWeight: '500',
  },
  deleteButton: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  emptyStateSubText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  adContainer: {
    width: '100%',
    alignItems: 'center',
  }
});

export default TodoHome;