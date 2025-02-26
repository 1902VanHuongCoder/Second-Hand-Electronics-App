import React, { useState } from "react";
import { View, Button, ActivityIndicator, Alert, Text, ScrollView, Image } from "react-native";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, ResizeMode } from 'expo-av';

const API_URL_UPLOAD_VIDEO = "http://10.0.2.2:5000/api/uploadvideo";
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

const UploadVideoScreen = () => {
  const [video, setVideo] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      const videoUri = result.assets[0].uri;
      const videoInfo = await fetch(videoUri);
      const videoBlob = await videoInfo.blob();

      if (videoBlob.size > MAX_VIDEO_SIZE) {
        Alert.alert("Video too large", "Please select a video smaller than 50 MB.");
        return;
      }

      setVideo(videoUri);

      // Generate video thumbnail
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: 1000 });
        setThumbnail(uri);
      } catch (err) {
        console.error("Thumbnail generation error:", err);
      }
    }
  };

  const uploadVideo = async () => {
    if (!video) {
      Alert.alert("Please select a video first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("video", {
        uri: video,
        type: "video/mp4",
        name: "video.mp4",
      } as any);

      const response = await axios.post<{ url: string; success: boolean; message: string }>(API_URL_UPLOAD_VIDEO, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setVideoUrl(response.data.url);
      Alert.alert("Upload Successful", "Video uploaded successfully");
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Upload Failed", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Select Video" onPress={selectVideo} />

      {/* {thumbnail && <Image source={{ uri: thumbnail }} style={{ width: 200, height: 200, marginTop: 10 }} />} */}

      {video && (
        <Video
          source={{ uri: video }}
          style={{ width: 300, height: 200, marginTop: 10 }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
        />
      )}

      {loading ? <ActivityIndicator size="large" color="blue" /> : <Button title="Upload Video" onPress={uploadVideo} />}

      {videoUrl && (
        <View style={{ alignItems: "center", margin: 10 }}>
          <Text>Uploaded Video URL: {videoUrl}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default UploadVideoScreen;
