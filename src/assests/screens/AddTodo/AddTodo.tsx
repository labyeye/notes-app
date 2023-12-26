import React, { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, TextInput, View, Text } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddTodo = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("Regular");

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchtab}>
        <Pressable onPress={() => navigation.navigate("HomeScreen")}>
          <Image style={styles.searchimg} source={require('../../Images/back.png')} />
        </Pressable>
        <View style={styles.categoryTab}>
          <Pressable onPress={() => handleCategoryPress("Regular")}>
            <Text style={[styles.categoryText, selectedCategory === "Regular" && styles.selectedCategory]}>
              Regular
            </Text>
          </Pressable>
          <Pressable onPress={() => handleCategoryPress("Occasional")}>
            <Text style={[styles.categoryText, selectedCategory === "Occasional" && styles.selectedCategory]}>
              Occasional
            </Text>
          </Pressable>
        </View>
      </View>
      {/* Add the rest of your components here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: 'black',
    flexDirection: 'column',
    alignItems: 'center',
  },
  plusimg: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  input: {
    width: "65%",
    height: "60%",
    borderColor: 'gray',
    borderWidth: 3,
    borderRadius: 20,
    marginLeft: 10,
    color: 'white'
  },
  searchimg: {
    width: 20,
    height: 20,
    marginLeft: 30,
  },
  searchtab: {
    width: "100%",
    height: "10%",
    marginTop: 60,
    gap: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  categoryTab: {
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: 10,
  },
  categoryText: {
    color: "white",
    marginHorizontal: 10,
  },
  selectedCategory: {
    fontWeight: "bold", // You can customize the styling for the selected category
  },
});

export default AddTodo;
