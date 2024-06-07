import React, { useState, useEffect, act } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5"; // FontAwesome5 for newer icons
import { Svg, Path } from "react-native-svg";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faPeopleGroup,
  faEye,
  faChevronLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
export default function App() {
  const navigation = useNavigation();
  const [showProfileMiniMenu, setShowProfileMiniMenu] = useState(false);

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

  const { width } = Dimensions.get("window");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [shootingDirect, setShootingDirection] = useState(null);
  const [selected, setSelected] = useState("Home");
  const [positions, setPositions] = useState([]);
  const [tempPosition, setTempPosition] = useState(null);
  const [actionSelected, setActionSelected] = useState(null);
  const [actionCategorySelected, setActionCategorySelected] = useState(null);
  const [showActionAlertError, setActionAlertError] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerIcon, setTimerIcon] = useState("play");
  const [scoreBoard, setScoreBaord] = useState({ point: 0, goal: 0 });
  const [timerLimitReached, setTimerLimitReached] = useState(false);
  const [showStartGameModal, setShowStartGameModal] = useState(false);
  const [showIngameStatModal, setShowIngameStatModal] = useState(false);
  const [showEditLineupModal, setShowEditLineupModal] = useState(false);
  const [ingameStatModalFilter, setIngameStatModalFilter] = useState("shot");
  const handleStatModalFilter = (filter) => {
    setIngameStatModalFilter(filter);
  };

  // for the player numbers
  const numbers = Array.from({ length: 15 }, (_, i) => i + 1);
  const subNumbers = Array.from({ length: 15 }, (_, i) => i + 16);
  // for the player jersey
  const JerseySvg = ({ number }) => (
    <Svg
      width="50"
      height="50"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M16 4l1.8 2H21v7a2 2 0 0 1-2 2h-3v-2h-2v2H8v-2H6v2H3a2 2 0 0 1-2-2V6h3.2L8 4" />
      <Text x="12" y="16" textAnchor="middle" fontSize="12" fill="black">
        {number}
      </Text>
    </Svg>
  );
  const gameStatClickHandler = (action, actionCategory) => {
    console.log(action);
    setActionSelected(action);
    setActionCategorySelected(actionCategory);
  };
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
  useEffect(() => {
    let interval = null;
    if (isActive && seconds < 600) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (seconds >= 600) {
      setTimerLimitReached(true);
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  const handleGameStart = () => {
    //start time
    handleStart();
    //git rid of modal
    setShowStartGameModal(false);
  };
  const handleStart = () => {
    setSeconds(0);
    setIsActive(true);
    if (timerIcon == "play") {
      setTimerIcon("pause");
    } else {
      setTimerIcon("play");
    }
  };
  const handlePlayPauseClick = () => {
    if (timerIcon == "play") {
      setTimerIcon("pause");
    } else {
      setTimerIcon("play");
    }
    setIsActive(!isActive);
  };
  const StartGameModal = () => {
    return (
      <View className="bg-black/70 z-50 flex w-full h-full absolute">
        <View className="justify-center mx-auto items-center my-auto">
          <TouchableOpacity
            onPress={handleGameStart}
            className="bg-[#00E471]
            px-4 rounded-md
            py-2
            "
          >
            <Text className="text-xl font-semibold">Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const EditCurrentLineupModal = () => {
    return <View className="absolute h-1/2 w-full bg-white bottom-0"></View>;
  };
  const IngameStatPageModal = () => {
    return (
      <View className="bg-black/70 z-50 flex w-full h-screen absolute">
        <View className="justify-center mx-auto items-center my-auto">
          <TouchableOpacity
            onPress={handleGameStart}
            className="bg-[#00E471]
          px-4 rounded-md
          py-2
          "
          >
            <Text className="text-xl font-semibold">Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const shootingDirectionClickHandler = (direction) => {
    setShootingDirection(direction);
    //set the start game modal to show
    setShowStartGameModal(true);
  };
  const handlePitchPress = (event) => {
    //lets see if the user selected a action beofre entering the preview stage
    if (actionSelected) {
      const { locationX, locationY } = event.nativeEvent;
      let score = 0;
      if (actionSelected === "point") {
        score = scoreBoard.point + 1;
      }
      setTempPosition({
        x: locationX,
        y: locationY,
        action: actionSelected,
        actionCategory: actionCategorySelected,
        half: "first",
        score: score,
        player: 0,
        time: seconds,
      });
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
      setTempPosition((prev) => ({
        ...prev,
        player: selectedNumber,
      }));

      setPositions((prev) => [
        ...prev,
        { ...tempPosition, player: selectedNumber },
      ]);
      // clear the selected player number
      setSelectedNumber(null);
      setTempPosition(null);
    }

    // Add the score if it's a point to the useState scoreboard
    if (tempPosition.action === "point") {
      setScoreBaord((prevScoreBoard) => ({
        ...prevScoreBoard,
        point: prevScoreBoard.point + 1,
      }));
    }
  };
  const handleCancelPosition = () => {
    setTempPosition(null);
  };
  const formatTime = (seconds) => {
    if (seconds < 120) {
      return `${Math.floor(seconds / 60)} `;
    } else {
      return `${Math.floor(seconds / 60)} `;
    }
  };
  const filteredPositions =
    ingameStatModalFilter === "All"
      ? positions
      : positions.filter(
          (position) => position.actionCategory === ingameStatModalFilter
        );
  return (
    <SafeAreaView className="flex-1 bg-[#181818]  overflow-visible">
      <ScrollView>
        {showStartGameModal && <StartGameModal />}

        <View className="flex mx-auto h-auto mt-2 rounded-b-3xl w-full relative">
          <View className="flex  h-auto space-x-1 p-2 flex-row justify-end items-end">
            <View className="w-[98%]     flex-row h-10 items-center justif-center mx-auto rounded-lg">
              <View className="w-[15%] space-x-1 bg-[#242424] px-3   py-2 rounded-md ">
                <View className="w-full flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={25}
                    color="#00E471"
                  />
                </View>
              </View>
              <View className="w-[15%]  h-full justify-center text-center ">
                <Text className="text-center font-bold text-lg text-white">
                  {Math.floor(seconds / 60)}:
                  {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
                </Text>
              </View>
              <View className="w-[40%] h-full justify-center text-center">
                <Text className="text-center font-bold text-xl text-white">
                  {scoreBoard.goal}:{scoreBoard.point}
                </Text>
              </View>
              <View className="w-[15%] text-center  h-full ">
                <Text className="text-center text-black mx-auto my-auto">
                  {/* <Icon name="pause" width={14} color="#FD5F5F" /> */}
                  <TouchableOpacity
                    onPress={handlePlayPauseClick}
                    title="Start Timer"
                    disabled={timerLimitReached}
                  >
                    <Icon name={timerIcon} width={16} color="#fff" />
                    {/* <Text className="text-white"></Text> */}
                  </TouchableOpacity>
                </Text>
              </View>
              <View className="  w-[15%]  font-extrabold text-2xl text-center">
                <TouchableOpacity
                  onPress={() => setShowProfileMiniMenu(!showProfileMiniMenu)}
                  className=" h-10 cursor-pointer w-full rounded-md justify-center mx-auto items-center"
                >
                  {!showProfileMiniMenu ? (
                    <View className="w-[50%] flex justify-center items-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        size={20}
                        color="#00E471"
                      />
                    </View>
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
        {!tempPosition && shootingDirect && !showIngameStatModal ? (
          <View className="h-10 w-[95%] mx-auto z-[-1] flex-row items-center justify-center ">
            {/* Left buttons */}
            <View className="flex-row s w-[30%] space-x-1  justify-center">
              <TouchableOpacity className="bg-[#242424] w-[50%]  p-2 rounded-md">
                <Text className="text-white text-center">
                  {/* <Icon name="eye" width={14} color="#fff" /> */}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowEditLineupModal(!showEditLineupModal)}
                className="bg-[#242424] w-[50%] p-2 rounded flex justify-center items-center"
              >
                <View className="w-full flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faPeopleGroup}
                    size={25}
                    color="#FFFFFF"
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Home and Away buttons */}
            <View className="flex-row w-[40%]  justify-center   ">
              <TouchableOpacity
                onPress={() => setShowIngameStatModal(!showIngameStatModal)}
                className={`p-2 w-[90%] h-10 mx-auto bg-[#242424] rounded `}
              >
                <Text className={`text-white text-cente my-auto mx-auto `}>
                  Game Stats
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                className={`p-2 w-[50%] mx-auto rounded ${
                  selected === "Home"
                    ? "border border-[#00E471]"
                    : "bg-[#242424]"
                }`}
                onPress={() => setSelected("Home")}
              >
                <Text
                  className={`text-white text-center ${
                    selected === "Home" ? "text-[#00E471]" : ""
                  }`}
                >
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`p-2 w-[50%] rounded ${
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
              </TouchableOpacity> */}
            </View>

            {/* Right buttons */}
            <View className="flex-row space-x-1  z-[-1]  w-[30%] justify-center  ">
              <TouchableOpacity
                onPress={() => setShowIngameStatModal(!showIngameStatModal)}
                className="bg-[#242424] w-[50%] z-[-1] border-b-2 border-b-[#00E471] p-2 rounded"
              >
                <View className="w-full flex justify-center items-center">
                  <FontAwesomeIcon icon={faEye} size={25} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#242424] w-[50%] p-2 rounded">
                <Text className="text-white text-center">
                  {/* <Icon name="pen" width={14} color="#fff" /> */}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          ""
        )}
        {showIngameStatModal && (
          <View className="w-[96%] h-auto  relative pb-2 mx-auto">
            <View className="w-full absolute right-0 z-50 flex-row  h-auto">
              <TouchableOpacity
                onPress={() => setShowIngameStatModal(false)}
                className=" ml-5 p-2 right-2 top-3 absolute "
              >
                <Text className="text-xl text-white rounded-full w-full">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    size={35}
                    color="#FFFFFF"
                  />
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full  p-2 mx-auto text-center justify-center">
              <View className="h-10 w-full z-[-1]  flex-row items-center justify-between">
                {/* Left buttons */}
                <View className="flex-row mx-auto">
                  <TouchableOpacity
                    onPress={() => handleStatModalFilter("shot")}
                    className={`bg-[#242424] ${
                      ingameStatModalFilter === "shot"
                        ? "border border-green-500"
                        : ""
                    }  w-16 p-2 rounded`}
                  >
                    <Text className="text-white text-center">Shots</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleStatModalFilter("kickout")}
                    className={`bg-[#242424] ${
                      ingameStatModalFilter === "kickout"
                        ? "border border-green-500"
                        : ""
                    }  w-auto p-2 rounded`}
                  >
                    <Text className="text-white text-center">Kickouts</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleStatModalFilter("T/O")}
                    className={`bg-[#242424] ${
                      ingameStatModalFilter === "T/O"
                        ? "border border-green-500"
                        : ""
                    }  w-16 p-2 rounded`}
                  >
                    <Text className="text-white text-center">T/O's</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleStatModalFilter("All")}
                    className={`bg-[#242424] ${
                      ingameStatModalFilter === "All"
                        ? "border border-green-500"
                        : ""
                    }  w-16 p-2 rounded`}
                  >
                    <Text className="text-white text-center">All</Text>
                  </TouchableOpacity>
                </View>

                {/* Home and Away buttons */}
                <View className="flex-row"></View>
              </View>
              <View className="flex-row text-white">
                <Text className="w-1/4 p-1 text-white text-center">Min</Text>
                <Text className="w-1/4 p-1 text-white text-center">Action</Text>
                <Text className="w-1/4 p-1 text-white text-center">Player</Text>
                <Text className="w-1/4 p-1 text-white text-center">Score</Text>
              </View>
              {filteredPositions.map((position, index) => (
                <TouchableOpacity
                  onLongPress={() => {
                    console.log("longpressed");
                  }}
                  onPress={() => {
                    console.log("pressed");
                  }}
                  key={index}
                  className={`flex-row justify-center py-1 rounded-md mx-1 text-white ${
                    index % 2 === 0 ? "bg-white/10" : ""
                  } `}
                >
                  <Text className="w-1/4 p-1 text-gray-400 text-center">
                    {formatTime(position.time)}
                  </Text>
                  <Text className="w-1/4 p-1 text-gray-400 text-center">
                    {position.action}
                  </Text>
                  <Text className="w-1/4 p-1 text-gray-400 text-center">
                    {position.player}
                  </Text>
                  <Text className="w-1/4 p-1 text-gray-400 text-center">
                    0:{position.score}
                  </Text>
                </TouchableOpacity>
              ))}
              {/* <View className="w-auto justify-end flex flex-row  bg-blue-600 items-end">
                <View className="bg-red-600 h-5 w-auto right-5 mx-2">
                  <Text>Edit</Text>
                </View>
                <View className="bg-red-600 h-5 w-auto right-5">
                  <Text>Edit</Text>
                </View>
              </View> */}
            </View>
          </View>
        )}
        {actionSelected && <Text></Text>}
        {/* Pitch View */}

        <View
          className={`w-[96%] border-[.5px] border-gray-700
        ${
          tempPosition ? "shadow shadow-[#00E471]/20" : ""
        }  mt-2 mx-auto z-10 rounded-md h-[65vh] bg-[#242424]  relative`}
          onStartShouldSetResponder={() => true}
          onResponderRelease={handlePitchPress}
        >
          {/* this section of code will be rendered if the user has not selected which side of the pitch the home team is shooting into */}
          {!shootingDirect && (
            <>
              <TouchableOpacity
                onPress={() => shootingDirectionClickHandler("up")}
                className="bg-[#00E471]/50 w-2/4 z-50 left-1/4 mx-auto text-center items-center jus h-12 absolute"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => shootingDirectionClickHandler("down")}
                className="bg-[#00E471]/50 w-2/4 z-50 left-1/4 bottom-0  h-12 absolute"
              ></TouchableOpacity>
            </>
          )}

          {/* Pitch markings */}
          <View
            className="h-[1px] w-full bg-gray-700 absolute"
            style={{ top: "10%" }}
          ></View>
          <View
            className="h-[1px] w-full bg-gray-700 absolute"
            style={{ top: "15.4%" }}
          ></View>
          <View
            className="h-[1px] w-full bg-gray-700 absolute"
            style={{ top: "34.6%" }}
          ></View>
          <View
            className="h-[1px] w-full bg-gray-700 absolute"
            style={{ top: "50%" }}
          ></View>
          <View
            className="h-[1px] w-full bg-gray-700 absolute"
            style={{ top: "65%" }}
          ></View>
          <View
            className="h-[1px] w-full bg-gray-700 absolute"
            style={{ top: "90%" }}
          ></View>
          <View
            className="h-[1px] w-full bg-gray-700 absolute"
            style={{ top: "84.6%" }}
          ></View>
          {/* <View
            className=" border-2 absolute z-[-10] border-gray-700 left-[37.5%] top-[15.4%] rotate-180 h-[10%] w-[25%] mx-auto
            rounded-tl-full rounded-tr-full"
          ></View> */}
          {/* 
   
         
        
    
         
        

    
      */}
          {/* semi circles */}
          {/*  */}

          {shootingDirect === "up" ? (
            <>
              <View className="absolute h-2 border-b-[1px] w-[10%] left-[45%] border-l-[1px] border-r-[1px] border-green-50"></View>
              <View className="absolute h-4 top-2 w-[10%] left-[45%] border-l-[1px] border-r-[1px] border-green-50"></View>
            </>
          ) : shootingDirect === "down" ? (
            <>
              <View className="absolute h-2 border-t-[1px] w-[10%] bottom-0 left-[45%] border-l-[1px] border-r-[1px] border-green-50"></View>
              <View className="absolute h-4 bottom-2 w-[10%] bottom-2 left-[45%] border-l-[1px] border-r-[1px] border-green-50"></View>
            </>
          ) : (
            <>
              {/* This will be printed when shootingDirect is neither "up" nor "down" */}
              <View className="absolute h-2 border-b-[1px] w-[10%] left-[45%] border-l-[1px] border-r-[1px] border-green-50"></View>
              <View className="absolute h-4 top-2 w-[10%] left-[45%] border-l-[1px] border-r-[1px] border-green-50"></View>
              <View className="absolute h-2 border-t-[1px] w-[10%] bottom-0 left-[45%] border-l-[1px] border-r-[1px] border-green-50"></View>
              <View className="absolute h-4 bottom-2 w-[10%] bottom-2 left-[45%] border-l-[1px] border-r-[1px] border-green-50"></View>
            </>
          )}

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
        {!shootingDirect && (
          <Text className="text-white text-xl mb-5 text-center mx-auto flex mt-10">
            Select Shooting Goals
          </Text>
        )}
        {tempPosition && (
          <>
            {/* <Text className="text-white text-center">Select Player</Text> */}
            <View className="h-auto  border-white/10 p-2 rounded-md w-4full mt-5 mx-auto">
              <FlatList
                data={numbers}
                horizontal
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex justify-center items-center mx-2"
                    style={{ width: width / 5, height: 50 }}
                    onPress={() => setSelectedNumber(item)}
                  >
                    <ImageBackground
                      source={require("../assets/jersey.png")}
                      resizeMode="contain"
                      className={`flex justify-center items-center ${
                        item === selectedNumber
                          ? "border-b border-b-1 border-b-green-500"
                          : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <Text
                        className={`text-base font-bold ${
                          item === selectedNumber ? "text-black" : "text-black"
                        }`}
                      >
                        {item}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View
              className="flex flex-row w-2/4 mx-auto mt-3   "
              // style={styles.saveButtonContainer}
            >
              <TouchableOpacity
                onPress={handleSavePosition}
                className={`flex
                ${selectedNumber != null ? "" : "hidden"}
                w-[50%] mx-auto text-center     rounded-md p-3 border border-[#00E471]`}
                // style={styles.saveButton}
              >
                <Text className="text-center w-auto h-auto rounded-full">
                  {" "}
                  <Icon name="check" width={14} color="#00E471" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelPosition}
                className="w-[50%] mx-auto justify-center items-center m flex rounded-md p-3 border border-[#FD5F5F]"
                // style={styles.saveButton}
              >
                <Text className="text-center w-auto h-auto rounded-full">
                  {" "}
                  <Icon name="ban" width={14} color="#FD5F5F" />
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {/* Bottom Mini Nav Btn Groups */}
        {!tempPosition && shootingDirect && (
          <View
            className={`${
              showActionAlertError
                ? "bg-[#00E471]/10 border  rounded-md mx-2  shadow-[#00E471]/20"
                : ""
            }`}
          >
            <View className="h-10  w-full mt-1 flex-row items-center justify-center px-5">
              {/* Left buttons */}
              <View className="flex-row space-x-2 mx-auto  justify-center w-[35%] ">
                <TouchableOpacity className="bg-[#242424] w-[50%] p-2 rounded">
                  <Text className="text-[#00E471] text-center">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => gameStatClickHandler("kickoutWon", "kickout")}
                  className={`${
                    actionSelected == "kickoutWon"
                      ? "border border-b-[#fff]"
                      : ""
                  } bg-[#242424] w-[50%] p-2 rounded`}
                >
                  <Text className="text-[#00E471] text-center">Kickout</Text>
                </TouchableOpacity>
              </View>

              {/* Home and Away buttons */}
              <View className="flex-row px-2 w-[30%] justify-center">
                <TouchableOpacity
                  className={`${
                    actionSelected == "point" ? "border border-b-[#fff]" : ""
                  }  p-2 w-[100%] rounded bg-[#242424] `}
                  onPress={() => gameStatClickHandler("point", "shot")}
                >
                  <Text className="text-white text-center">Point</Text>
                </TouchableOpacity>
              </View>

              {/* Right buttons */}
              <View className="flex-row space-x-2 justify-center  w-[35%]">
                <TouchableOpacity
                  onPress={() => gameStatClickHandler("TurnOverWon", "T/O")}
                  className={`${
                    actionSelected == "TurnOverWon"
                      ? "border border-b-[#fff]"
                      : ""
                  } bg-[#242424] w-[50%] p-2 rounded`}
                >
                  <Text className="text-[#00E471] text-center">T/O</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#242424] w-[50%] p-2 rounded">
                  <Text className="text-[#00E471] text-center">Tackle</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="h-10 w-full   mx-auto items justify-center flex-row items-center  px-5">
              {/* Left buttons */}
              <View className="flex-row space-x-2 justify-center w-[35%]">
                <TouchableOpacity className="bg-[#242424] w-[50%] p-2 rounded">
                  <Text className="text-[#FD5F5F] text-center">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => gameStatClickHandler("kickoutLoss", "kickout")}
                  className={`${
                    actionSelected == "kickoutLoss"
                      ? "border border-b-[#fff]"
                      : ""
                  } bg-[#242424] w-[50%] p-2 rounded`}
                >
                  <Text className="text-[#FD5F5F] text-center">Kickout</Text>
                </TouchableOpacity>
              </View>

              {/* Home and Away buttons */}
              <View className="flex-row px-2 w-[30%] justify-center ">
                <TouchableOpacity
                  className={`${
                    actionSelected == "Wide" ? "border border-b-[#fff]" : ""
                  }  p-2 w-[100%] rounded bg-[#242424] `}
                  onPress={() => gameStatClickHandler("Wide", "shot")}
                >
                  <Text className="text-white text-center">Wide</Text>
                </TouchableOpacity>
              </View>

              {/* Right buttons */}
              <View className="flex-row space-x-2 justify-center w-[35%]">
                <TouchableOpacity
                  onPress={() => gameStatClickHandler("TurnOverLoss", "T/O")}
                  className={`${
                    actionSelected == "TurnOverLoss"
                      ? "border border-b-[#fff]"
                      : ""
                  } bg-[#242424] w-[50%] p-2 rounded`}
                >
                  <Text className="text-[#FD5F5F] text-center">T/O</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#242424] w-[50%] p-2 rounded">
                  <Text className="text-[#FD5F5F] text-center">Tackle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Bottom Nav  */}

        {/* <View className="w-20 bg-red-400 my-auto justify-center items-center mt-4 ml-4">
        <Text style={styles.timer}>
          {Math.floor(seconds / 60)}:
          {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
        </Text>
        <TouchableOpacity
          onPress={handleStart}
          title="Start Timer"
          disabled={isActive}
        >
          <Text>Startrr</Text>
        </TouchableOpacity>
      </View> */}
        {/* <View className="flex-row fixed  align-bottom mt-4 bg-red-600 justify-center w-full ">
          <View className="w-1/4 " />
          <View className="w-1/4 flex justify-center items-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("HomeDashboard")}
              className="h-12  z-50 w-12 bg-white rounded-full justify-center items-center"
            >
              <Image
                source={require("../../StatsPro/assets/ball.png")}
                className="h-1/2 w-1/2 p-2 justify-center items-center rounded-full"
              />
            </TouchableOpacity>
          </View>
          <View className="w-1/4 " />
        </View> */}
      </ScrollView>
      {showEditLineupModal && (
        <>
          <TouchableOpacity
            onPress={() => setShowEditLineupModal(false)}
            className="h-1/2 w-full  absolute top-0"
          ></TouchableOpacity>
          <View className="w-full absolute h-1/2 rounded-t-3xl bg-white bottom-0">
            <TouchableOpacity
              onPress={() => setShowEditLineupModal(false)}
              className="absolute w-10 h-10 right-5 top-5 "
            >
              <Text className="text-center my-auto">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  size={35}
                  color="#030303"
                />
              </Text>
            </TouchableOpacity>
            <View className=" py-10 w-full ">
              <Text className="text-center my-auto text-lg font-semibold">
                Make a Substitution
              </Text>
            </View>
            <View className="flex-1 ">
              <Text className="ml-2 mx-auto">On Field</Text>
              <FlatList
                data={numbers}
                horizontal
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex my-auto justify-center items-center mx-2"
                    style={{ width: width / 5, height: 50 }}
                    onPress={() => setSelectedNumber(item)}
                  >
                    <ImageBackground
                      source={require("../assets/jersey.png")}
                      resizeMode="contain"
                      className={`flex justify-center items-center ${
                        item === selectedNumber
                          ? "border-b border-b-1 border-b-green-500"
                          : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <Text
                        className={`text-base font-bold ${
                          item === selectedNumber ? "text-black" : "text-black"
                        }`}
                      >
                        {item}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View className="flex-1 ">
              <Text className="mx-auto">Bench</Text>
              <FlatList
                data={subNumbers}
                horizontal
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex my-auto justify-center items-center mx-2"
                    style={{ width: width / 5, height: 50 }}
                    onPress={() => setSelectedNumber(item)}
                  >
                    <ImageBackground
                      source={require("../assets/jersey.png")}
                      resizeMode="contain"
                      className={`flex justify-center items-center ${
                        item === selectedNumber
                          ? "border-b border-b-1 border-b-green-500"
                          : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <Text
                        className={`text-base font-bold ${
                          item === selectedNumber ? "text-black" : "text-black"
                        }`}
                      >
                        {item}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View className="flex-1 ">
              <TouchableOpacity className="rounded-md mx-auto my-auto p-2 w-1/4 bg-green-500">
                <Text className="text-center font-semibold textlg">
                  Make Sub
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
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
