import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Contants from 'expo-constants';

export default function () {

  const [image, setImage] = useState(null);

  const handleChoosePhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        //mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        // aspect: [4, 3],
        // quality: 1

      });

      if (!result.cancelled) {
        setImage({ uri: result.uri });
      }

      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  const getPermissionAsync = async () => {
    if (Contants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status != 'granted') {
        console.log("Sorry, we need camera roll permissions to make this work");
      }
    }

    const { granted } = Permissions.askAsync(Permissions.CAMERA);
    if (!granted) {
      console.log("Sorry, we need camera permissions to make this work");
    }
  }

  const handleTakePho = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({

      });
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getPermissionAsync();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 300, height: 300 }}
        />
      )}
      <Button
        title='Choose Photo'
        onPress={handleChoosePhoto}
      />
      <Button
        title='Take a photo'
        onPress={handleTakePho}
      />
    </View>
  );
}