import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Alert,
  StyleSheet,
  Modal,
  ImageBackground,
  TextInput,
} from "react-native";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHeart,
  faEye,
  faCloud,
  faSliders,
  faUserAlt,
  faEllipsis,
  faFloppyDisk,
  faCircleCheck,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export default function App({ route }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [showStartGameAlertModal, setShowStartGameAlertModal] = useState(false);
  const [showProfileMiniMenu, setShowProfileMiniMenu] = useState(false);
  const [showSavedGamesComp, setShowSavedGamesComp] = useState(false);
  const [showSettingsModalMenu, setShowSettingsModalMenu] = useState(false);
  const [savedGameCount, setSavedGameCount] = useState(0);
  const [longPressedGame, setLongPressedGame] = useState(null);
  const [gameIndexClicked, setGameIndexClicked] = useState(null);
  const [showGeneralAlertComp, setShowGeneralAlertComp] = useState(false);
  const [generalAlertMsg, setGeneralAlertMsg] = useState(":/");
  const [editGameName, setEditGameName] = useState("");
  const [showEditGameSection, setShowEditGameSection] = useState(false);
  //the below two use states are used for checking to see if there are sufficiant in progress/completted games for rendering the category text
  let inProgressRendered = false;
  let completedRendered = false;
  //this below bit is for the check when a user wants to start a game and will be notif if there is already an in game in progress
  const [hasInProgressGame, setHasInProgressGame] = useState(false);

  console.log(hasInProgressGame);
  const scrollViewRef = useRef();
  const handleStartGame = () => {
    console.log("clicked");
  };
  const saveSavedGameEditChanges = () => {
    console.log("clicked the save game changes function");

    const updatedSavedGame = {};

    // Update the game timer to 3600
    //  const updatedGame = { ...game, timer: 3600, gameFinihsed: true };

    //  // Create a new array with the updated game
    //  const updatedGamesArray = savedGames.map((g) =>
    //    g.id === updatedGame.id ? updatedGame : g
    //  );
    //  // Update the state and AsyncStorage
    //  setSavedGames(updatedGamesArray);
    //  AsyncStorage.setItem("@game_data", JSON.stringify(updatedGamesArray))
    //    .then(() => {
    //      console.log("Game data updated in AsyncStorage");
    //      // here i will pass the message for the notification
    //      setShowGeneralAlertComp(true);
    //      setGeneralAlertMsg("Game completed");
    //      setTimeout(() => {
    //        setShowGeneralAlertComp(false);
    //      }, 2000);
    //    })
    //    .catch((error) => {
    //      console.error("Error updating game data in AsyncStorage", error);
    //    });
  };
  const GeneralAlertComp = () => {
    return (
      <View className="bg-zinc-800 absolute z-50 w-full px-5 mx-auto text-center py-5 rounded-b-3xl">
        <View
          className="w-full items-center text-indigo-100 leading-none rounded-2xl flex-row flex-wrap"
          role="alert"
        >
          <View className="bg-blue-600 rounded-md mr-3 px-2 py-1">
            <Text className="uppercase text-center text-xs font-bold text-white">
              New
            </Text>
          </View>
          <Text className="font-semibold text-gray-200 text-left flex-auto">
            {generalAlertMsg}
          </Text>
        </View>
      </View>
    );
  };
  const generatePdf = async () => {
    try {
      // Capture the entire content of the ScrollView
      const uri = await captureRef(scrollViewRef, {
        format: "png",
        quality: 1,
        // Set `result` to `data-uri` to handle larger content if needed
        snapshotContentContainer: true, // This ensures the full scrollable content is captured
      });

      // Convert the captured image into HTML content for the PDF
      const htmlContent = `
        <html>
          <body>
            <img src="${uri}" style="width: 100%; height: auto;" />
          </body>
        </html>
      `;

      // Generate PDF from the captured image
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      console.log("PDF generated at:", pdfUri);
      Alert.alert("PDF generated at:", pdfUri);

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
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
          setSavedGameCount(data.length);
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
  const SettingsModalContent = () => {
    return (
      <TouchableWithoutFeedback onPress={() => setShowSettingsModalMenu(false)}>
        <View className="flex-1 justify-end bg-black/20 items-center">
          <View className="bg-[#12131A] p-4   rounded-md w-full h-3/4 rounded-t-3xl bottom-0 justify-end shadow-xl m-4">
            <View className="items-center justify-center h-full">
              <Text className="text-gray-200 font-semibold text-lg">
                Settings Page, not needed yet
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
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
  const [inProgressUserFlagCheck, setInProgressUserFlagCheck] = useState(false);
  useFocusEffect(
    useCallback(() => {
      // Check if there's any game with a timer less than 3600 (indicating it's in progress)
      const inProgressExists = savedGames.some((game) => game.timer < 3600);

      // Update the state so we can use it outside of the effect
      setHasInProgressGame(inProgressExists);

      console.log(`Is there an in-progress game? ${inProgressExists}`);
    }, [savedGames])
  );

  // useEffect(() => {
  //   // Check if there is any in-progress game
  //   const inProgressExists = recentSavedGamesArray.some(
  //     (game) => game.timer <= 3600
  //   );
  //   setHasInProgressGame(inProgressExists);
  // }, [savedGames]); // Re-run whenever recentSavedGamesArray changes
  // const recentSavedGamesArray = savedGames.slice().reverse();
  const recentSavedGamesArray = savedGames.sort((a, b) => a.timer - b.timer);

  //this is the fucntion for when the user ckicks on the comoplete touchable within the savedgames comp
  const completeGameHandler = (game) => {
    console.log("clicked here baiii");
    console.log(game);

    // Update the game timer to 3600
    const updatedGame = { ...game, timer: 3600, gameFinihsed: true };

    // Create a new array with the updated game
    const updatedGamesArray = savedGames.map((g) =>
      g.id === updatedGame.id ? updatedGame : g
    );
    // Update the state and AsyncStorage
    setSavedGames(updatedGamesArray);
    AsyncStorage.setItem("@game_data", JSON.stringify(updatedGamesArray))
      .then(() => {
        console.log("Game data updated in AsyncStorage");
        // here i will pass the message for the notification
        setShowGeneralAlertComp(true);
        setGeneralAlertMsg("Game completed");
        setTimeout(() => {
          setShowGeneralAlertComp(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error updating game data in AsyncStorage", error);
      });
  };
  console.log("beeeloooop[");
  console.log(savedGames);

  const editGameHandler = (game) => {
    if (game.gameName === editGameName) {
      console.log("no beuno, names are the same");
    } else {
      const newGameDetails = { ...game, gameName: editGameName };
      const updatedGamesArray = savedGames.map((g) =>
        g.id === game.id ? newGameDetails : g
      );
      setSavedGames(updatedGamesArray);
      AsyncStorage.setItem("@game_data", JSON.stringify(updatedGamesArray))
        .then(() => {
          console.log("Game data updated in AsyncStorage");
          // here i will pass the message for the notification
          setShowGeneralAlertComp(true);
          setGeneralAlertMsg("Game Updated");
          setTimeout(() => {
            setShowGeneralAlertComp(false);
          }, 2000);
          setEditGameName("");
          setShowEditGameSection(false);
        })
        .catch((error) => {
          console.error("Error updating game data in AsyncStorage", error);
        });
    }

    //  const updatedGame = { ...game, timer: 3600, gameFinihsed: true };

    //  // Create a new array with the updated game
    //  const updatedGamesArray = savedGames.map((g) =>
    //    g.id === updatedGame.id ? updatedGame : g
    //  );
    //  // Update the state and AsyncStorage
    //  setSavedGames(updatedGamesArray);
    //  AsyncStorage.setItem("@game_data", JSON.stringify(updatedGamesArray))
    //    .then(() => {
    //      console.log("Game data updated in AsyncStorage");
    //      // here i will pass the message for the notification
    //      setShowGeneralAlertComp(true);
    //      setGeneralAlertMsg("Game completed");
    //      setTimeout(() => {
    //        setShowGeneralAlertComp(false);
    //      }, 2000);
    //    })
    //    .catch((error) => {
    //      console.error("Error updating game data in AsyncStorage", error);
    //    });
  };
  //!Main JSX return section
  return (
    <SafeAreaView className="flex-1 bg-[#12131A]">
      <ScrollView ref={scrollViewRef}>
        {/* this bit is the notification rendering section of the main jsx return  */}
        {showGeneralAlertComp && <GeneralAlertComp />}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSettingsModalMenu}
          onRequestClose={() => setShowStartGameAlertModal(false)}
        >
          <SettingsModalContent />
        </Modal>
        {showSavedGamesComp && <SavedGamesComponent />}
        <View className="flex flex-row h-10  items-center justify-between">
          {/* Left-aligned View */}
          <TouchableOpacity
            onPress={() => {
              setShowSettingsModalMenu(true);
            }}
            className=" w-10  bg-[#191A22]   items-center justify-center rounded-full h-10 ml-4"
          >
            <FontAwesomeIcon
              icon={faSliders}
              className="mx-auto text-center"
              size={18}
              color="#acadb4"
            />
          </TouchableOpacity>

          {/* Right-aligned View */}
          <View className="w-auto m-2 flex-row h-10 items-center justify-center">
            {/* <Text className="text-gray-200 mr-2">James</Text> */}
            <TouchableOpacity
              onPress={() => setShowProfileMiniMenu(!showProfileMiniMenu)}
              className="h-10 cursor-pointer bg-[#191A22]  w-10 rounded-full justify-center items-center"
            >
              {!showProfileMiniMenu ? (
                <FontAwesomeIcon
                  icon={faUserAlt}
                  className="mx-auto text-center"
                  size={18}
                  color="#acadb4"
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
                // Would like to add in some sort of check here to see if there is an inprogress game and if so display a modal to complete it

                // onPress={() => navigation.navigate("StartGame")}
                onPress={() => {
                  console.log("pressed");
                  if (hasInProgressGame && !inProgressUserFlagCheck) {
                    setShowStartGameAlertModal(true);
                    console.log("we have an in progress game");
                  } else {
                    navigation.navigate("StartGame");
                  }
                }}
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={showStartGameAlertModal}
            onRequestClose={() => setShowStartGameAlertModal(false)}
          >
            <View className="flex-1 justify-center items-center bg-[#191A22]/50">
              <View className="bg-[#1E2226] p-6 rounded-lg w-11/12 shadow-lg m-4">
                <Text className="text-xl text-center mb-4 text-white">
                  There is a game in progress
                </Text>
                <Text className="text-md text-center mb-6 text-gray-300">
                  You should finish the game before starting a new one
                </Text>
                <View className="w-full flex-row justify-between">
                  <TouchableOpacity
                    onPress={() => {
                      setInProgressUserFlagCheck(true);
                      setShowStartGameAlertModal(false);
                      navigation.navigate("StartGame");
                    }}
                    className="bg-[#0b63fb] px-4 py-3 flex-1 mr-2 rounded-lg"
                  >
                    <Text className="text-white text-center text-base font-semibold">
                      Continue
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setShowStartGameAlertModal(false);
                    }}
                    className="bg-gray-500 px-4 py-3 flex-1 ml-2 rounded-lg"
                  >
                    <Text className="text-white text-center text-base font-semibold">
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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
        {/* <TouchableOpacity
          onPress={generatePdf}
          className="px-5 w-32 rounded-md py-4 mx-auto bg-blue-600"
        >
          <Text>Test</Text>
        </TouchableOpacity> */}
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
          {/* <Text className="text-gray-300  mx-7 mb-2">In Progress</Text> */}

          <TouchableOpacity className="rounded-md w-full">
            {recentSavedGamesArray.map((game, index) => {
              let sectionheader = null;
              if (game.timer < 3600 && !inProgressRendered) {
                sectionheader = (
                  <Text className="text-gray-300 mx-7 mb-2">In Progress</Text>
                );
                inProgressRendered = true;
              } else if (
                game.timer >= 3600 &&
                game.timer <= 3700 &&
                !completedRendered &&
                inProgressRendered
              ) {
                sectionheader = (
                  <Text className="text-gray-300 mx-7 mb-2">Finished</Text>
                );
                completedRendered = true;
              }
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    if (longPressedGame === game.gameName) {
                      setLongPressedGame(null);
                    }
                  }}
                >
                  <View>
                    {sectionheader}
                    <TouchableOpacity
                      onPress={() => {
                        setGameIndexClicked(index);
                        //also clear the edit names, this is temporary for the moment, it is a wuick way of getting rid of editing the wrong game when user clicks from one game to the next
                        setEditGameName("");
                        setShowEditGameSection(false);
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
                            Kilkerley : {game.gameScoreGoal}:
                            {game.gameScorePoint}
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
                            <Text className="text-gray-200 text-center">
                              Min
                            </Text>
                          ) : (
                            ""
                          )}
                        </View>
                      </View>
                      {index === gameIndexClicked && (
                        // index === 1 &&\
                        <>
                          <View className="w-full  px-2 h-12  mt-2 flex-row items-center justify-center">
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("Statistics", {
                                  gameData: game,
                                })
                              }
                              className="bg-[#0b63fb]  rounded-md px-4 py-2 w-1/3"
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
                              className=" ml-1 bg-zinc-800 w-1/4 rounded-md px-4 py-2"
                            >
                              <Text className="text-center text-gray-200">
                                Open
                              </Text>
                            </TouchableOpacity>
                            {game.timer < 3600 && (
                              <TouchableOpacity
                                onPress={() =>
                                  // navigation.navigate("InGame", { gameData: game })
                                  completeGameHandler(game)
                                }
                                className=" ml-1 bg-zinc-800 w-1/4 rounded-md px-4 py-2"
                              >
                                <Text className="text-center text-gray-200">
                                  Finish
                                </Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              onPress={() => {
                                setLongPressedGame(game.gameName); // Trigger the long press section
                              }}
                              className=" ml-1 bg-zinc-800 w-1/6 rounded-md px-4 py-2"
                            >
                              <FontAwesomeIcon
                                icon={faEllipsis}
                                size={18}
                                color="#787878"
                              />
                            </TouchableOpacity>

                            {/* only want this to render is the game on not yet finsihed */}
                          </View>
                          {showEditGameSection && (
                            <View className=" mt-3 w-full h-auto">
                              <Text className="text-gray-200 px-3 font-semibold text-md ">
                                Details of Game
                              </Text>
                              <Text className="text-gray-400 mt-2 mb-1 px-3 font-normal text-sm ">
                                Name
                              </Text>
                              <View className="flex-row">
                                <TextInput
                                  className=" w-2/5  bg-gray-700 text-white px-2 py-1 ml-2 mr-1 rounded-md"
                                  placeholder="Opponent"
                                  placeholderTextColor="#ccc"
                                  value={editGameName}
                                  onChangeText={setEditGameName}
                                />
                                <View className="w-32  flex-row space-x-1 my-auto mr-1 h-auto justify-center px-2 rounded-md">
                                  <TouchableOpacity className="w-1/2 border-b-2 border-b-blue-600 bg-gray-600 px-2 rounded-md h-8 justify-center">
                                    <Text className="text-center text-xs text-gray-200">
                                      Home
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity className="w-1/2 bg-gray-600 px-2 rounded-md h-8 justify-center">
                                    <Text className="text-center text-xs text-gray-200">
                                      Away
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    editGameHandler(game);
                                  }}
                                  className="bg-blue-600 text-center py-2 px-3 rounded-md justify-center"
                                >
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    size={18}
                                    color="#000"
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                          {/* <View className="flex-row w-full  px-2 mt-2 items-center mx-auto just">
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
                                className=" ml-1 bg-zinc-800  w-10 h-10 rounded-full px-4 py-2"
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
                                className=" ml-1 bg-zinc-800 w-10 h-10 rounded-full px-4 py-2"
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
                              <Text className="text-zinc-400">
                                Last Modified
                              </Text>
                              <Text className="text-zinc-400">
                                {game.timestamp}
                              </Text>
                            </View>
                          </View> */}
                        </>
                      )}
                      {longPressedGame === game.gameName && (
                        <TouchableWithoutFeedback>
                          <View className="absolute bg-[#1E2226] rounded-lg bg-[#191a22e7] top-3 left-3   w-full   h-full   mx-auto flex-row justify-center items-center inset-0">
                            <TouchableOpacity
                              onPress={() => setLongPressedGame(null)}
                              className="bg-gray-500 w-auto my-auto mx-3 justify-center items-center p-2 rounded-md h-auto py-2 px-4"
                            >
                              <Text className="text-white text-center">
                                Cancel
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setShowEditGameSection(true);
                                setLongPressedGame(false);
                              }}
                              className="bg-blue-500 w-auto my-auto mx-3 justify-center items-center px-2 rounded-md h-auto py-2 px-4"
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
              );
            })}
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
