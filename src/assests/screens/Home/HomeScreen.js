import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useIsFocused} from '@react-navigation/native';
import {useAuth} from '../../../../AuthContext';

const colors = [
  '#ADE8F4',
  '#90E0EF',
  '#48CAE4',
  '#0096C7',
  '#0077B6',
  '#CAF0F8',
];
const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const HomeScreen = ({navigation}) => {
  const {userToken, signOut} = useAuth();
  const [noteColors, setNoteColors] = useState({});
  const isFocused = useIsFocused();
  const [allnotes, setAll] = useState([]);
  const [allColors, setAllColors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const fadeAnim = useState(new Animated.Value(0))[0];

  const categories = [
    'All',
    'Work',
    'Personal',
    'Shopping',
    'Fitness',
    'Hobbies',
  ];

  useEffect(() => {
    getAllNotes();
  }, [isFocused, category]);

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getNoteColor = index => {
    if (noteColors[index]) {
      return noteColors[index];
    } else {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setNoteColors(prevColors => ({...prevColors, [index]: randomColor}));
      return randomColor;
    }
  };

  const saveNote = async newNote => {
    const temp = [...allnotes];
    const tempColors = {...allColors};

    const noteIndex = temp.length;
    temp.push(newNote);
    tempColors[noteIndex] = getNoteColor(noteIndex);

    await EncryptedStorage.setItem('notes', JSON.stringify({data: temp}));
    await EncryptedStorage.setItem('noteColors', JSON.stringify(tempColors));

    getAllNotes();
  };

  const deleteNote = async index => {
    const newColors = {...noteColors};
    const tempColors = {...allColors};

    delete newColors[index];
    setNoteColors(newColors);

    const temp = [...allnotes];
    temp.splice(index, 1);
    delete tempColors[index];

    await EncryptedStorage.setItem('notes', JSON.stringify({data: temp}));
    await EncryptedStorage.setItem('noteColors', JSON.stringify(tempColors));

    getAllNotes();
  };

  const navigateToEditScreen = index => {
    const noteToEdit = allnotes[index];
    navigation.navigate('EditNotesScreen', {
      noteToEdit,
      index,
      allnotes,
      onNoteUpdate: getAllNotes,
    });
  };

  const getAllNotes = async () => {
    try {
      let notes = [];
      const storedNotes = await EncryptedStorage.getItem('notes');

      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (parsedNotes && parsedNotes.data) {
          notes = parsedNotes.data;
        }
      }

      const filteredNotes =
        category === 'All'
          ? notes
          : notes.filter(note => note.category === category);

      setAll(filteredNotes);

      const storedColors = await EncryptedStorage.getItem('noteColors');
      let colors = {};

      if (storedColors) {
        colors = JSON.parse(storedColors);
      }

      setAllColors(colors || {});
    } catch (error) {
      console.error('Error fetching notes or colors:', error);
    }
  };

  const filteredNotes = allnotes.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({item, index}) => {
    const scale = new Animated.Value(1);
    
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

    const backgroundColor = allColors[index] || '#E1F0DA';
    
    return (
      <TouchableOpacity
        onPress={() => navigateToEditScreen(index)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
        style={{alignItems: 'center'}}>
        <Animated.View style={[
          styles.notetab,
          {
            backgroundColor,
            transform: [{scale}],
          }
        ]}>
          <View style={{width: '80%', height: '100%'}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.desc}</Text>
            {item.category && item.category !== 'All' && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNote(index)}>
            <Image
              style={styles.delete}
              source={require('../../Images/bin.png')}
            />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.background, {opacity: fadeAnim}]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Notes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddNotesScreen', { onSave: saveNote })}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchtab}>
        <View style={styles.searchInputContainer}>
          <Image 
            source={require('../../Images/bin.png')} 
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="Search notes..."
            placeholderTextColor="#579BB1"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoryButtons}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {categories.map(categoryOption => (
            <Pressable
              key={categoryOption}
              style={[
                styles.categoryButton,
                category === categoryOption && styles.selectedCategory,
              ]}
              onPress={() => {
                // Add a small animation when selecting a category
                const tempScale = new Animated.Value(0.9);
                Animated.spring(tempScale, {
                  toValue: 1,
                  friction: 3,
                  useNativeDriver: true,
                }).start();
                
                setCategory(categoryOption);
              }}>
              <Text 
                style={[
                  styles.categoryButtonText, 
                  category === categoryOption && styles.selectedCategoryText
                ]}>
                {categoryOption}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.noteback}>
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No notes found</Text>
            <Text style={styles.emptyStateSubText}>
              {searchQuery ? 'Try a different search term' : 'Create your first note'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{paddingBottom: 20}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            initialNumToRender={8}
          />
        )}
      </View>

      <View>
        <BannerAd
          unitId={
            Platform.OS === 'ios'
              ? 'ca-app-pub-6119758783032593/4124837401'
              : 'ca-app-pub-6119758783032593/4124837401'
          }
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{requestNonPersonalizedAdsOnly: true}}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    flexDirection: 'column',
    alignItems: 'center',
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
  headerText: {
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
  delete: {
    width: 28,
    height: 28,
  },
  deleteButton: {
    height: '100%', 
    width: '15%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  desc: {
    marginLeft: 10,
    marginTop: 8,
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  searchtab: {
    width: wp('100%'),
    height: hp('8%'),
    marginTop: hp('1%'),
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
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
    width: 18,
    height: 18,
    marginRight: 10,
    opacity: 0.6,
  },
  input: {
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
  notetab: {
    marginTop: 5,
    flexDirection: 'row',
    height: 110,
    backgroundColor: '#E1F0DA',
    width: '95%',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noteback: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 5,
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#E8F4F8',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#D2E9E9',
  },
  selectedCategory: {
    backgroundColor: '#579BB1',
    borderColor: '#579BB1',
  },
  categoryButtonText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(87, 155, 177, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#0077B6',
    fontWeight: '500',
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
});

export default HomeScreen;