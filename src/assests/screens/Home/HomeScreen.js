import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  BannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import EncryptedStorage from "react-native-encrypted-storage";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../../../../AuthContext";

const colors = ["#ADE8F4", "#90E0EF", "#48CAE4", "#0096C7", "#0077B6", "#CAF0F8"];
const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;

const HomeScreen = ({ navigation }) => {
  const { userToken, signOut } = useAuth();
  const [noteColors, setNoteColors] = useState({});
  const isFocused = useIsFocused();
  const [allnotes, setAll] = useState([]);
  const [allColors, setAllColors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllNotes();
  }, [isFocused]);

  const getNoteColor = (index) => {
    if (noteColors[index]) {
      return noteColors[index];
    } else {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setNoteColors((prevColors) => ({ ...prevColors, [index]: randomColor }));
      return randomColor;
    }
  };

  const saveNote = async (newNote) => {
    const temp = [...allnotes];
    const tempColors = { ...allColors };

    const noteIndex = temp.length;
    temp.push(newNote);
    tempColors[noteIndex] = getNoteColor(noteIndex);

    await EncryptedStorage.setItem("notes", JSON.stringify({ data: temp }));
    await EncryptedStorage.setItem("noteColors", JSON.stringify(tempColors));

    getAllNotes();
  };

  const deleteNote = async (index) => {
    const newColors = { ...noteColors };
    const tempColors = { ...allColors };

    delete newColors[index];
    setNoteColors(newColors);

    const temp = [...allnotes];
    temp.splice(index, 1);
    delete tempColors[index];

    await EncryptedStorage.setItem("notes", JSON.stringify({ data: temp }));
    await EncryptedStorage.setItem("noteColors", JSON.stringify(tempColors));

    getAllNotes();
  };

  const navigateToEditScreen = (index) => {
    const noteToEdit = allnotes[index];
    navigation.navigate("EditNotesScreen", {
      noteToEdit,
      index,
      allnotes,
      onNoteUpdate: getAllNotes,
    });
  };

  const getAllNotes = async () => {
    try {
      let notes = [];
      const storedNotes = await EncryptedStorage.getItem("notes");

      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (parsedNotes && parsedNotes.data) {
          notes = parsedNotes.data;
        }
      }

      setAll(notes);

      const storedColors = await EncryptedStorage.getItem("noteColors");
      let colors = {};

      if (storedColors) {
        colors = JSON.parse(storedColors);
      }

      setAllColors(colors || {});
    } catch (error) {
      console.error("Error fetching notes or colors:", error);
    }
  };

  const filteredNotes = allnotes.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => navigateToEditScreen(index)}
        style={{ alignItems: "center" }}
      >
        <View style={styles.notetab}>
          <View style={{ width: "80%", height: "100%" }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
          <TouchableOpacity
            style={{ height: "100%", width: "15%", justifyContent: "center" }}
            onPress={() => deleteNote(index)}
          >
            <Image
              style={styles.delete}
              source={require("../../Images/bin.png")}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.background}>
      <View style={styles.searchtab}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#579BB1"
          textAlign="center"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      <View style={styles.noteback}>
        <FlatList
          data={filteredNotes}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View>
        <BannerAd
          unitId={
            Platform.OS === "ios"
              ? "ca-app-pub-6119758783032593/4124837401"
              : "ca-app-pub-6119758783032593/4124837401"
          }
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  delete: {
    position: "absolute",
    width: 35,
    height: 35,
  },
  title: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 30,
  },
  desc: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 20,
  },
  input: {
    width: "100%",
    height: "70%",
    borderColor: "#579BB1",
    borderWidth: 2.5,
    borderRadius: 20,
    color: "white",
  },
  searchtab: {
    width: wp("100%"),
    height: hp("10%"),
    marginTop: hp("7%"),
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    alignItems: "center",
  },
  background: {
    flex: 1,
    backgroundColor: "#C4DFDF",
    flexDirection: "column",
    alignItems: "center",
  },
  notetab: {
    marginTop: 10,
    flexDirection: "row",
    height: 100,
    backgroundColor: "#E1F0DA",
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  noteback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
