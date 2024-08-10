import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
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
  const handleStartGame = () => {
    console.log("clicked");
    console.log("====================================");
    console.log(opponentText);
    console.log("====================================");
    navigation.navigate("InGame", { opponent: opponentText, venue: venue });
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
  const [selectedValue, setSelectedValue] = useState("lineout1");
  const [text, onChangeText] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#12131A]">
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
            {/* <View className="bottom-0 mx-auto transform -translate-x-1/2 bg-white w-20 h-20 rounded-full">
    <Image
      source={require("../../StatsPro/assets/lu.jpeg")}
      className="h-full w-full mx-auto justify-center flex my-auto rounded-full"
    />
  </View> */}
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
        <Text className="px-5 text-white">LineOut</Text>
        <View className=" h-[10vh] justify-center">
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
            itemStyle={{ color: "white", fontSize: 16 }} // Adjust font size and color here
          >
            <Picker.Item label="lineout 1" value="lineout1" />
            <Picker.Item label="lineout 2" value="lineout2" />
            <Picker.Item label="lineout 3" value="lineout3" />
            <Picker.Item label="lineout 3" value="lineout3" />
            <Picker.Item label="lineout 3" value="lineout3" />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={handleStartGame}
          className="mx-auto bg-[#0b63fb] px-10 py-2 rounded-md mt-10"
        >
          <Text className="text-lg font-semibold text-gray-300 tracking-widest  ">
            Start
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View className="bottom-nav  w-full h-auto">
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeDashboard")}
          className="h-14 w-14 bg-white rounded-full mx-auto text-center"
        >
          <Image
            source={require("../../StatsPro/assets/ball.png")}
            className="h-1/2 p-4 w-1/2 mx-auto justify-center flex my-auto rounded-full"
          />
        </TouchableOpacity>
      </View> */}
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
