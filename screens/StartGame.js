import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  faPeopleGroup,
  faEye,
  faStopwatch,
  faChevronLeft,
  faFloppyDisk,
  faTrashAlt,
  faXmark,
  faPlus,
  faUserPlus,
  faWindowMinimize,
  faCircleXmark,
  faPencil,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { CommonActions } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function App() {
  const navigation = useNavigation();
  const [showProfileMiniMenu, setShowProfileMiniMenu] = useState(false);
  const [newActionLabel, setNewActionLabel] = useState("");
  const [showAddNewGameKPI, setShowAddNewGameKPI] = useState(false);
  const [showEditLineoutModal, setShowEditLineoutModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [showNewPlayerTextInput, setShowNewPlayerTextInput] = useState(false);
  const [playerToBeEdited, setPlayerToBeEdited] = useState(null); // Track player to be edited
  const [showEditView, setShowEditView] = useState(false); // Show edit view
  const [lineoutModalVisible, setLineoutModalVisible] = useState(false);
  const [names, setNames] = useState(Array(15).fill({ number: "", name: "" }));

  const incrementCount = () => {
    if (nameCount < 30) {
      setNameCount(nameCount + 1);
      setNames((prevNames) => [
        ...prevNames,
        { number: prevNames.length + 1, name: "" }, // Adding a new player object
      ]);
    }
  };

  const decrementCount = () => {
    if (nameCount > 15) {
      setNameCount(nameCount - 1);
      setNames((prevNames) => prevNames.slice(0, -1)); // Remove the last player
    }
  };

  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    if (!updatedNames[index]) {
      updatedNames[index] = { number: index + 1, name: value }; // Initialize if undefined
    } else {
      updatedNames[index].name = value; // Update name if object exists
    }
    setNames(updatedNames);
  };

  const handleDeleteLineout = () => {
    Alert.alert(
      "Delete Lineout",
      "Are you sure you want to delete this lineout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            // Find the lineout index in the options
            const updatedLineoutOptions = lineoutOptions.filter(
              (option) => option.value !== selectedLineout.value
            );

            // Update the state and AsyncStorage
            setLineoutOptions(updatedLineoutOptions);

            try {
              await AsyncStorage.setItem(
                "lineoutOptions",
                JSON.stringify(updatedLineoutOptions)
              );
              console.log("Lineout deleted successfully.");
              setShowEditLineoutModal(false); // Close the modal
            } catch (error) {
              console.error("Failed to delete the lineout", error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddNewAction = () => {
    if (newActionLabel.trim()) {
      setActionsBtnsArray([
        ...actionsBtnsArray,
        {
          label: newActionLabel,
          active: true,
          action: () => handleAction(actionsBtnsArray.length + 1),
        },
      ]);
      setNewActionLabel("");
      setShowAddNewGameKPI(false);
    } else {
      alert("Please enter a valid action label.");
    }
  };
  const handleStartGame = () => {
    // Extract only the serializable data from actionsBtnsArray
    const serializableActions = actionsBtnsArray.map((btn) => ({
      label: btn.label,
      active: btn.active,
    }));

    navigation.navigate("InGame", {
      opponent: opponentText,
      venue: venue,
      minutes: minutesHalf,
      gameActions: serializableActions, // Pass only serializable data
      lineout: selectedLineout, // Passing the selected lineout
    });
  };

  // Default lineout options
  const [lineoutOptions, setLineoutOptions] = useState([
    {
      label: "Numbers (Default)",
      value: "numbers",
      names: Array.from({ length: 15 }, (_, index) => ({
        number: index + 1,
        name: (index + 1).toString(),
      })),
    },
  ]);
  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };
  function NewLineoutModalComp() {
    return (
      <View className="absolute w-screen h-screen z-50 bg-zinc-600/50"></View>
    );
  }
  const [opponentText, setOpponentText] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [minutesHalf, onChangeMinutesHalf] = useState(30);
  const [venue, setVenue] = useState("home");
  const [nameCount, setNameCount] = useState(30);
  const [showLineouViewModal, setShowLineupViewModal] = useState(false);
  const [showNewLineupModalComp, setShowNewLineupModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState("numbers");
  const [selectedLineout, setSelectedLineout] = useState(lineoutOptions[0]);

  // Function to handle lineout selection change
  const onLineoutChange = (itemValue) => {
    setSelectedValue(itemValue);
    const lineoutData = lineoutOptions.find(
      (option) => option.value === itemValue
    );
    if (lineoutData) {
      console.log("Selected Lineout:", lineoutData); // Log the selected lineout
      setSelectedLineout(lineoutData); // Update selected lineout state
    }
  };

  const [allNamesFilled, setAllNamesFilled] = useState(true);
  const [actionsBtnsArray, setActionsBtnsArray] = useState([
    { label: "point", active: true, action: () => handleAction(1) },
    { label: "goal", active: true, action: () => handleAction(2) },
    { label: "miss", active: true, action: () => handleAction(3) },
    { label: "short", active: true, action: () => handleAction(4) },
    { label: "45 Score", active: true, action: () => handleAction(5) },
    { label: "45 Miss", active: true, action: () => handleAction(6) },
    { label: "Mark Miss", active: true, action: () => handleAction(7) },
    { label: "Mark point", active: true, action: () => handleAction(8) },
    { label: "T/O Won", active: true, action: () => handleAction(9) },
    { label: "T/O Loss", active: true, action: () => handleAction(10) },
    { label: "Yellow", active: true, action: () => handleAction(11) },
    { label: "Red", active: true, action: () => handleAction(12) },
    { label: "Break Won", active: true, action: () => handleAction(13) },
    { label: "Opp Break", active: true, action: () => handleAction(15) },
    { label: "Opp Catch", active: true, action: () => handleAction(16) },
  ]);

  const onChangeOpponentText = (text) => {
    setOpponentText(text);
    if (text.length > 1) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  const handleAction = (index) => {
    setActionsBtnsArray((currentButtons) =>
      currentButtons.map((btn, idx) =>
        idx === index ? { ...btn, active: !btn.active } : btn
      )
    );
  };

  // useEffect(() => {
  //   const allFilled = names.every((name) => name.length >= 1);
  //   setAllNamesFilled(allFilled);
  // }, [names]);

  const handleSaveLineout = () => {
    const updatedLineout = {
      label: lineoutOverallName,
      value: lineoutOverallName.toLowerCase().replace(/ /g, "-"),
      names: names.map((player, index) => ({
        number: index + 1, // Assign number to each player
        name: player.name, // Store the name for each player
      })),
    };

    saveLineout(updatedLineout);
  };

  const saveLineout = async (updatedLineout) => {
    try {
      const savedOptions = await AsyncStorage.getItem("lineoutOptions");
      let newOptions = [];

      if (savedOptions) {
        newOptions = JSON.parse(savedOptions);
        const existingLineoutIndex = newOptions.findIndex(
          (option) => option.value === updatedLineout.value
        );

        if (existingLineoutIndex >= 0) {
          newOptions[existingLineoutIndex] = updatedLineout;
        } else {
          newOptions.push(updatedLineout);
        }
      } else {
        newOptions.push(updatedLineout);
      }

      await AsyncStorage.setItem("lineoutOptions", JSON.stringify(newOptions));
      setLineoutOptions(newOptions);
      setShowNewLineupModal(false);
    } catch (error) {
      console.error("Failed to save the lineout options", error);
    }
  };

  useEffect(() => {
    const loadLineoutOptions = async () => {
      try {
        const savedOptions = await AsyncStorage.getItem("lineoutOptions");
        if (savedOptions) {
          const parsedOptions = JSON.parse(savedOptions);
          console.log("Loaded Lineout Options:", parsedOptions);
          setLineoutOptions(parsedOptions);
        }
      } catch (error) {
        console.error("Failed to load the lineout options", error);
      }
    };

    loadLineoutOptions();
  }, []);

  const [lineoutOverallName, setLineoutOverallName] = useState("");

  const handleSaveEditedPlayer = () => {
    if (playerToBeEdited && playerToBeEdited.name.trim()) {
      const updatedNames = selectedLineout.names.map((player) =>
        player.number === playerToBeEdited.number
          ? { ...player, name: playerToBeEdited.name }
          : player
      );

      const updatedLineout = {
        ...selectedLineout,
        names: updatedNames,
      };

      setSelectedLineout(updatedLineout);
      saveLineout(updatedLineout);
      setShowEditView(false);
      setPlayerToBeEdited(null);
    }
  };

  const handleDeletePlayer = () => {
    if (selectedLineout.names.length > 15) {
      const updatedNames = selectedLineout.names.filter(
        (player) => player.number !== playerToBeEdited.number
      );

      const updatedLineout = {
        ...selectedLineout,
        names: updatedNames,
      };

      setSelectedLineout(updatedLineout);
      saveLineout({
        label: selectedLineout.label,
        value: selectedLineout.value,
        names: updatedLineout.names,
      });

      setShowEditView(false);
      setPlayerToBeEdited(null);
    } else {
      alert("Cannot delete. At least 15 players are required.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#12131A]">
      <Modal
        visible={showNewLineupModalComp}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center  items-center bg-black/50">
          <View className="w-[90%] p-5 h-[80%] my-auto top-[5%] bg-[#101010] rounded-md">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-semibold">Name</Text>
              <TextInput
                className="flex-1 bg-gray-700 text-white px-2 py-1 mx-2 rounded-md"
                placeholder="Lineout Name"
                placeholderTextColor="#ccc"
                value={lineoutOverallName}
                onChangeText={setLineoutOverallName}
              />

              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={decrementCount}
                  className="bg-gray-700 px-2  rounded-md mr-2"
                >
                  <Text className="text-white text-lg">-</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg">{nameCount}</Text>
                <TouchableOpacity
                  onPress={incrementCount}
                  className="bg-gray-700 px-2  rounded-md ml-2"
                >
                  <Text className="text-white text-lg">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="w-full">
              <View className="flex-row justify-between">
                <View className="w-1/2 pr-2">
                  {Array.from({ length: Math.ceil(nameCount / 2) }).map(
                    (_, index) => (
                      <View key={index} className="flex-row items-center mb-3">
                        <Text className="text-white mr-3">{index + 1}</Text>
                        <TextInput
                          className="flex-1 bg-gray-700 text-white px-2 py-1 rounded-md"
                          placeholder="Name"
                          placeholderTextColor="#ccc"
                          value={names[index]}
                          onChangeText={(value) =>
                            handleNameChange(index, value)
                          }
                        />
                      </View>
                    )
                  )}
                </View>
                <View className="w-1/2 pl-2">
                  {Array.from({
                    length: Math.floor(nameCount / 2),
                  }).map((_, index) => (
                    <View
                      key={index + Math.ceil(nameCount / 2)}
                      className="flex-row items-center mb-3"
                    >
                      <Text className="text-white mr-3">
                        {index + Math.ceil(nameCount / 2) + 1}
                      </Text>
                      <TextInput
                        className="flex-1 bg-gray-700 text-white px-2 py-1 rounded-md"
                        placeholder="Name"
                        placeholderTextColor="#ccc"
                        value={names[index + Math.ceil(nameCount / 2)]}
                        onChangeText={(value) =>
                          handleNameChange(
                            index + Math.ceil(nameCount / 2),
                            value
                          )
                        }
                      />
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
            <View className="flex-row w-full mx-auto justify-center space-x-2">
              <TouchableOpacity
                onPress={handleSaveLineout}
                disabled={!allNamesFilled}
                className={`${
                  allNamesFilled ? "bg-[#0b63fb]/80" : "bg-gray-700"
                } px-4 py-2 rounded-md mt-4`}
              >
                <Text className="text-white text-center">Save Lineout</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowNewLineupModal(false)}
                className="bg-gray-700 px-4 py-2 rounded-md mt-4"
              >
                <Text className="text-white text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View className="flex mx-auto h-36 bg-[#101010] rounded-b-3xl w-full relative">
        <ImageBackground
          source={require("../assets/oneil.jpeg")}
          style={{ width: "100%", height: "100%", borderRadius: 9 }}
          imageStyle={{ borderRadius: 8 }}
        >
          <LinearGradient
            colors={["#12131A", "rgba(16,16,16,0.4)"]}
            start={{ x: 0, y: 0.85 }}
            end={{ x: 0, y: 0 }}
            style={{ flex: 1, borderRadius: 8 }}
          >
            <View className="flexflex-row justify-end items-end">
              <View className="absolute bg-[#12131A]/50 rounded-md  w-auto h-10 left-2 top-2">
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  className="px-2 h-8 px-5 rounded-md my-auto flex-row justify-center items-center shadow-lg"
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={16}
                    color="#fff"
                    className="mr-2 my-auto"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="absolute bottom-0 left-0 right-0  mb-12 justify-end">
              <Text className="text-center text-white mt-3 text-xl font-semibold">
                Details For New Game
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View className="w-3/4 flex-1 align-middle justify-center mx-auto text-center">
        <View className="flex-row space-x-2 w-[90%] mx-auto  h-auto">
          <View className="w-3/6 h-auto ">
            <Text className=" text-white ">Opponent</Text>
            <TextInput
              style={styles.input}
              className="w-full shadow appearance-none rounded-md mx-auto bg-[#101010] text-white px-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Opponent"
              placeholderTextColor={"white"}
              onChangeText={onChangeOpponentText}
              value={opponentText}
            />
          </View>
          <View className="w-3/6 h-auto ">
            <Text className=" text-white ">Minutes Per Half</Text>
            <View className="flex-row mt-2">
              <TouchableOpacity
                onPress={() => onChangeMinutesHalf(30)}
                className={`${
                  minutesHalf === 30 ? "bg-[#0b63fb]" : " bg-[#101010]"
                } rounded-md mx-1 h-12 w-auto p-4 text`}
              >
                <Text className="text-center text-white my-auto">30</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onChangeMinutesHalf(35)}
                className={`${
                  minutesHalf === 35 ? "bg-[#0b63fb]" : " bg-[#101010]"
                } rounded-md mx-1 h-12 w-auto p-4 text`}
              >
                <Text className="text-center text-white my-auto">35</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text className="px-5 text-white mb-2  mt-2">Venue</Text>
        <View className="flex flex-row justify-center mb-5">
          <TouchableOpacity
            onPress={() => setVenue("home")}
            style={[styles.checkbox]}
            className={`${
              venue === "home" ? "border-b border-b-[#0b63fb] bg-white" : ""
            }`}
          >
            <Text style={styles.checkboxText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVenue("away")}
            style={[styles.checkbox]}
            className={`${
              venue === "away" ? "border-b border-b-[#0b63fb] bg-white" : ""
            }`}
          >
            <Text style={styles.checkboxText}>Away</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center ">
          <TouchableOpacity
            onPress={() => {
              setShowNewLineupModal(!showNewLineupModalComp);
            }}
            className="px-2 h-6 mr-2 ml-5 bg-[#0b63fb] rounded-md text-center items-center justify-center"
          >
            <Text>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowEditLineoutModal(true);
              console.log("coicked here boiii");
              console.log(selectedLineout.names);
            }}
            className="px-2 h-6 mr-2  bg-[#0b63fb] rounded-md text-center items-center justify-center"
          >
            <Modal
              visible={showEditLineoutModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowEditLineoutModal(false)}
            >
              <TouchableWithoutFeedback
                onPress={() => setShowEditLineoutModal(false)}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  // className=" w-full h-full"
                >
                  <View className="w-full h-full bg-[#101010]/90 flex justify-center items-center">
                    <TouchableWithoutFeedback>
                      <View className="bg-[#12131A] w-11/12 md:w-3/4 lg:w-1/2 mx-auto h-auto rounded-md py-6 px-4">
                        <View className="absolute left-5 top-5 w-auto h-auto">
                          <TouchableOpacity
                            onPress={() => setShowEditLineoutModal(false)}
                            className="px-2 h-8 rounded-md my-auto flex-row justify-center items-center shadow-lg"
                          >
                            <FontAwesomeIcon
                              icon={faChevronLeft}
                              size={16}
                              color="#fff"
                              className="mr-2 my-auto"
                            />
                          </TouchableOpacity>
                        </View>
                        <View className="flex-row mx-auto">
                          <Text className="text-lg text-gray-100 mb-4 text-center">
                            Team Lineout
                          </Text>
                        </View>

                        {selectedLineout ? (
                          <ScrollView className="max-h-[55vh]">
                            <View className="w-full flex-row flex-wrap justify-between">
                              {selectedLineout.names.map((player, index) => (
                                <TouchableOpacity
                                  key={index}
                                  className="w-[48%] bg-blue-600 p-2 mb-2 rounded-md"
                                  onPress={() => {
                                    setPlayerToBeEdited(player);
                                    setShowEditView(true);
                                  }}
                                >
                                  <Text className="text-white">
                                    {player.number}. {player.name}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>

                            {/* {selectedLineout.names
                            .reduce((result, player, index) => {
                              if (index % 2 === 0) {
                                result.push([player]);
                              } else {
                                result[result.length - 1].push(player);
                              }
                              return result;
                            }, [])
                            .map((pair, pairIndex) => (
                              <View
                                key={pairIndex}
                                className={`flex-row items-start justify-between px-2 py-1 ${
                                  pairIndex % 2 === 0
                                    ? "bg-[#12131A]"
                                    : "bg-[#12131A]"
                                }`}
                              >
                                {pair.map((player, playerIndex) => (
                                  <TouchableOpacity
                                    key={playerIndex}
                                    onPress={() => {
                                      setPlayerToBeEdited(player);
                                      setShowEditView(true);
                                      setShowNewPlayerTextInput(false);
                                    }}
                                    className="w-1/2"
                                  >
                                    <Text className="text-lg font-regular text-gray-200 w-full">
                                      <Text className="text-[#0b63fb] space-x-2 right px-2">
                                        {player.number}.<Text> </Text>
                                      </Text>
                                      {player.name}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            ))} */}
                            {showNewPlayerTextInput && (
                              <>
                                <View className="mt-4 py-4 rounded-md">
                                  <Text className="text-white text-lg px-2">
                                    New Player <Text> </Text>
                                    <Text className="text-[#0b63fb]">
                                      {selectedLineout.names.length + 1}
                                    </Text>
                                  </Text>
                                  <View className="mt-2 h-10 flex-row w-4/4 space-x-4 px-2">
                                    <TextInput
                                      className="flex-1 bg-gray-700 text-white px-2 py-1 rounded-md"
                                      placeholder="Enter new player name"
                                      placeholderTextColor="#ccc"
                                      value={newPlayerName}
                                      onChangeText={setNewPlayerName}
                                    />
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (newPlayerName.trim()) {
                                          const newPlayer = {
                                            number:
                                              selectedLineout.names.length + 1,
                                            name: newPlayerName,
                                          };

                                          const updatedLineout = {
                                            ...selectedLineout,
                                            names: [
                                              ...selectedLineout.names,
                                              newPlayer,
                                            ],
                                          };

                                          setSelectedLineout(updatedLineout);

                                          saveLineout({
                                            label: selectedLineout.label,
                                            value: selectedLineout.value,
                                            names: updatedLineout.names,
                                          });

                                          setNewPlayerName("");
                                        }
                                      }}
                                      className="px-3 bg-[#0b63fb] py-1 rounded-md flex-row justify-center items-center shadow-lg"
                                    >
                                      <FontAwesomeIcon
                                        icon={faUserPlus}
                                        size={16}
                                        color="#fff"
                                        className="mr-2"
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => {
                                        setShowNewPlayerTextInput(false);
                                      }}
                                      className="w-10 bg-gray-700 py-1 rounded-md flex-row justify-center items-center shadow-lg"
                                    >
                                      <FontAwesomeIcon
                                        icon={faXmark}
                                        size={16}
                                        color="#fff"
                                        className="mr-2"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </>
                            )}
                            {showEditView && (
                              <>
                                <Text className="text-white text-lg px-2 mt-4">
                                  Edit Player
                                  <Text> </Text>
                                  <Text className="text-[#0b63fb]">
                                    {playerToBeEdited
                                      ? `${playerToBeEdited.number}. ${playerToBeEdited.name}`
                                      : "No player selected"}
                                  </Text>
                                </Text>
                                <View className="mt-2 h-10 flex-row w-4/4 space-x-4 px-2">
                                  <TextInput
                                    className="flex-1 bg-gray-700 text-white px-2 py-1 rounded-md"
                                    placeholder="Edit player name"
                                    placeholderTextColor="#ccc"
                                    value={
                                      playerToBeEdited
                                        ? playerToBeEdited.name
                                        : ""
                                    }
                                    onChangeText={(value) =>
                                      setPlayerToBeEdited({
                                        ...playerToBeEdited,
                                        name: value,
                                      })
                                    }
                                  />
                                  <TouchableOpacity
                                    onPress={handleSaveEditedPlayer}
                                    className="px-3 bg-[#0b63fb] py-1 rounded-md flex-row justify-center items-center shadow-lg"
                                  >
                                    <FontAwesomeIcon
                                      icon={faUserPlus}
                                      size={16}
                                      color="#fff"
                                      className="mr-2"
                                    />
                                  </TouchableOpacity>
                                  {selectedLineout.names.length > 15 && (
                                    <TouchableOpacity
                                      onPress={handleDeletePlayer}
                                      className="w-10 bg-gray-800 py-1 rounded-md flex-row justify-center items-center shadow-lg"
                                    >
                                      <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        size={16}
                                        color="#fff"
                                        className="mr-2"
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </>
                            )}
                          </ScrollView>
                        ) : (
                          <View className="flex items-center justify-center h-[10vh]">
                            <Text className="text-lg text-gray-600">
                              😔 No players found
                            </Text>
                          </View>
                        )}

                        <View className="flex-row justify-between px-2 w-full mx-auto">
                          <TouchableOpacity
                            onPress={() => {
                              setShowNewPlayerTextInput(
                                !showNewPlayerTextInput
                              );
                              setShowEditView(false);
                            }}
                            className="mt-4 px-3 py-2 bg-[#0b63fb] rounded-md flex-row justify-center items-center shadow-lg"
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              size={12}
                              color="#fff"
                              className="mr-2"
                            />
                            <Text className="text-white px-2 font-regular">
                              Player
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={handleDeleteLineout}
                            className="mt-4 px-4 py-1 bg-gray-700 rounded-md flex-row justify-center items-center shadow-lg"
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              size={12}
                              color="#fff"
                              className="mr-2"
                            />
                            <Text className="text-white px-2 font-regular">
                              Lineout
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
            </Modal>
            <FontAwesomeIcon
              icon={faPen}
              size={12}
              color="#000"
              className="mr-2"
            />
          </TouchableOpacity>
          <Text className="  items-center my-auto text-white "></Text>
          <Text className="pl-1  capitalize text-white">
            - [ {selectedValue} ]
          </Text>
        </View>
        <View className="flex-row w-[90%] space-x-2 mb-2  items-center "></View>

        <View className=" h-[10vh] mt-1 mb-3 justify-center  overflow-hidden">
          <Picker
            selectedValue={selectedValue}
            onValueChange={onLineoutChange}
            itemStyle={{ color: "white", fontSize: 16, marginHorizontal: 10 }}
          >
            {lineoutOptions.map((option, index) => (
              <Picker.Item
                key={index}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
        <View className="flex-row px-5 mb-2 items-center">
          <TouchableOpacity
            onPress={() => {
              setShowAddNewGameKPI(true);
            }}
            className="bg-[#0b63fb] rounded-md px-2 py-1"
          >
            <Text>+</Text>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showAddNewGameKPI}
              onRequestClose={() => setLineoutModalVisible(false)}
            >
              <View className="flex-1 justify-center items-center">
                <View className="bg-white p-4 rounded-md w-2/3 shadow-xl m-4">
                  <Text className="text-lg text-center mb-4">
                    Add New Action
                  </Text>

                  <TextInput
                    className="border border-gray-300 p-2 rounded-md mb-4 w-full"
                    placeholder="Enter action label"
                    value={newActionLabel}
                    onChangeText={(text) => setNewActionLabel(text)}
                  />

                  <View className="w-full flex-row">
                    <TouchableOpacity
                      className="bg-[#0b63fb] px-6 py-2 w-28 mx-auto rounded-md"
                      onPress={handleAddNewAction}
                    >
                      <Text className="text-white text-center text-base">
                        Save
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-[#0b63fb] px-6 py-2 w-28 mx-auto rounded-md"
                      onPress={() => setShowAddNewGameKPI(false)}
                    >
                      <Text className="text-white text-center text-base">
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
          <Text className=" px-2 mb-2 items-center my-auto  text-white">
            Game Setup
          </Text>
        </View>

        <View
          style={{
            height: "auto",
            width: "100%",
            alignSelf: "center",
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {actionsBtnsArray.map((btn, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAction(index)}
              className={`w-auto bg-${
                btn.active ? "blue-600" : "gray-400"
              } m-[1px] rounded-md  py-1 px-[5px]`}
              style={{ height: "auto" }} // Adjust button height here
            >
              <Text className="text-white px-1 text-center">{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleStartGame}
          disabled={!isButtonEnabled}
          className={`mx-auto mt-2  px-10 py-2 rounded-md mt-5 ${
            isButtonEnabled
              ? "bg-[#0b63fb] text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          <Text className="text-lg font-semibold text-gray-300 tracking-widest">
            Start
          </Text>
        </TouchableOpacity>
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
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101010",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  checkboxSelected: {
    borderWidth: 2,
    borderColor: "#101010",
    color: "black",
  },
  checkboxText: {
    color: "white",
  },
});
