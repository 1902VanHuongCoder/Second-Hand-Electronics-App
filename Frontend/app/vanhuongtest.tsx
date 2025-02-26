import React, { useState } from "react";
import { View, Button, Image, ActivityIndicator, Alert, Text, ScrollView } from "react-native";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';

const API_URL = "http://10.0.2.2:5000/api/uploadmultiple";

const UploadAvatarScreen = () => {
  const [images, setImages] = useState<string[]>([]);
  const [avatarUrls, setAvatarUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const selectImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera roll is required!");
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
    });

    if (!result.canceled) {
        const selectedImages = result.assets.map(asset => asset.uri);
        setImages(selectedImages);
    }
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      Alert.alert("Please select images first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append("images", {
          uri: image,
          type: "image/jpeg",
          name: `avatar-${index}.jpg`,
        } as any);
      });

      const response = await axios.post<{ urls: string[], success: boolean, message: string }>(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAvatarUrls(response.data.urls);
      Alert.alert("Upload Successful", "Images uploaded successfully");
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Upload Failed", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Select Images" onPress={selectImages} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50, margin: 10 }} />
        ))}
      </View>
      {loading ? <ActivityIndicator size="large" color="blue" /> : <Button title="Upload Images" onPress={uploadImages} />}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {avatarUrls.map((url, index) => (
          <View key={index} style={{ alignItems: "center", margin: 10 }}>
            <Image source={{ uri: url }} style={{ width: 100, height: 100, borderRadius: 50 }} />
            <Text>{url}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default UploadAvatarScreen;