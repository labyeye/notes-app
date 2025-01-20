import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState ,useEffect} from "react";
import { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";

import {
   Dimensions,
   Image,
   Pressable,
   StyleSheet,
   TextInput,
   View,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Picker from "react-native-picker-select";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const adUnitId = 'ca-app-pub-6119758783032593/8942474846';
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
});
const AddTodo = ({ navigation }) => {
   
   const [selectedCategory, setSelectedCategory] = useState("Regular");
   const [title, setitle] = useState("");
   const [desc, setdesc] = useState("");
   const [loaded, setLoaded] = useState(false);
    const [adLoaded, setadLoaded] = useState(false);
   const newTodo = { title, desc, category: selectedCategory };
   useEffect(() => {
      const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
          setLoaded(true);
          setadLoaded(true); 
      });
      interstitial.load();  
      return () => {
          unsubscribeLoaded();
      };
  }, []);
   const handleCategoryChange = (category) => {
      setSelectedCategory(category);
   };
   const handleCalculatePress = () => {
      if (adLoaded) {
          interstitial.show();
      } else {
          savetodo();
      }
  };
   const savetodo = async () => {
      try {
        let existingTodo = await AsyncStorage.getItem('todo');
        existingTodo = existingTodo ? JSON.parse(existingTodo).data : [];
        let response = await AsyncStorage.getItem('chec');
        console.log("Resp:",[response]);
        const newTodo = { title, desc, category: selectedCategory };
        existingTodo.push(newTodo);
    
        await AsyncStorage.setItem('todo', JSON.stringify({ data: existingTodo }));
    
        navigation.goBack();
      } catch (error) {
        console.error('Error saving note:', error);
      }
    };

   return (
      <View style={styles.container}>
         <View style={styles.searchtab}>
            <Pressable onPress={() => navigation.navigate("Main", { screen: "HomeScreen" })}>
               <Image style={styles.searchimg} source={require("../../Images/back.png")} />
            </Pressable>
            <Pressable onPress={handleCalculatePress}>
               <Image style={styles.searchimg} source={require("../../Images/save.png")} />
            </Pressable>
            <View style={styles.categoryTab}>
               <Picker
                  onValueChange={(value) => handleCategoryChange(value)}
                  items={[
                     { label: "Regular", value: "Regular" },
                     { label: "Occasional", value: "Occasional" },
                  ]}
                  placeholder={{ label: 'Select a category', value: null }}
                  style={{ inputAndroid: { color: 'white' } }}
                  textInputProps={{
                     color: 'white',
                     fontSize: 20,   // Adjust the font size as needed
                  }}
               />
            </View>
         </View>
         <View style={styles.back}>
            <TextInput placeholder="Type your Todo"  style={[styles.addtitle,{fontSize: 25 }]} placeholderTextColor="white"value={title} onChangeText={(txt) => setitle(txt)} />
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
      fontSize:30,
      padding:10,
      height: "30%",
      color:'white',
      backgroundColor: "#C4DFDF",  },
  
   container: {
      height: windowHeight,
      width: windowWidth,
      backgroundColor: "#C4DFDF",      
      flexDirection: "column",
      alignItems: "center",
   },
   plusimg: {
      width: 20,
      height: 20,
      marginLeft: 10,
   },
   input: {
      width: "65%",
      height: "60%",
      borderColor: "gray",
      borderWidth: 3,
      borderRadius: 20,
      marginLeft: 10,
      color: "white",
   },

   searchimg: {
      width: 20,
      height: 20,
      marginLeft: 30,
   },
   searchtab: {
      width: wp('100%'),
      height: hp('10%'),
      marginTop: hp('5%'),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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