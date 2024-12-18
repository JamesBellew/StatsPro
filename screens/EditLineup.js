import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export default function App() {
  const navigation = useNavigation();
  const [showProfileMiniMenu, setShowProfileMiniMenu] = useState(false);
  const handleStartGame = () => {
    console.log("clicked");
  };
  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };
  const [opponentText, onChangeOpponentText] = useState("");
  const [venue, setVenue] = useState("home");
  const [text, onChangeText] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#181818]">
      <View className="flex mx-auto h-auto bg-[#212121] rounded-b-3xl w-full relative">
        <View className="flex flex-row justify-end items-end">
          <View className="w-auto m-2 flex-row h-10 items-center">
            <Text className="text-white mr-2">James</Text>
            <TouchableOpacity
              onPress={() => setShowProfileMiniMenu(!showProfileMiniMenu)}
              className="bg-white h-10 cursor-pointer w-10 rounded-full justify-center items-center"
            >
              {!showProfileMiniMenu ? (
                <Image
                  source={require("../assets/pp.jpeg")}
                  className="h-7 w-7 rounded-full"
                />
              ) : (
                <Text>x</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {showProfileMiniMenu && (
          <View className="flex justify-end items-end absolute right-0 top-16">
            <TouchableOpacity
              onPress={handleLogout}
              className="mr-2 mb-2 h-auto bg-white/80 top-0 z-50 w-auto p-2 rounded-md mr-3"
            >
              <Text className="">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="mr-2 h-auto bg-white/20 top-0 z-50 w-auto p-2 rounded-md mr-3"
            >
              <Text className="text-[#00E471]">Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text className="text-center mb-10 text-white mt-5 text-lg font-semibold">
          Edit lineup
        </Text>
      </View>
      <View className="w-3/4 flex-1 align-middle justify-center mx-auto text-center"></View>
      <View className="bottom-nav  w-full h-auto">
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeDashboard")}
          className="h-14 w-14 bg-white rounded-full mx-auto text-center"
        ></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 50,
    color: "white",
    backgroundColor: "#383838",
  },
  buttonEnabled: {
    backgroundColor: "#00E471",
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
  checkbox: {
    width: 130,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#383838",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  checkboxSelected: {
    backgroundColor: "white",
    color: "black",
  },
  checkboxText: {
    color: "black",
  },
});
