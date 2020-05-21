import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { ActionSheet, Root } from 'native-base'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Contants from 'expo-constants';

export default function () {

  const [fileList, setFileList] = useState([]);

  const { content, btnPressStyle, btnPressText, itemImage, itemViewImage } = styles;


  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      //options here
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      console.log('Can take a photo', result);

      let item = {
        id: Date.now(),
        ...result
      }

      setFileList([...fileList, item]);
    }
  }

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      //options here
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      console.log('Can access the media library', result);

      let item = {
        id: Date.now(),
        ...result
      }

      setFileList([...fileList, item]);
    }

  }

  const handleAddImage = () => {
    const BUTTONS = ['Take a Photo', 'Choose from Library', 'Cancel'];

    ActionSheet.show({
      options: BUTTONS,
      cancelButtonIndex: 2,
      title: 'Select a photo',

    },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            takePhoto();
            break;
          case 1:
            choosePhoto();
            break;

          default:
            break;
        }
      });
  }

  const getPermissionAsync = async () => {
    if (Contants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status != 'granted') {
        console.log('Sorry, we need CAMERA ROLL permission to make this works!');
      }
    }

    const { granted } = await Permissions.askAsync(Permissions.CAMERA);

    if (!granted) {
      console.log('Sorry, we need CAMERA permission to make this works!');
    }

  }

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View style={itemViewImage}>
        <Image source={{ uri: item.uri }} style={itemImage} />
      </View>
    );
  }

  return (
    <Root>
      <View style={content}>
        <FlatList
          data={fileList}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          extraData={fileList}
        />

        <TouchableOpacity onPress={handleAddImage} style={btnPressStyle}>
          <Text style={btnPressText}>Press to add Image</Text>
        </TouchableOpacity>
      </View>
    </Root>
  );
}

const width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    paddingHorizontal: 30,
    paddingBottom: 30
  },
  btnPressStyle: {
    backgroundColor: '#0080FF',
    height: 50,
    width: width - 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40
  },
  btnPressText: {
    color: '#FFF',
  },
  itemImage: {
    backgroundColor: '#2F455C',
    height: 150,
    width: width - 60,
    borderRadius: 8,
    resizeMode: 'contain' //Scale the imagem uniformly
  },
  itemViewImage: {
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10
  }
})