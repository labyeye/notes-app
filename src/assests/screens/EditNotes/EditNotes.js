import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  Platform,
  Animated,
} from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;

const EditNotesScreen = ({ route, navigation }) => {
  const { noteToEdit, index, onNoteUpdate } = route.params;
  const [title, setTitle] = useState(noteToEdit.title);
  const [desc, setDesc] = useState(noteToEdit.desc);
  const [category, setCategory] = useState(noteToEdit.category || "Personal");
  const [allnotes, setAllnotes] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  const categories = [
    "Personal",
    "Work",
    "Shopping",
    "Fitness",
    "Hobbies",
  ];

  useEffect(() => {
    // Fetch the notes from the local storage when the component mounts
    const fetchNotes = async () => {
      try {
        const notes = await EncryptedStorage.getItem("notes");
        if (notes) {
          setAllnotes(JSON.parse(notes).data);
        }
      } catch (error) {
        console.log("Error fetching notes:", error);
      }
    };
    fetchNotes();

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

  const saveChanges = async () => {
    let temp = [...allnotes];
    temp[index] = { title, desc, category };
    await EncryptedStorage.setItem("notes", JSON.stringify({ data: temp }));
    if (onNoteUpdate) onNoteUpdate();
    navigation.goBack();
  };

  return (
    <Animated.View
      style={[
        styles.background,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={styles.backIcon}
            source={require("../../Images/back.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Note</Text>
        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Image
            style={styles.saveIcon}
            source={require("../../Images/diskette.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.categorySelector}>
          <Text style={styles.categoryLabel}>Category:</Text>
          <View style={styles.categoryButtons}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.selectedCategory,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat && styles.selectedCategoryText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Type your note here..."
            placeholderTextColor="#888"
            value={desc}
            onChangeText={setDesc}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButtonLarge} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#EFF6FF",
  },
  header: {
    width: wp("100%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("6%"),
    paddingBottom: hp("2%"),
    backgroundColor: "#EFF6FF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: "#579BB1",
  },
  saveButton: {
    padding: 8,
  },
  saveIcon: {
    width: 22,
    height: 22,
    tintColor: "#579BB1",
  },
  formContainer: {
    flex: 1,
    padding: wp("5%"),
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    padding: 15,
  },
  categorySelector: {
    marginBottom: 15,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    marginLeft: 4,
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#E8F4F8",
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D2E9E9",
  },
  selectedCategory: {
    backgroundColor: "#579BB1",
    borderColor: "#579BB1",
  },
  categoryButtonText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "white",
    fontWeight: "bold",
  },
  descriptionContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  descriptionInput: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    height: "100%",
  },
  saveButtonLarge: {
    backgroundColor: "#579BB1",
    marginHorizontal: wp("5%"),
    marginBottom: hp("4%"),
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditNotesScreen;