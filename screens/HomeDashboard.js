import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export default function App() {
  const navigation = useNavigation();
  const [showProfileMiniMenu, setShowProfileMiniMenu] = useState(false);
  const [showSavedGamesComp, setShowSavedGamesComp] = useState(false);
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
  const [savedGames, setSavedGames] = useState([]);
  const loadGameData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@game_data");
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        if (Array.isArray(data)) {
          setSavedGames(data); // Set the array of saved games
          console.log("Data loaded", data);
        }
      }
    } catch (e) {
      console.error("Error loading data", e);
    }
  };

  useEffect(() => {
    loadGameData();
  }, []);

  function SavedGamesComponent() {
    return (
      <TouchableWithoutFeedback onPress={() => setShowSavedGamesComp(false)}>
        <View className="bg-black/50 z-50 w-full justify-center rounded-md items-center h-full absolute">
          <TouchableWithoutFeedback>
            <View className="w-[90%] h-3/4 bg-[#242424] items-center justify-center rounded-md">
              <View className="rounded-md w-full">
                {savedGames.map((game, index) => (
                  <View key={index} className="rounded-md">
                    <Text className="bg-gray-200  text-center p-4 my-2    cursor-pointer roudned-md">
                      {game.gameName}
                    </Text>
                    {game.positions.map((pos, posIndex) => (
                      <Text key={posIndex}>{pos.datatosave}</Text>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#181818]">
      {showSavedGamesComp && <SavedGamesComponent />}
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
        <TouchableOpacity
          onPress={() => setShowSavedGamesComp(true)}
          className="bg-white w-4/5 h-24 justify-center items-center my-2 rounded-md"
        >
          <Text className="text-center">Saved Games</Text>
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
