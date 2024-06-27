import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export default function App() {
  const navigation = useNavigation();
  const [showProfileMiniMenu, setShowProfileMiniMenu] = useState(false);
  const [showSavedGamesComp, setShowSavedGamesComp] = useState(false);
  const [longPressedGame, setLongPressedGame] = useState(null);

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

  const deleteGame = async (gameName) => {
    try {
      const updatedGames = savedGames.filter(
        (game) => game.gameName !== gameName
      );
      setSavedGames(updatedGames);
      await AsyncStorage.setItem("@game_data", JSON.stringify(updatedGames));
      console.log("Game deleted", gameName);
      setLongPressedGame(null);
    } catch (e) {
      console.error("Error deleting game", e);
    }
  };

  useEffect(() => {
    loadGameData();
  }, []);

  function SavedGamesComponent() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (longPressedGame) {
            setLongPressedGame(null);
          } else {
            setShowSavedGamesComp(false);
          }
        }}
      >
        <View className="z-50 px-5 w-full rounded-md items-center h-full absolute">
          <ScrollView>
            <TouchableWithoutFeedback>
              <View className="w-full flex-row h-auto items-center justify-center rounded-md">
                <TouchableOpacity className="rounded-md w-full">
                  {savedGames.map((game, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        console.log("==========buko======================");
                        console.log(game);
                        console.log("====================================");
                        navigation.navigate("InGame", { gameData: game });
                      }}
                      onLongPress={() => setLongPressedGame(game.gameName)}
                      key={index}
                      className="rounded-2xl bg-[#1E2226] my-auto mb-2 px-3 py-3"
                    >
                      <View className="flex-row w-full">
                        <View className=" w-[40%] px-2 py-1">
                          <Text className="text-lg text-white font-semibold">
                            {game.gameName}
                          </Text>
                          <Text className="text-xs font-semibold capitalize text-[#444A4F]">
                            {game.venue} {game.timestamp}
                          </Text>
                        </View>
                        <View className=" w-auto px-2 py-1  justify-center">
                          <Text className="text-gray-500 text-right">
                            Kilkerley : 2:12
                          </Text>
                          <Text className="text-gray-500 text-right">
                            {game.opponent} : 2:08
                          </Text>
                        </View>
                        <View className=" w-[15%] right-0 flex-1 justify-center items-end px-2 py-1 ">
                          <Text className="text-gray-500 text-center">
                            {Math.floor(game.timer / 60)}
                          </Text>
                          <Text className="text-gray-500 text-center">Min</Text>
                        </View>
                      </View>
                      {longPressedGame === game.gameName && (
                        <TouchableWithoutFeedback>
                          <View className="absolute bg-[#1E2226] w-full my-auto h-full top-[25%] left-3 mx-auto items flex-row justify-center items-center inset-0">
                            <TouchableOpacity
                              onPress={() => deleteGame(game.gameName)}
                              className="bg-gray-500 w-auto my-auto mx-3 justify-center items-center p-2 rounded-md h-auto py-2 px-4"
                            >
                              <Text className="text-white text-center">
                                Cancel
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => deleteGame(game.gameName)}
                              className="bg-gray-500 w-auto my-auto mx-3 justify-center items-center px-2 rounded-md h-auto py-2 px-4 "
                            >
                              <Text className="text-white px-2 text-center">
                                Edit
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => deleteGame(game.gameName)}
                              className="bg-red-500 w-auto mx-3 my-auto justify-center items-center px-2 rounded-md h-auto py-2 px-4"
                            >
                              <Text className="text-white text-center">
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                    </TouchableOpacity>
                  ))}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#16171A]">
      <View className=" w-full absolute h-1/3"></View>
      {showSavedGamesComp && <SavedGamesComponent />}
      <View className="flex flex-row justify-end items-end">
        <View className="w-auto m-2 flex-row h-10 items-center">
          <Text className="text-gray-200 mr-2">James</Text>
          <TouchableOpacity
            onPress={() => setShowProfileMiniMenu(!showProfileMiniMenu)}
            className=" h-10 cursor-pointer w-10 rounded-full justify-center items-center"
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

      <Text className="text-[#444A4F] ml-5 text-2xl mb-3 capitalize font-semibold">
        Actions
      </Text>
      <View className=" z-0 px-5  items-center">
        <ImageBackground
          source={require("../assets/croke.jpg")}
          style={{ width: "100%", height: 108, borderRadius: 8 }}
          imageStyle={{ borderRadius: 8 }}
        >
          <View className="bg-black/60">
            <TouchableOpacity
              onPress={() => navigation.navigate("StartGame")}
              className="w-full h-full justify-end items-start pl-5 pb-5 rounded-md"
            >
              <Text className="text-center text-white font-semibold text-xl capitalize">
                Start new Game
              </Text>
              <Text className="text-[#444A4F] text-gray-400 text-md capitalize font-semibold">
                5 remaining
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <Text></Text>
        <ImageBackground
          source={require("../assets/stats.jpeg")}
          style={{ width: "100%", height: 108, borderRadius: 8 }}
          imageStyle={{ borderRadius: 8 }}
        >
          <View className="bg-black/60">
            <TouchableOpacity
              onPress={() => navigation.navigate("StartGame")}
              className="w-full h-full justify-end items-start pl-5 pb-5 rounded-md"
            >
              <Text className="text-center text-white font-semibold text-xl capitalize">
                Statistics
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <Text></Text>
        <ImageBackground
          source={require("../assets/kerry.webp")}
          style={{ width: "100%", height: 108, borderRadius: 8 }}
          imageStyle={{ borderRadius: 8 }}
        >
          <View className="bg-black/60">
            <TouchableOpacity
              onPress={() => navigation.navigate("StartGame")}
              className="w-full h-full justify-end items-start pl-5 pb-5 rounded-md"
            >
              <Text className="text-center text-white font-semibold text-xl capitalize">
                Edit Lineup
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
      <Text className="text-[#444A4F] ml-5 text-2xl mt-5 capitalize font-semibold">
        Saved Games
      </Text>
      <View className="w-full h-[30vh]   rounded-2xl mt-1">
        <SavedGamesComponent />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 1, // Adjust padding as needed
  },
});
