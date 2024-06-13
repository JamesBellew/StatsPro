import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
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

  return (
    <SafeAreaView className="flex-1 bg-[#181818]">
      <View className="flex flex-row justify-end items-end">
        <View className="w-auto m-2 flex-row h-10 items-center">
          <Text className="text-white mr-2">James</Text>
          <TouchableOpacity
            onPress={() => setShowProfileMiniMenu(!showProfileMiniMenu)}
            className="bg-white h-10 cursor-pointer w-10 rounded-full justify-center items-center"
          >
            {!showProfileMiniMenu ? (
              <Image
                source={require("../../StatsPro/assets/pp.jpeg")}
                className="h-7 w-7 rounded-full"
              />
            ) : (
              <Text>x</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {showProfileMiniMenu && (
        <View className="flex absolute right-0 top-16 justify-end items-end">
          <TouchableOpacity
            onPress={handleLogout}
            className="mr-2 mb-2 h-auto bg-white/80 top-0 z-50 w-auto p-2 rounded-md mr-3 "
          >
            <Text className="">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            className="mr-2 h-auto bg-white/20 top-0 z-50 w-auto p-2 rounded-md mr-3 "
          >
            <Text className="text-[#00E471]">Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-1 z-0 justify-center items-center">
        <TouchableOpacity
          onPress={() => navigation.navigate("StartGame")}
          className="bg-white w-4/5 h-24 justify-center items-center my-2 rounded-md"
        >
          <Text className="text-center">Start new Game</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white w-4/5 h-24 justify-center items-center my-2 rounded-md">
          <Text className="text-center">Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditLineup")}
          className="bg-white w-4/5 h-24 justify-center items-center my-2 rounded-md"
        >
          <Text className="text-center">Edit Lineup</Text>
        </TouchableOpacity>
        <View className="flex-row justify-center items-center mt-2">
          <TouchableOpacity className="bg-white w-2/5 h-24 justify-center items-center mx-1 rounded-md">
            <Text className="text-center">Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white w-2/5 h-24 justify-center items-center mx-1 rounded-md">
            <Text className="text-center">Report Issue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
