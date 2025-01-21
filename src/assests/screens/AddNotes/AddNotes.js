import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import {useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Picker from 'react-native-picker-select';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddNotes = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('General');
  const categories = [
    {label: 'Work', value: 'Work'},
    {label: 'Personal', value: 'Personal'},
    {label: 'Shopping', value: 'Shopping'},
    {label: 'Fitness', value: 'Fitness'},
    {label: 'Hobbies', value: 'Hobbies'},
  ];

  const saveNote = async () => {
    try {
      let existingNotes = await EncryptedStorage.getItem('notes');
      existingNotes = existingNotes ? JSON.parse(existingNotes).data : [];
      const newNote = {title, desc, category};
      existingNotes.push(newNote);
      await EncryptedStorage.setItem(
        'notes',
        JSON.stringify({data: existingNotes}),
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };
  const handleCategoryChange = category => {
    setCategory(category);
  };

  return (
    <View style={styles.background}>
      <View style={styles.searchtab}>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Image
            style={styles.searchimg}
            source={require('../../Images/back.png')}
          />
        </Pressable>
        <View style={[styles.pickerContainer, styles.pickerBorder]}>
          <Picker
            selectedValue={category}
            onValueChange={value => handleCategoryChange(value)}
            items={categories}
            style={{
              inputIOS: {
                textAlign: 'center', 
                color: 'white',
                fontWeight:"bold",
                fontSize: 16,
                paddingHorizontal: 10,
              },
              inputAndroid: {
                textAlign: 'center', 
                color: 'black',
                fontSize: 16,
                paddingHorizontal: 10,
              },
            }}
          />
        </View>
        <Pressable onPress={saveNote}>
          <Image
            style={styles.saveimg}
            source={require('../../Images/diskette.png')}
          />
        </Pressable>
      </View>
      <View style={styles.back}>
        <TextInput
          placeholder="Title"
          style={[styles.addtitle, {fontSize: 39}]}
          placeholderTextColor="white"
          value={title}
          onChangeText={txt => setTitle(txt)}
        />
        <TextInput
          placeholder="Type Something"
          placeholderTextColor="white"
          style={styles.adddesc}
          value={desc}
          onChangeText={txt => setDesc(txt)}
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  addtitle: {
    width: windowWidth,
    fontSize: 30,
    padding: 10,
    height: '10%',
    color: 'white',
    backgroundColor: '#C4DFDF',
  },
  adddesc: {
    width: windowWidth,
    fontSize: 20,
    padding: 10,
    color: 'white',
    height: windowHeight,
    backgroundColor: '#C4DFDF',
  },
  searchimg: {
    width: 30,
    height: 30,
    marginLeft: 30,
  },
  pickerCenter: {
    textAlign: 'center', // Centers text horizontally
    textAlignVertical: 'center', // Centers text vertically
  },
  saveimg: {
    width: 30,
    height: 30,
    marginRight: 30,
  },
  pickerContainer: {
    marginHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 5,
    width: '35%',
    height: hp('5%'),
  },
  pickerBorder: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 50,
  },
  picker: {
    color: 'black',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  searchtab: {
    width: wp('100%'),
    height: hp('10%'),
    marginTop: hp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  background: {
    height: windowHeight,
    backgroundColor: '#C4DFDF',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default AddNotes;
