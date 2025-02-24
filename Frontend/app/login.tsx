import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { AppDispatch, RootState } from "../store/store";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Notification from "@/components/Notification";
import { NotificationContext } from "@/context/NotificationContext";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [validateInput, setValidateInput] = useState({
    phoneError: "",
    passwordError: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  ) as { loading: boolean; error: string; user: any };
  const { notifications, showNotification } = useContext(NotificationContext);
  const router = useRouter();

  const handleLogin = async () => {
    if (password === "") {
      setValidateInput({
        ...validateInput,
        passwordError: "Vui lòng nhập mật khẩu",
      });
      return;
    }
    if (phone === "") {
      setValidateInput({
        ...validateInput,
        phoneError: "Vui lòng nhập số điện thoại",
      });
      return;
    }

    const resultAction = await dispatch(loginUser({ phone, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      showNotification("Đăng nhập thành công", "success");
      setTimeout(() => {
        router.push("/(tabs)");
      }, 500);
    } else {
      alert(resultAction.payload);
    }
  };

  return (
    <View className="relative h-screen px-10 w-screen">
      <Notification
        message={notifications.message}
        type={notifications.type}
        visible={notifications.visible}
      />
      <View className="relative z-20 w-full p-5 rounded-md flex justify-center items-center h-screen">
        <Text className="text-4xl font-bold w-full">ĐĂNG NHẬP</Text>
        <Text className="mt-8 w-full text-left text-lg">Số điện thoại</Text>
        <TextInput
          className="outline-none border-2 font-semibold text-lg border-gray-400 rounded-md px-2 py-3 w-full bg-white mt-2 placeholder-opacity-50 placeholder-gray-400"
          placeholder="0xx-xxx-xxxx"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        {validateInput.phoneError !== "" && (
          <Text className="w-full py-3 text-[#DC143C] font-semibold">
            {validateInput.phoneError}
          </Text>
        )}
        <Text className="mt-5 w-full text-left text-lg">Mật khẩu</Text>
        <View className="relative w-full mb-5">
          <TextInput
            className="outline-none font-semibold border-2 text-lg border-gray-400 rounded-lg px-2 py-3 w-full bg-white mt-2 placeholder-opacity-50 placeholder-gray-400"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 top-5"
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {validateInput.passwordError !== "" && (
          <Text className="w-full py-3 text-[#DC143C] font-semibold">
            {validateInput.passwordError}
          </Text>
        )}

        {error && <Text className="w-full py-3 text-[#DC143C] font-semibold">{error} </Text>}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-5" />
        ) : (
          <Pressable onPress={handleLogin}>
            <LinearGradient
              colors={["rgba(156,98,215,1)", "rgba(82,52,113,1)"]}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.button}
              className="mt-5 shadow-sm"
            >
              <Text className="text-white font-bold">ĐĂNG NHẬP</Text>
            </LinearGradient>
          </Pressable>
        )}
        <Text className="my-5 text-lg">Hoặc</Text>
        <Link href="/signup" className="underline text-lg text-[#9661D9] font-semibold">
          <Text>Đăng ký</Text>
        </Link>
      </View>
      <Image
        className="absolute top-0 w-[130%] z-5"
        source={require("../assets/images/Vector 1.png")}
        style={{ alignSelf: "center" }}
      />
      <Image
        className="absolute bottom-0 w-[130%] z-5"
        source={require("../assets/images/Vector 2.png")}
        style={{ alignSelf: "center" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 50,
    borderRadius: 8,
    paddingVertical: 14,
  },
});