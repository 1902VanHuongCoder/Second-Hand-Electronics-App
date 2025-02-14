import {useState} from 'react'; 
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'; 
import {useRouter} from 'expo-router'; 
import { useDispatch, UseDispatch } from 'react-redux';
import {login} from '../store/authSlice'; 

export default function LoginScreen() {
    const router = useRouter(); 
    const dispatch = useDispatch(); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const handleLogin = () => {
        if(email === "user@example.com" && password === "password"){
            dispatch(login(email)); 
            router.replace("/(tabs)"); 
        }else{
            alert("Invalid credentials!"); 
        }
    }
    return(
        <View>
            <Text>Login</Text>
            <TextInput/>
            <TextInput/>
            <TouchableOpacity><Text>Login</Text></TouchableOpacity>
        </View>
    )
}

