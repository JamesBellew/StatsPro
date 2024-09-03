import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart, faEye, faCloud } from "@fortawesome/free-solid-svg-icons";
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
  // loadGameData();
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
    navigation.navigate("InGame", {
      gameData: game,
      gameInProgressFlag: true,
    });
  };

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    setSavedGameCount(savedGames.length);
  }, [savedGames]);

  const recentSavedGamesArray = savedGames.slice().reverse();
  return (
    <SafeAreaView className="flex-1 bg-[#12131A]">
      <ScrollView>
        {showSavedGamesComp && <SavedGamesComponent />}
        <View className="flex flex-row justify-end  h-10  items-center">
          <View className="w-auto m-2 flex-row h-10  items-center justify-center">
            <Text className="text-gray-200 mr-2">James</Text>
            <TouchableOpacity
              onPress={() => setShowProfileMiniMenu(!showProfileMiniMenu)}
              className=" h-10 cursor-pointer wz-10 rounded-full justify-center items-center"
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

        <Text className="text-[#444A4F] text-gray-200 ml-5 text-2xl mb-3 capitalize font-semibold">
          Actions
        </Text>
        <View className=" z-0 px-5 items-center">
          <ImageBackground
            source={require("../assets/croke.jpg")}
            style={{ width: "100%", height: 108, borderRadius: 8 }}
            imageStyle={{ borderRadius: 8 }}
          >
            <LinearGradient
              colors={["#12131A", "rgba(16,16,16,0.1)"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 2, y: 0 }}
              style={{ flex: 1, borderRadius: 8 }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("StartGame")}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  paddingLeft: 20,
                  paddingBottom: 20,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "600",
                    fontSize: 20,
                    textTransform: "capitalize",
                  }}
                >
                  Start Game
                </Text>
                <Text className="text-[#0b63fb]">
                  {10 - savedGameCount} Remaining
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
          <Text></Text>
          {/* <ImageBackground
            source={require("../assets/stats.jpeg")}
            style={{ width: "100%", height: 108, borderRadius: 8 }}
            imageStyle={{ borderRadius: 8 }}
          >
            <LinearGradient
              colors={["#12131A", "rgba(16,16,16,0.1)"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 2, y: 0 }}
              style={{ flex: 1, borderRadius: 8 }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("StartGame")}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  paddingLeft: 20,
                  paddingBottom: 20,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "600",
                    fontSize: 20,
                    textTransform: "capitalize",
                  }}
                >
                  Statistics
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground> */}
          <Text></Text>
        </View>
        <View className=" flex-row mx-5  mt-5 mb-5">
          <View className=" flex-1  flex-row  mt-5 ">
            <Text className="text-[#444A4F] text-gray-200 text-2xl  capitalize font-semibold">
              Games{" "}
            </Text>
            <View className="text-xs justify-center rounded-full h-6 w-6 border bg-[#0b63fb] ">
              <Text className="text-center font-bold text-gray-800">
                {savedGameCount}
              </Text>
            </View>
          </View>
          <View className="items-end flex-row space-x-2 justify-end">
            <TouchableOpacity className=" bg-[#191A22] rounded-md">
              <Text className="px-2 py-2 text-[#0b63fb]  ">Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity className=" bg-[#191A22] rounded-md">
              <Text className="px-2 py-2  text-gray-500">Away</Text>
            </TouchableOpacity>
            <TouchableOpacity className=" bg-[#191A22] rounded-md">
              <Text className="px-2 py-2  text-gray-500">Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full rounded-2xl mt-1">
          <TouchableOpacity className="rounded-md w-full">
            {recentSavedGamesArray.map((game, index) => (
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
                    className={`rounded-2xl mx-5 bg-[#191A22] 
                   
                       my-auto mb-2 px-3 py-3`}
                  >
                    <View className="flex-row w-full ">
                      <View className="w-[40%] px-2 py-1">
                        <Text
                          className={`text-lg text-gray-200  
                        
                     ${index === gameIndexClicked ? "text-[#0b63fb]  " : ""}   
                        font-semibold`}
                        >
                          {game.gameName}
                        </Text>
                        <Text className="text-xs font-semibold capitalize text-zinc-400">
                          {game.venue} {game.timestamp}
                        </Text>
                      </View>
                      <View className="w-auto px-2 py-1 justify-center">
                        <Text className="text-zinc-400 text-right">
                          Kilkerley : {game.gameScoreGoal}:{game.gameScorePoint}
                        </Text>
                        <Text className="text-zinc-400 mt-2 text-right">
                          {game.opponent} : 0:0
                        </Text>
                      </View>
                      <View className="w-[15%] right-0 flex-1 justify-center items-end px-2 py-1">
                        <Text className="text-gray-200 text-center">
                          {game.timer >= 3600 && game.timer <= 3700
                            ? "FT"
                            : Math.floor(game.timer / 60)}
                        </Text>
                        {game.timer < 3600 ? (
                          <Text className="text-gray-200 text-center">Min</Text>
                        ) : (
                          ""
                        )}
                      </View>
                    </View>
                    {index === gameIndexClicked && (
                      // index === 1 &&\
                      <>
                        <View className="w-full h-12  mt-2 flex-row items-center justify-center">
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("Statistics", {
                                gameData: game,
                              })
                            }
                            className="bg-[#0b63fb] mr-1 rounded-md px-4 py-2 w-1/3"
                          >
                            <Text className="text-center  font-semibold">
                              Statistics
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              // navigation.navigate("InGame", { gameData: game })
                              handleOpenGame(game)
                            }
                            className="border ml-1 bg-zinc-800 w-1/3 rounded-md px-4 py-2"
                          >
                            <Text className="text-center text-gray-200">
                              Open Game
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              // navigation.navigate("InGame", { gameData: game })
                              navigation.navigate("InGame")
                            }
                            className="border ml-1 bg-zinc-800 w-1/4 rounded-md px-4 py-2"
                          >
                            <Text className="text-center text-gray-200">
                              Edit
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View className="flex-row w-full  px-2 mt-2 items-center mx-auto just">
                          <View className="w-2/4 h-12    flex-row items-center ">
                            <TouchableOpacity className="bg-[#0b63fb] bg-zinc-800  mr-1 rounded-full px-4 py-2 h-10 w-10">
                              <View className="w-full flex my-auto justify-center items-center">
                                <FontAwesomeIcon
                                  icon={faCloud}
                                  size={20}
                                  color="#787878"
                                />
                              </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() =>
                                // navigation.navigate("InGame", { gameData: game })
                                handleOpenGame(game)
                              }
                              className="border ml-1 bg-zinc-800 w-10 h-10 rounded-full px-4 py-2"
                            >
                              <View className="w-full my-auto flex justify-center items-center">
                                <FontAwesomeIcon
                                  icon={faEye}
                                  size={22}
                                  color="#787878"
                                />
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                // navigation.navigate("InGame", { gameData: game })
                                handleOpenGame(game)
                              }
                              className="border ml-1 bg-zinc-800 w-10 h-10 rounded-full px-4 py-2"
                            >
                              <View className="w-full my-auto flex justify-center items-center">
                                <FontAwesomeIcon
                                  icon={faHeart}
                                  size={22}
                                  color="#787878"
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                          <View className="w-2/4 h-12 t justify-center items-end ">
                            <Text className="text-zinc-400">Last Modified</Text>
                            <Text className="text-zinc-400">
                              {game.timestamp}
                            </Text>
                          </View>
                        </View>
                      </>
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
