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

import { useNavigation, useIsFocused } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export default function App({ route }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [showProfileMiniMenu, setShowProfileMiniMenu] = useState(false);
  const [showSavedGamesComp, setShowSavedGamesComp] = useState(false);
  const [savedGameCount, setSavedGameCount] = useState(0);
  const [longPressedGame, setLongPressedGame] = useState(null);
  const [gameIndexClicked, setGameIndexClicked] = useState(null);

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
  useEffect(() => {
    if (isFocused || (route.params && route.params.newGameAdded)) {
      loadGameData();
    }
  }, [isFocused, route.params]);

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

  const addNewGame = async () => {
    if (newGameName.trim() === "") {
      return; // Do nothing if the new game name is empty
    }
    const newGame = {
      gameName: newGameName,
      venue: "Unknown Venue",
      timestamp: new Date().toLocaleString(),
      timer: 0,
      opponent: "Unknown Opponent",
    };
    const updatedGames = [...savedGames, newGame];
    setSavedGames(updatedGames);
    setNewGameName("");

    try {
      await AsyncStorage.setItem("@game_data", JSON.stringify(updatedGames));
      console.log("New game added", newGame);
    } catch (e) {
      console.error("Error saving new game", e);
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
  const handleOpenGame = (game) => {
    console.log("baiiiiii");
    console.log(game);
    navigation.navigate("InGame", { gameData: game });
  };

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    setSavedGameCount(savedGames.length);
  }, [savedGames]);
  return (
    <SafeAreaView className="flex-1 bg-[#16171A]">
      <ScrollView>
        {showSavedGamesComp && <SavedGamesComponent />}
        <View className="flex flex-row justify-end  h-10  items-center">
          <View className="w-auto m-2 flex-row h-10  items-center justify-center">
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
              className="mr-2 mb-2 h-auto bg-white/80 top-0 z-50 w-auto p-2 rounded-md mr-3"
            >
              <Text>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="mr-2 h-auto bg-white/20 top-0 z-50 w-auto p-2 rounded-md mr-3"
            >
              <Text className="text-[#00E471]">Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text className="text-[#444A4F] text-gray-400 ml-5 text-2xl mb-3 capitalize font-semibold">
          Actions
        </Text>
        <View className=" z-0 px-5 items-center">
          <ImageBackground
            source={require("../assets/croke.jpg")}
            style={{ width: "100%", height: 108, borderRadius: 8 }}
            imageStyle={{ borderRadius: 8 }}
          >
            <View className="bg-black/40">
              <TouchableOpacity
                onPress={() => navigation.navigate("StartGame")}
                className="w-full h-full justify-end items-start pl-5 pb-5 rounded-md"
              >
                <Text className="text-center text-white font-semibold text-xl capitalize">
                  Start new Game
                </Text>
                <Text className="text-[#444A4F] text-gray-400 text-md capitalize font-semibold">
                  {10 - savedGameCount} remaining
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
            <View className="bg-black/40">
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
            <View className="bg-black/40">
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
        <View className=" flex-row mx-5 mb-5">
          <View className=" flex-1">
            <Text className="text-[#444A4F] text-gray-400 text-2xl mt-5 capitalize font-semibold">
              Games{" "}
              <View className="text-xs justify-center rounded-full h-6 w-6 border bg-purple-400 bg-[#">
                <Text className="text-center font-bold text-gray-800">
                  {savedGameCount}
                </Text>
              </View>
            </Text>
          </View>
          <View className="items-end justify-end">
            <TouchableOpacity className=" bg-[#1E2226] rounded-md">
              <Text className="px-2 py-1 font-semibold text-gray-500">
                Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full rounded-2xl mt-1">
          <TouchableOpacity className="rounded-md w-full">
            {savedGames.map((game, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  if (longPressedGame === game.gameName) {
                    setLongPressedGame(null);
                  }
                }}
              >
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("==========buko======================");
                      console.log(game.gameName);
                      setGameIndexClicked(index);
                      console.log("====================================");
                      // navigation.navigate("InGame", { gameData: game });
                    }}
                    onLongPress={() => setLongPressedGame(game.gameName)}
                    className="rounded-2xl mx-5 bg-[#1E2226]  my-auto mb-2 px-3 py-3"
                  >
                    <View className="flex-row w-full ">
                      <View className="w-[40%] px-2 py-1">
                        <Text className="text-lg text-white font-semibold">
                          {game.gameName}
                        </Text>
                        <Text className="text-xs font-semibold capitalize text-gray-500">
                          {game.venue} {game.timestamp}
                        </Text>
                      </View>
                      <View className="w-auto px-2 py-1 justify-center">
                        <Text className="text-gray-500 text-right">
                          Kilkerley : 2:12
                        </Text>
                        <Text className="text-gray-500 text-right">
                          {game.opponent} : 2:08
                        </Text>
                      </View>
                      <View className="w-[15%] right-0 flex-1 justify-center items-end px-2 py-1">
                        <Text className="text-gray-500 text-center">
                          {game.timer >= 2100 && game.timer <= 2160
                            ? "HT"
                            : Math.floor(game.timer / 60)}
                        </Text>
                        {game.timer < 2100 ? (
                          <Text className="text-gray-500 text-center">Min</Text>
                        ) : (
                          ""
                        )}
                      </View>
                    </View>
                    {index === gameIndexClicked && (
                      // index === 1 &&
                      <View className="w-full h-12  flex-row items-center justify-center">
                        <TouchableOpacity className="bg-purple-500 mr-1 rounded-md px-4 py-2 w-1/3">
                          <Text className="text-center">Statistics</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            // navigation.navigate("InGame", { gameData: game })
                            handleOpenGame(game)
                          }
                          className="border ml-1 border-purple-500 w-1/3 rounded-md px-4 py-2"
                        >
                          <Text className="text-center text-gray-400">
                            Open Game
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {longPressedGame === game.gameName && (
                      <TouchableWithoutFeedback>
                        <View className="absolute bg-[#1E2226] w-full my-auto h-full top-[25%] left-3 mx-auto flex-row justify-center items-center inset-0">
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
                            className="bg-gray-500 w-auto my-auto mx-3 justify-center items-center px-2 rounded-md h-auto py-2 px-4"
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
                </View>
              </TouchableWithoutFeedback>
            ))}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  scrollViewContent: {
    height: "auto",
    padding: 1, // Adjust padding as needed
    flexGrow: 1,
  },
});
