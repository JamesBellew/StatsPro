import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5"; // FontAwesome5 for newer icons
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
  const AlertComponent = () => {
    return (
      <View className=" absolute w-full  -z-50 text-center py-4 lg:px-4">
        <View
          className="p-2 rounded-md w-3/4 mx-auto  items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
          role="alert"
        >
          <View className="flex rounded-md bg-white uppercase px-4 py-2 text-xs font-bold mr-3">
            <Text className="text-gray-700 font-bold">
              Please Select Action
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const actionStyles = {
    TurnOverLoss: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#FD5F5F",
        backgroundColor: "#242424",
        justifyContent: "center",
        alignItems: "center",
      },
      component: <Text style={styles.xMarkerLoss}>X</Text>,
    },
    TurnOverWon: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#FD5F5F",
        backgroundColor: "#242424",
        justifyContent: "center",
        alignItems: "center",
      },
      component: <Text style={styles.xMarkerLoss}>X</Text>,
    },
    Wide: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#FD5F5F",
      },
    },
    kickoutLoss: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#FD5F5F",
        backgroundColor: "#242424",
      },
    },
    kickoutWon: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#00E471",
        backgroundColor: "#242424",
      },
    },
  };

  const [selected, setSelected] = useState("Home");
  const [positions, setPositions] = useState([]);
  const [tempPosition, setTempPosition] = useState(null);
  const [actionSelected, setActionSelected] = useState(null);
  const [showActionAlertError, setActionAlertError] = useState(false);
  const gameStatClickHandler = (action) => {
    console.log(action);
    setActionSelected(action);
  };
  const handlePitchPress = (event) => {
    //lets see if the user selected a action beofre entering the preview stage
    if (actionSelected) {
      const { locationX, locationY } = event.nativeEvent;
      setTempPosition({ x: locationX, y: locationY, action: actionSelected });
      console.log(tempPosition);
    } else {
      //the user did not select an action
      setActionAlertError(true);
      setTimeout(() => {
        setActionAlertError(false);
      }, 2000);
    }
  };
  const handleSavePosition = () => {
    if (tempPosition) {
      setPositions([...positions, tempPosition]);
      setTempPosition(null);
    }
  };
  const handleCancelPosition = () => {
    setTempPosition(null);
  };
  return (
    <SafeAreaView className="flex-1 bg-[#181818]">
      <View className="flex mx-auto h-auto mt-2 rounded-b-3xl w-full relative">
        <View className="flex  h-auto p-2 flex-row justify-end items-end">
          <View className="w-full    flex-row h-10 items-center justify-between">
            <Text className="flex text-white ml-2  ">vs Roche</Text>

            <View className="flex-row items-center">
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
        </View>
        {showProfileMiniMenu && (
          <View className="flex z-auto bg-red-600 justify-end items-end absolute right-2  top-16">
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
      </View>
      {/* Top Mini Nav Btn groups */}
      {!tempPosition ? (
        <View className="h-10 w-full z-[-1] flex-row items-center justify-between px-2">
          {/* Left buttons */}
          <View className="flex-row space-x-1">
            <TouchableOpacity className="bg-[#242424] w-14  p-2 rounded">
              <Text className="text-white text-center">
                {" "}
                <Icon name="eye" width={14} color="#fff" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#242424] w-14 p-2 rounded">
              <Text className="text-white text-center">1st</Text>
            </TouchableOpacity>
          </View>

          {/* Home and Away buttons */}
          <View className="flex-row ">
            <TouchableOpacity
              className={`p-2 w-16 mx-auto rounded ${
                selected === "Home" ? "bg-[#00E471]" : "bg-[#242424]"
              }`}
              onPress={() => setSelected("Home")}
            >
              <Text
                className={`text-white text-center ${
                  selected === "Home" ? "text-black" : ""
                }`}
              >
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`p-2 w-16 rounded ${
                selected === "Away" ? "bg-[#00E471]" : "bg-[#242424]"
              }`}
              onPress={() => setSelected("Away")}
            >
              <Text
                className={`text-white text-center ${
                  selected === "Away" ? "text-black" : ""
                }`}
              >
                Away
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right buttons */}
          <View className="flex-row space-x-1 z-[-1]">
            <TouchableOpacity className="bg-[#242424] w-14 z-[-1] p-2 rounded">
              <Text className="text-white text-center">
                {" "}
                <Icon name="list-ol" width={14} color="#fff" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#242424] w-14 p-2 rounded">
              <Text className="text-white text-center">
                {" "}
                <Icon name="pen" width={14} color="#fff" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text className="text-white capitalize text-xl font-bold text-center mb-3">
          Confirm {actionSelected}
        </Text>
      )}

      {/* Pitch View */}
      <View
        className={`w-[96%] 
        ${
          tempPosition ? "shadow shadow-[#00E471]/20" : ""
        }  mt-1 mx-auto rounded-md h-[60vh] bg-[#242424] relative`}
        onStartShouldSetResponder={() => true}
        onResponderRelease={handlePitchPress}
      >
        {/* Pitch markings */}
        <View className="h-[1px] w-full bg-gray-700 top-1/2"></View>
        <View className="h-[1px] w-full bg-gray-700 top-1/4"></View>
        <View className="h-[1px] w-full bg-gray-700 top-3/4"></View>
        <View className="h-[1px] w-full bg-gray-700 top-[90%]"></View>
        <View className="h-[1px] w-full bg-gray-700 top-[10%]"></View>

        {showActionAlertError && <AlertComponent />}
        <View style={{ flex: 1 }}>
          {positions.map((position, index) => {
            const actionStyle = actionStyles[position.action];

            if (actionStyle) {
              if (position.action === "TurnOverLoss") {
                return (
                  <View
                    key={index}
                    style={{
                      position: "absolute",
                      top: position.y - 10,
                      left: position.x - 10,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 20,
                      height: 20,
                    }}
                  >
                    <Text style={styles.xMarkerLoss}>X</Text>
                  </View>
                );
              }
              if (position.action === "TurnOverWon") {
                return (
                  <View
                    key={index}
                    style={{
                      position: "absolute",
                      top: position.y - 10,
                      left: position.x - 10,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 20,
                      height: 20,
                    }}
                  >
                    <Text style={styles.xMarkerWon}>X</Text>
                  </View>
                );
              }
              return (
                <View
                  key={index}
                  style={[
                    {
                      position: "absolute",
                      top: position.y - 10,
                      left: position.x - 10,
                    },
                    actionStyle.style,
                  ]}
                >
                  {actionStyle.component || null}
                </View>
              );
            }

            // Default style if action does not match any predefined styles
            return (
              <View
                key={index}
                style={{
                  position: "absolute",
                  top: position.y - 10,
                  left: position.x - 10,
                  width: 15,
                  height: 15,
                  backgroundColor: "#00E471",
                  borderRadius: 10,
                }}
              />
            );
          })}
        </View>
        {tempPosition && (
          <View
            style={{
              position: "absolute",
              top: tempPosition.y - 10,
              left: tempPosition.x - 10,
              width: 20,
              height: 20,
              backgroundColor: "blue",
              borderRadius: 10,
            }}
          />
        )}
      </View>
      {tempPosition && (
        <View
          className="flex flex-row w-3/4 mx-auto "
          // style={styles.saveButtonContainer}
        >
          <TouchableOpacity
            onPress={handleSavePosition}
            className="w-32 mx-auto text-center mt-5 flex rounded-md p-3 border border-[#00E471]"
            // style={styles.saveButton}
          >
            <Text className="text-center w-auto h-auto rounded-full">
              {" "}
              <Icon name="check" width={14} color="#00E471" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancelPosition}
            className="w-32 mx-auto mt-5 flex rounded-md p-3 border border-[#FD5F5F]"
            // style={styles.saveButton}
          >
            <Text className="text-center w-auto h-auto rounded-full">
              {" "}
              <Icon name="ban" width={14} color="#FD5F5F" />
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Bottom Mini Nav Btn Groups */}
      {!tempPosition && (
        <View
          className={`${
            showActionAlertError
              ? "bg-[#00E471]/10 border  rounded-md mx-2  shadow-[#00E471]/20"
              : ""
          }`}
        >
          <View className="h-10 w-full mt-1 flex-row items-center justify-center px-2">
            {/* Left buttons */}
            <View className="flex-row space-x-2 ">
              <TouchableOpacity className="bg-[#242424] w-16 p-2 rounded">
                <Text className="text-[#00E471] text-center">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => gameStatClickHandler("kickoutWon")}
                className={`${
                  actionSelected == "kickoutWon" ? "border border-[#fff]" : ""
                } bg-[#242424] w-16 p-2 rounded`}
              >
                <Text className="text-[#00E471] text-center">Kickout</Text>
              </TouchableOpacity>
            </View>

            {/* Home and Away buttons */}
            <View className="flex-row px-2 ">
              <TouchableOpacity
                className={`${
                  actionSelected == "point" ? "border border-[#fff]" : ""
                }  p-2 w-28 rounded bg-[#242424] `}
                onPress={() => gameStatClickHandler("point")}
              >
                <Text className="text-white text-center">Point</Text>
              </TouchableOpacity>
            </View>

            {/* Right buttons */}
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => gameStatClickHandler("TurnOverWon")}
                className={`${
                  actionSelected == "TurnOverWon" ? "border border-[#fff]" : ""
                } bg-[#242424] w-16 p-2 rounded`}
              >
                <Text className="text-[#00E471] text-center">T/O</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#242424] w-16 p-2 rounded">
                <Text className="text-[#00E471] text-center">Tackle</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="h-10 w-full mx-auto items justify-center flex-row items-center  px-2">
            {/* Left buttons */}
            <View className="flex-row space-x-2">
              <TouchableOpacity className="bg-[#242424] w-16 p-2 rounded">
                <Text className="text-[#FD5F5F] text-center">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => gameStatClickHandler("kickoutLoss")}
                className={`${
                  actionSelected == "kickoutLoss" ? "border border-[#fff]" : ""
                } bg-[#242424] w-16 p-2 rounded`}
              >
                <Text className="text-[#FD5F5F] text-center">Kickout</Text>
              </TouchableOpacity>
            </View>

            {/* Home and Away buttons */}
            <View className="flex-row px-2">
              <TouchableOpacity
                className={`${
                  actionSelected == "Wide" ? "border border-[#fff]" : ""
                }  p-2 w-28 rounded bg-[#242424] `}
                onPress={() => gameStatClickHandler("Wide")}
              >
                <Text className="text-white text-center">Wide</Text>
              </TouchableOpacity>
            </View>

            {/* Right buttons */}
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => gameStatClickHandler("TurnOverLoss")}
                className={`${
                  actionSelected == "TurnOverLoss" ? "border border-[#fff]" : ""
                } bg-[#242424] w-16 p-2 rounded`}
              >
                <Text className="text-[#FD5F5F] text-center">T/O</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#242424] w-16 p-2 rounded">
                <Text className="text-[#FD5F5F] text-center">Tackle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* Bottom Nav  */}
      <View className="w-3/4 flex-1 align-middle justify-center mx-auto text-center"></View>
      <View className="bottom-nav  w-full h-auto">
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeDashboard")}
          className="h-12 w-12 bg-white rounded-full mx-auto text-center"
        >
          <Image
            source={require("../../StatsPro/assets/ball.png")}
            className="h-1/2 p-4 w-1/2 mx-auto justify-center flex my-auto rounded-full"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileMiniMenu: {
    zIndex: 1000,
    position: "absolute",
    right: 0,
    top: 50, // Adjust as needed
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    //  transform: [{ translateX: -50% }],
  },
  saveButton: {
    backgroundColor: "#00E471",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
  },
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
  xMarkerLoss: {
    color: "#FD5F5F",
    fontSize: 12,
    fontWeight: "bold",
  },
  xMarkerWon: {
    color: "#00E471",
    fontSize: 12,
    fontWeight: "bold",
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
