import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { CommonActions } from "@react-navigation/native";

export default function App() {
  const navigation = useNavigation();
  const [showProfileMiniMenu, setShowProfileMiniMenu] = useState(false);
  const [names, setNames] = useState(Array(30).fill(""));
  const incrementCount = () => {
    if (nameCount < 30) {
      setNameCount(nameCount + 1);
      setNames((prevNames) => [...prevNames, ""]);
    }
  };
  const decrementCount = () => {
    if (nameCount > 15) {
      setNameCount(nameCount - 1);
      setNames((prevNames) => prevNames.slice(0, -1));
    }
  };
  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  };
  const handleStartGame = () => {
    console.log("clicked");
    console.log("====================================");
    console.log(opponentText);
    console.log("====================================");
    navigation.navigate("InGame", { opponent: opponentText, venue: venue });
  };
  const lineoutOptions = [
    { label: "Numbers (Default)", value: "numbers" },
    { label: "lineout 1", value: "lineout1" },
    { label: "lineout 2", value: "lineout2" },
  ];
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
  const [opponentText, onChangeOpponentText] = useState("");
  const [venue, setVenue] = useState("home");
  const [nameCount, setNameCount] = useState(30);

  const [showNewLineupModalComp, setShowNewLineupModal] = useState(true);
  const [selectedValue, setSelectedValue] = useState("lineout1");
  const [text, onChangeText] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#12131A]">
      <Modal
        visible={showNewLineupModalComp}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center  items-center bg-black/50">
          <View className="w-4/5 p-5 h-[80%] my-auto top-[5%] bg-[#101010] rounded-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-semibold">
                Enter Names
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={decrementCount}
                  className="bg-gray-700 px-2 py-1 rounded-md mr-2"
                >
                  <Text className="text-white text-lg">-</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg">{nameCount}</Text>
                <TouchableOpacity
                  onPress={incrementCount}
                  className="bg-gray-700 px-2 py-1 rounded-md ml-2"
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

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="bg-[#0b63fb] px-4 py-2 rounded-md mt-4"
            >
              <Text className="text-white text-center">Close Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View className="flex mx-auto h-56 bg-[#101010] rounded-b-3xl w-full relative">
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

            <View className="absolute bottom-0 left-0 right-0  mb-12 justify-end">
              <Text className="text-center text-white mt-3 text-xl font-semibold">
                Details For New Game
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View className="w-3/4 flex-1 align-middle justify-center mx-auto text-center">
        <Text className="px-5 text-white">Opponent</Text>
        <TextInput
          style={styles.input}
          className="w-72 shadow appearance-none rounded-lg mx-auto bg-[#101010] text-white px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
          placeholder="Opponent"
          placeholderTextColor={"white"}
          onChangeText={onChangeOpponentText}
          value={opponentText}
        />
        <Text className="px-5 text-white mb-2">Venue</Text>
        <View className="flex flex-row justify-center mb-5">
          <TouchableOpacity
            onPress={() => setVenue("home")}
            style={[
              styles.checkbox,
              // venue === "home" && styles.checkboxSelected,
            ]}
            className={`${
              venue === "home" ? "border-b border-b-[#0b63fb] bg-white" : ""
            }`}
          >
            <Text style={styles.checkboxText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVenue("away")}
            style={[
              styles.checkbox,
              // venue === "away" && styles.checkboxSelected,
            ]}
            className={`${
              venue === "away" ? "border-b border-b-[#0b63fb] bg-white" : ""
            }`}
          >
            <Text style={styles.checkboxText}>Away</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row w-[90%]  items-center ">
          <Text className="pl-5 pr-2 text-white">LineOut</Text>
          <TouchableOpacity
            onPress={() => {
              setShowNewLineupModal(!showNewLineupModalComp);
            }}
            className="bg-[#101010] px-2 py-1 rounded-md"
          >
            <Text className="text-white text-xs">+</Text>
          </TouchableOpacity>
        </View>

        <View className=" h-[10vh] mt-1 justify-center  overflow-hidden">
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
            itemStyle={{ color: "white", fontSize: 16, marginHorizontal: 10 }} // Adjust font size and color here
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
        <View className=" flex-row  w-[90%] mx-auto items-start mt-3  space-x-3 ">
          <TouchableOpacity className="bg-[#101010] px-2 py-1 rounded-sm w-auto ">
            <Text className="text-white">View</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#101010] px-2 py-1 rounded-sm w-auto ">
            <Text className="text-white">Edit</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleStartGame}
          className="mx-auto bg-[#0b63fb] px-10 py-2 rounded-md mt-20"
        >
          <Text className="text-lg font-semibold text-gray-300 tracking-widest  ">
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
