import React, { useState } from "react";
import { View, Button, Image, ActivityIndicator, Alert, Text } from "react-native";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { launchImageLibrary } from "react-native-image-picker";
// import { Text } from "react-native-reanimated/lib/typescript/Animated";

const API_URL = "http://10.0.2.2:5000/api/upload";

const UploadAvatarScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera roll is required!");
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        setImage(result.assets[0].uri);
    }
};

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "avatar.jpg",
    } as any);

    try {
      const response = await axios.post<{ url: string,success: boolean, message: string  }>(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAvatarUrl(response.data.url); 

      Alert.alert("Upload Successful", "test");
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Upload Failed", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Select Avatar" onPress={selectImage} />
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50, margin: 10 }} />}
      {loading ? <ActivityIndicator size="large" color="blue" /> : <Button title="Upload Avatar" onPress={uploadImage} />}
      {avatarUrl && <Image source={{ uri: avatarUrl }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 20 }} />}
      {avatarUrl && <Text>{avatarUrl}</Text>}
    </View>
  );
};

export default UploadAvatarScreen;