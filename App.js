import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";
import HomeDashboard from "./screens/HomeDashboard";
import StartGame from "./screens/StartGame";
import Statistics from "./screens/Statistics";
import EditLineup from "./screens/EditLineup";
import InGame from "./screens/InGame";
import Testing from "./screens/Testing";
import { CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Image,
} from "react-native";

import "react-native-gesture-handler";

import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} className="bg-[#12131A]">
      <View className="flex w-auto  h-auto justify-start left-10 absolute top-36">
        <Text className="text-3xl text-[#D9D9D9] font-semibold tracking-wider">
          StatsPro
        </Text>
        <Text className="text-base text-gray-200 font-medium tracking-wider">
          Welcome.
        </Text>
      </View>

      <View className="flex flex-row items-center justify-center  h-20 w-full space-x-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="bg-[#D9D9D9] rounded-md py-2 px-4"
        >
          <Text className="text-[#181818] text-md px-4 py-1 font-semibold text-center">
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          className="bg-[#181818]  border  border-[#D9D9D9] rounded-md py-2 px-4"
        >
          <Text className="text-[#D9D9D9] text-md px-4 py-1 font-semibold text-center">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex justify-center items-center h-10 w-full">
        <Text className="text-[#D9D9D9]">
          Having issues? <Text className="text-[#0b63fb]">Report here</Text>
        </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function LoginScreen({ navigation }) {
  const [isLoginFormValid, setIsLoginformValid] = useState(false);
  const [text, onChangeText] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const handleLogin = () => {
    if (isLoginFormValid) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "HomeDashboard" }],
        })
      );
    }
  };
  useEffect(() => {
    //Runs only on the first render
    if (text.length > 1 && password.length > 1) {
      setIsLoginformValid(true);
    } else {
      setIsLoginformValid(false);
    }
  }, [{ password, text }]);
  return (
    <SafeAreaView style={styles.container} className="bg-[#12131A]">
      <View className="flex w-auto  h-auto justify-start left-10 absolute top-32">
        <Text className="text-3xl text-[#D9D9D9] font-semibold tracking-wider">
          Let's Sign you in
        </Text>
        <Text className="text-base text-[#D9D9D9] font-medium tracking-wider">
          Welcome Back.
        </Text>
      </View>
      <TextInput
        style={styles.input}
        className="w-72 shadow appearance-none rounded-lg   bg-[#191A22] text-white px-3  leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Username"
        placeholderTextColor={"white"}
        onChangeText={onChangeText}
        value={text}
      />
      <TextInput
        style={styles.input}
        className="w-72 shadow appearance-none rounded-lg   bg-[#191A22] text-white px-3  leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Password"
        placeholderTextColor={"white"}
        onChangeText={onChangePassword}
        value={password}
      />
      <Text className="w-72 flex text-right text-[#fafafa] text-xs">
        Forgot Password
      </Text>
      <View className="flex flex-row items-center justify-center  h-20 w-full space-x-4">
        <TouchableOpacity
          disabled={!isLoginFormValid}
          onPress={handleLogin}
          style={
            isLoginFormValid ? styles.buttonEnabled : styles.buttonDisabled
          }
          className="bg-[#0b63fb] rounded-md py-1 px-10"
        >
          <Text className="text-[#181818] text-md w-52 py-1 font-bold text-lg text-center">
            Login
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-[#D9D9D9]">Or sign in with</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        className="bg-[#D9D9D9] my-5 rounded-md py-1 px-10"
      >
        {/* <Image
          source={require("../StatsPro/assets/google.webp")}
          className="h-7 mx-auto text-center flex align-middle self-center justify-center w-7 my-auto"
        /> */}
      </TouchableOpacity>
      <View className="flex justify-center items-center h-10 w-full">
        <Text className="text-[#D9D9D9]">
          Need an Account?
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            className="justify-center align-middle my-auto translate-y-[4px]"
          >
            <Text className="text-[#0b63fb]"> Register here</Text>
          </TouchableOpacity>
        </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text>Sign Up Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="HomeDashboard"
            component={HomeDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Testing"
            component={Testing}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="StartGame"
            component={StartGame}
          />
          <Stack.Screen
            name="Statistics"
            component={Statistics}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="EditLineup" component={EditLineup} />
          <Stack.Screen
            name="InGame"
            component={InGame}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />

          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  buttonEnabled: {
    backgroundColor: "#0b63fb",
  },
  buttonDisabled: {
    backgroundColor: "grey",
  },
  image: {
    width: 20, // adjust the width as needed
    height: 20, // adjust the height as needed
    justifyContent: "center",
    textAlign: "center",
    marginLeft: 10,
  },
  input: {
    height: 50,
    margin: 5,
    borderWidth: 1,
    padding: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or "stretch"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end", // Adjusted to maintain previous layout
  },
});
