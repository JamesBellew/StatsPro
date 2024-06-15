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
  faStopwatch,
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
    turnOverLoss: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        // borderColor: "#fff",
        backgroundColor: "#242424",
        justifyContent: "center",
        alignItems: "center",
      },
      component: <Text style={styles.xMarkerLoss}>X</Text>,
    },
    turnOverWon: {
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
    free: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#00E471",
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
    point: {
      style: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: "#00E471",
      },
    },
    short: {
      style: {
        width: 8,
        height: 8,

        borderRadius: 10,

        backgroundColor: "#f21b3f",
      },
    },
    miss: {
      style: {
        width: 8,
        height: 8,

        borderRadius: 10,

        backgroundColor: "#f21b3f",
      },
    },
    goal: {
      style: {
        width: 8,
        height: 8,

        borderRadius: 10,

        backgroundColor: "#00E471",
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
  const [longPressedId, setLongPressedId] = useState(null); // State for long-pressed item ID
  const [actionTimeStamp, setActionTimeStamp] = useState(0);
  const [showEditTimerModal, setShowEditTimeModal] = useState(false);
  const [currentHalf, setCurrentHalf] = useState(1);
  const [showActionShotMenu, setshowActionShotMenu] = useState(false);
  const [showTimerAlert, setShowTimerAlert] = useState(true);
  const [showHalftimeModal, setShowHalftimeModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showActionsOnPitchFilter, setShowActionsOnPitchFilter] =
    useState("all");
  const [showActionsOnPitch, setShowActionsOnPitch] = useState(false);
  const [actionMenuActionCategory, setActionMenuActionCategory] =
    useState(null);
  const [substitution, setSubstitution] = useState([
    {
      startingPlayer: null,
      subPlayer: null,
    },
  ]);
  const [actions, setActions] = useState([
    {
      category: "shot",
      action: "point",
      label: "point",
    },
    {
      category: "shot",
      action: "goal",
      label: "goal",
    },
    {
      category: "shot",
      action: "free",
      label: "free",
    },
    {
      category: "shot",
      action: "miss",
      label: "miss",
    },
    {
      category: "shot",
      action: "short",
      label: "short",
    },
    {
      category: "kickout",
      action: "kickoutCatch",
      label: "Catch",
    },
    {
      category: "kickout",
      action: "kickoutBreakWon",
      label: "Break Won",
    },
    {
      category: "kickout",
      action: "kickoutOppBreak",
      label: "Opp Break",
    },
    {
      category: "kickout",
      action: "kickOppCatch",
      label: "Opp Catch",
    },

    {
      category: "kickout",
      action: "kickoutOut",
      label: "Out",
    },
    {
      category: "T/O",
      action: "turnOverWon",
      label: "T/O Won",
    },

    {
      category: "T/O",
      action: "turnOverLoss",
      label: "T/O Loss",
    },
  ]);
  const initialLineUp = [];
  for (let i = 1; i <= 32; i++) {
    initialLineUp.push({
      playerNumber: i,
      onPitch: i <= 15,
      playerName: `Player ${i}`,
    });
  }
  const makeSubstitute = (onPitchPlayerNumber, benchPlayerNumber) => {
    setLineUp((prevLineUp) =>
      prevLineUp.map((player) => {
        if (player.playerNumber === onPitchPlayerNumber) {
          return { ...player, onPitch: false };
        }
        if (player.playerNumber === benchPlayerNumber) {
          return { ...player, onPitch: true };
        }
        return player;
      })
    );
    //close the modal for making the sub
    setShowEditLineupModal(false);
  };

  const [lineUp, setLineUp] = useState(initialLineUp);
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

    // setShowActionMenu(!showActionMenu);
    setshowActionShotMenu(false);
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
    // 2100 is 35 mins
    if (isActive && seconds < 60) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (seconds >= 60) {
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
  const [idCounter, setIdCounter] = useState(1);
  const handlePitchPress = (event) => {
    if (actionSelected) {
      const { locationX, locationY } = event.nativeEvent;
      let score = 0;
      if (actionSelected === "point") {
        score = scoreBoard.point + 1;
      }
      setActionTimeStamp(seconds);
      setTempPosition({
        id: idCounter, // Add the ID here
        x: locationX,
        y: locationY,
        action: actionSelected,
        actionCategory: actionCategorySelected,
        half: "first",
        score: score,
        half: currentHalf,
        player: 0,
        time: actionTimeStamp,
      });
      console.log(tempPosition);
      //want to set the time for the point selector so that the user can change the timestamp if needed

      // Increment the ID counter
      setIdCounter((prevIdCounter) => prevIdCounter + 1);

      //assign a unknown player for if the action is nto a shot or T/0
      if (actionCategorySelected != "shot") {
        setSelectedNumber(0);
      } else {
        setSelectedNumber(null);
      }
    } else {
      // The user did not select an action
      setActionAlertError(true);
      setTimeout(() => {
        setActionAlertError(false);
      }, 2000);
    }
  };
  const uniqueCategories = Array.from(
    new Set(actions.map((item) => item.category))
  );
  const handleSavePosition = () => {
    if (tempPosition) {
      setTempPosition((prev) => ({
        ...prev,
        player: selectedNumber,
      }));
      console.log("im here boiiiiii");
      console.log(actionTimeStamp);
      setPositions((prev) => [
        ...prev,
        { ...tempPosition, player: selectedNumber, time: actionTimeStamp },
      ]);
      // console.log("=================CHECKING SOMETHING===============");
      // positions.forEach((position) => {
      //   console.log(position);
      //   console.log(""); // Add a blank line
      // });
      // console.log("====================================");
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
    if (tempPosition.action === "goal") {
      setScoreBaord((prevScoreBoard) => ({
        ...prevScoreBoard,
        goal: prevScoreBoard.goal + 1,
      }));
    }
  };
  const handleCancelPosition = () => {
    setTempPosition(null);
  };
  const deletePositionById = (id, action) => {
    setPositions((prevPositions) =>
      prevPositions.filter((position) => position.id !== id)
    );

    if (action === "point") {
      setScoreBaord((prevScoreBoard) => ({
        ...prevScoreBoard,
        point: prevScoreBoard.point - 1,
      }));
    }
    if (action === "goal") {
      setScoreBaord((prevScoreBoard) => ({
        ...prevScoreBoard,
        goal: prevScoreBoard.goal - 1,
      }));
    }
  };
  const formatTime = (seconds) => {
    if (seconds < 120) {
      return `${Math.floor(seconds / 60)} `;
    } else {
      return `${Math.floor(seconds / 60)} `;
    }
  };

  const displayedPositions = positions.filter((position) => {
    if (showActionsOnPitchFilter === "all") return true;
    if (showActionsOnPitchFilter === "none") return false;
    return position.actionCategory === showActionsOnPitchFilter;
  });
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
        {timerLimitReached && showTimerAlert && (
          <>
            <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <Text className="font-bold">35 minutes reached!</Text>
              <Text className="block sm:inline">
                Click on the highligted whistle Icon to start second half
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimerAlert(false)}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <Svg
                  className="fill-current h-6 w-6 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <Path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </Svg>
              </TouchableOpacity>
            </View>
          </>
        )}
        <View className="flex mx-auto h-auto   rounded-b-3xl w-full relative">
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
              <TouchableOpacity
                onPress={() => setShowEditTimeModal(true)}
                className={`${
                  showEditTimerModal ? "border-b-2 border-b-green-500" : ""
                } w-[15%]  rounded-md  h-full justify-center text-center `}
              >
                <Text className="text-center font-bold text-lg text-white">
                  {Math.floor(seconds / 60)}:
                  {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
                </Text>
              </TouchableOpacity>
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
        {!tempPosition && shootingDirect ? (
          <View className="h-10 w-[95%] mx-auto z-[-1] flex-row items-center justify-center ">
            {/* Left buttons */}
            <View className="flex-row s w-[30%] space-x-1  justify-center">
              <TouchableOpacity
                onPress={() => setShowHalftimeModal(!showHalftimeModal)}
                className={`bg-[#242424] w-[50%]  p-2 rounded-md
                
                ${
                  timerLimitReached
                    ? " shadow-inner shadow-sm shadow-green-500"
                    : ""
                }
                
                `}
              >
                <Text className="text-white my-auto mx-auto text-center">
                  <FontAwesomeIcon
                    icon={faStopwatch}
                    size={23}
                    color="#FFFFFF"
                  />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowEditLineupModal(!showEditLineupModal);
                  //get rid of any other modals here
                  setShowIngameStatModal(false);
                }}
                className={` ${
                  showEditLineupModal ? "border-b-2 border-b-green-500" : ""
                } bg-[#242424] w-[50%] p-2 rounded flex justify-center items-center`}
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
                className={`  ${
                  showIngameStatModal ? "border-b-2 border-b-green-500" : ""
                } p-2 w-[90%] h-10 mx-auto bg-[#242424] rounded `}
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
                onPress={() => setShowActionsOnPitch(!showActionsOnPitch)}
                className={`${
                  showActionsOnPitch ? "border-b-2 border-b-[#00E471]" : ""
                } bg-[#242424] w-[50%] z-[-1]  p-2 rounded`}
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

        {/* {actionSelected && <Text></Text>} */}
        {/* Pitch View */}
        {showActionsOnPitch && !tempPosition && (
          <View className="  justify-center items-center h-auto py-2 w-[80%] flex-row rounded-md mx-auto">
            {uniqueCategories.map((category, index) => {
              const item = actions.find(
                (action) => action.category === category
              );
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setShowActionsOnPitchFilter(item.category);
                  }}
                  className={`
        ${
          showActionsOnPitchFilter === item.category
            ? "border-b-2 border-b-green-500"
            : ""
        }
        w-1/5 rounded-md mx-auto mx-1 py-2  items-center justify-center`}
                >
                  <Text className="text-center text-white">
                    {item.category}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setShowActionsOnPitchFilter("all");
              }}
              className={`
              ${
                showActionsOnPitchFilter === "all"
                  ? "border-b-2 border-b-green-500"
                  : ""
              }
              w-1/5 rounded-md mx-auto mx-1 py-2  items-center justify-center`}
            >
              <Text className="text-center text-white">All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowActionsOnPitchFilter("none");
              }}
              className={`
              ${
                showActionsOnPitchFilter === "none"
                  ? "border-b-2 border-b-green-500"
                  : ""
              }
              w-1/5 rounded-md mx-auto mx-1 py-2  items-center justify-center`}
            >
              <Text className="text-center text-white">None</Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          className={`w-[96%] mt-1 border-[.5px] border-gray-700
        ${
          tempPosition ? "shadow shadow-[#00E471]/20" : ""
        }   mx-auto  rounded-md h-[63vh] bg-[#1b1b1b]  relative`}
          onStartShouldSetResponder={() => true}
          onResponderRelease={handlePitchPress}
          style={{ zIndex: 1 }}
        >
          {/* this section of code will be rendered if the user has not selected which side of the pitch the home team is shooting into */}
          {!shootingDirect && (
            <>
              <TouchableOpacity
                onPress={() => shootingDirectionClickHandler("up")}
                className="bg-[#00E471]/50 w-full z-50 mx-auto text-center items-center jus h-[10%] absolute"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => shootingDirectionClickHandler("down")}
                className="bg-[#00E471]/50 w-full z-50  bottom-0  h-[10%] absolute"
              ></TouchableOpacity>
            </>
          )}

          {/* Pitch markings */}
          <View className="absolute w-full h-full" style={{ zIndex: 0 }}>
            <View
              className="h-[1px] w-[20%] left-[40%] bg-gray-700 absolute"
              style={{ top: "57.5%" }}
            ></View>
            <View
              className="h-[1px] w-full bg-gray-700 absolute"
              style={{ top: "10%" }}
            ></View>
            <View
              className="absolute border-[1px] border-gray-600 w-28 h-12 rounded-bl-full rounded-br-full"
              style={{
                top: "15.4%",
                left: "50%",
                zIndex: "0",
                transform: [{ translateX: -56 }],
              }}
            ></View>
            <View
              className="absolute border-[1px] border-gray-600 w-28 h-12 rounded-bl-full rounded-br-full"
              style={{
                top: "84.6%",
                zIndex: 0,
                left: "50%",
                transform: [
                  { translateX: -56 },
                  { scaleY: -1 },
                  { translateY: 47 },
                ],
              }}
            ></View>
            <View
              className="w-28 border-l-[1px] border-r-[1px] border-gray-700 absolute"
              style={{
                top: "90%",
                height: "10%",
                left: "50%",
                transform: [{ translateX: -56 }],
              }}
            ></View>
            <View
              className="w-28 border-l-[1px] border-r-[1px] border-gray-700 absolute"
              style={{
                top: "0%",
                height: "10%",
                left: "50%",
                transform: [{ translateX: -56 }],
              }}
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
          </View>
          {/* semi circles */}

          {shootingDirect === "up" ? (
            <>
              <View
                style={{ zIndex: 0 }}
                className="absolute h-2 border-b-[1px] w-[10%] left-[45%] border-l-[1px] border-r-[1px] border-green-50"
              ></View>
              <View
                style={{ zIndex: 0 }}
                className="absolute h-4 top-2 w-[10%] left-[45%] border-l-[1px] border-r-[1px] border-green-50"
              ></View>
            </>
          ) : shootingDirect === "down" ? (
            <>
              <View
                style={{ zIndex: 0 }}
                className="absolute h-2 border-t-[1px] w-[10%] bottom-0 left-[45%] border-l-[1px] border-r-[1px] border-green-50"
              ></View>
              <View
                style={{ zIndex: 0 }}
                className="absolute h-4 bottom-2 w-[10%] bottom-2 left-[45%] border-l-[1px] border-r-[1px] border-green-50"
              ></View>
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
            {displayedPositions.map((position, index) => {
              const actionStyle = actionStyles[position.action];

              if (actionStyle) {
                if (position.action === "turnOverLoss") {
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
                if (position.action === "turnOverWon") {
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
                    backgroundColor: "#FFF",
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
            <View className="h-auto  border-white/10 p-2 rounded-md w-4full mt-2 mx-auto">
              <FlatList
                data={lineUp.filter((player) => player.onPitch)}
                horizontal
                keyExtractor={(item) => item.playerNumber.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex my-auto justify-center  items-center mx-2"
                    style={{ width: width / 8, height: 50 }}
                    onPress={() => setSelectedNumber(item.playerNumber)}
                  >
                    <ImageBackground
                      source={require("../assets/jersey.png")}
                      resizeMode="contain"
                      className={`flex justify-center items-center ${
                        item.playerNumber === selectedNumber
                          ? "border-b border-b-1 border-b-green-500"
                          : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <Text
                        className={`text-base font-bold ${
                          item.playerNumber === substitution.startingPlayer
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        {item.playerNumber}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
              <View className="flex-row justify-center ">
                <TouchableOpacity
                  onPress={() => {
                    if (actionTimeStamp > 60) {
                      setActionTimeStamp(actionTimeStamp - 60);
                    }
                  }}
                  className="w-10 h-10 justify-center items-center my-auto mr-2 bg-[#242424] rounded-full p-2"
                >
                  <Text className="text-white text-center my-auto font-bold">
                    -
                  </Text>
                </TouchableOpacity>
                <Text className="text-center font-bold items-center my-auto text-lg  text-white">
                  {Math.floor(actionTimeStamp / 60)} Min
                </Text>
                <TouchableOpacity
                  className="w-10 h-10 justify-center items-center my-auto ml-2 bg-[#242424] rounded-full p-2"
                  onPress={() => {
                    setActionTimeStamp((prevTimeStamp) => {
                      const newTimeStamp = Number(prevTimeStamp);
                      if (newTimeStamp < 2100) {
                        return newTimeStamp + 60;
                      }
                      return newTimeStamp;
                    });
                  }}
                >
                  <Text className="text-white">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              className="flex flex-row  w-2/4 mx-auto    "
              // style={styles.saveButtonContainer}
            >
              <TouchableOpacity
                onPress={handleCancelPosition}
                className={`flex

               flex-1 mx-auto text-center     rounded-md p-3 border bg-[#FD5F5F]`}
                // style={styles.saveButton}
              >
                <Text className="text-center w-auto h-auto rounded-full">
                  <Icon name="ban" width={14} color="#242424" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSavePosition}
                className={`  flex-1  flex     ${
                  selectedNumber != null ? "" : "hidden"
                }  mx-auto justify-center items-center m  rounded-md p-3 border bg-[#00E471]  `}
                // style={styles.saveButton}
              >
                <Text className="text-center w-auto h-auto rounded-full">
                  <Icon name="check" width={14} color="#242424" />
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {/* Bottom Mini Nav Btn Groups */}

        {!tempPosition && shootingDirect && (
          <View
            className={`  w-[96%] mx-auto rounded-md mt-2 ${
              showActionAlertError
                ? "bg-[#00E471]/10 border  rounded-md   shadow-[#00E471]/20"
                : ""
            }`}
          >
            <View className="h-10 w-[97%] mx-auto  mt-1 flex-row items-center justify-center px-1">
              {/* Left buttons */}
              <View className="flex-row space-x-1 mx-auto items-center justify-center w-[40%]">
                <TouchableOpacity className="bg-[#242424] w-[50%] p-2 rounded">
                  <Text className="text-white text-center">Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (
                      actionMenuActionCategory === "kickout" &&
                      showActionMenu === true
                    ) {
                      setShowActionMenu(false);
                    } else {
                      setShowActionMenu(true);
                    }
                    setActionMenuActionCategory("kickout");
                  }}
                  className={`${
                    actionMenuActionCategory == "kickout"
                      ? "border-b border-b-[#fff]"
                      : ""
                  } bg-[#242424] w-[50%] p-2 rounded`}
                >
                  <Text className="text-white text-center">Kickout</Text>
                </TouchableOpacity>
              </View>

              {/* Home and Away buttons */}
              <View className="flex-row space-x-1  mx-auto w-[20%] mx-3 justify-center">
                <TouchableOpacity
                  className={`${
                    actionMenuActionCategory == "shot"
                      ? "border-b border-b-[#fff]"
                      : ""
                  } p-2 w-[100%] rounded bg-[#242424]`}
                  onPress={() => {
                    if (
                      actionMenuActionCategory === "shot" &&
                      showActionMenu === true
                    ) {
                      setShowActionMenu(false);
                    } else {
                      setShowActionMenu(true);
                    }
                    setActionMenuActionCategory("shot");
                  }}
                >
                  <Text className="text-white text-center">Shot</Text>
                </TouchableOpacity>
              </View>

              {/* Right buttons */}
              <View className="flex-row space-x-1 mx-auto items-center justify-center w-[40%]">
                <TouchableOpacity
                  onPress={() => {
                    if (
                      actionMenuActionCategory === "T/O" &&
                      showActionMenu === true
                    ) {
                      setShowActionMenu(false);
                    } else {
                      setShowActionMenu(true);
                    }

                    setActionMenuActionCategory("T/O");
                  }}
                  className={`${
                    actionMenuActionCategory == "T/O"
                      ? "border-b border-b-[#fff]"
                      : ""
                  } bg-[#242424] w-[50%] p-2 rounded`}
                >
                  <Text className="text-white text-center">T/O</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#242424] w-[50%] p-2 rounded">
                  <Text className="text-white text-center">Tackle</Text>
                </TouchableOpacity>
              </View>
            </View>
            {showActionMenu && (
              <View className=" z-50  my-1  justify-center translate-y-[0px] w-[96%] space-x-1   items-center  mx-auto left-0  h-auto flex-row">
                {actions
                  .filter((item) => item.category === actionMenuActionCategory)
                  .map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        gameStatClickHandler(item.action, item.category);
                        setActionSelected(item.action);
                      }}
                      className={`
                      ${
                        actionSelected === item.action
                          ? "border-b-2 border-b-green-500"
                          : ""
                      }
                      w-1/5 rounded-md py-2    px-1  space-x-1 justify-center `}
                    >
                      <Text className="text-center text-white">
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
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
      {showIngameStatModal && (
        <View className="w-full h-screen absolute flex flex-col">
          {/* This view will fill the remaining space above the dynamic view */}
          <TouchableOpacity
            onPress={() => setShowIngameStatModal(false)}
            className="flex-1 pointer-events-none bg-transparent"
          >
            {/* Content for the top view */}
          </TouchableOpacity>
          <View className="w-full pt-5 bg-gray-400 h-auto  absolute bottom-0 z-[50] rounded-t-3xl pb-5 mx-auto">
            <View className="w-full absolute right-0 z-50 flex-row  h-auto">
              <TouchableOpacity
                onPress={() => setShowIngameStatModal(false)}
                className=" ml-5 p-2 right-2 top-1 absolute "
              >
                <Text className="text-xl text-black rounded-full w-full">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    size={35}
                    color="#000"
                  />
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full  mb-5  p-2 mx-auto text-center justify-center">
              <View className="h-10  w-full z-[-1]   flex-row items-center justify-between">
                {/* Left buttons */}
                <View className="flex-row space-x-1 mx-auto">
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
                        ? "border-2 border-green-500"
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
              <View className="flex-row mt-2">
                <Text className="w-1/4 p-1  text-center">Min</Text>
                <Text className="w-1/4 p-1  text-center">Action</Text>
                <Text className="w-1/4 p-1  text-center">Player</Text>
                <Text className="w-1/4 p-1  text-center">Score</Text>
              </View>
              {filteredPositions.length === 0 ? (
                <Text className="text-center text-md mt-5 py-2">
                  No data yet,
                </Text>
              ) : (
                filteredPositions.map((position, index) => (
                  <TouchableOpacity
                    onLongPress={() => {
                      setLongPressedId(position.id);
                      console.log("longpressed");
                    }}
                    onPress={() => {
                      setLongPressedId(null);
                      console.log("pressed");
                    }}
                    key={index}
                    className={`flex-row justify-center py-1 rounded-md mx-1 text-white ${
                      index % 2 === 0 ? "bg-white/50" : ""
                    } `}
                  >
                    {longPressedId === position.id ? (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            deletePositionById(position.id, position.action)
                          }
                          className=" bg-red-500 w-auto px-5 py-1 rounded-md justify-center items-center"
                        >
                          <Text>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setLongPressedId(null)}
                          className="ml-2 bg-green-500 w-auto px-5 py-1 rounded-md justify-center items-center"
                        >
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Text className="w-1/4 p-1 text-gray-700 text-center">
                          {formatTime(position.time)}
                        </Text>
                        <Text className="w-1/4 p-1 text-gray-700 text-center">
                          {position.action}
                        </Text>
                        <Text className="w-1/4 p-1 text-gray-700 text-center">
                          {position.player}
                        </Text>
                        <Text className="w-1/4 p-1 text-gray-700 text-center">
                          0:{position.score}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                ))
              )}
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
        </View>
      )}
      {showEditLineupModal && (
        <>
          <TouchableOpacity
            onPress={() => {
              setShowEditLineupModal(false);
              setSubstitution({
                startingPlayer: null,
                subPlayer: null,
              });
            }}
            className="h-1/2 w-full  absolute top-0"
          ></TouchableOpacity>
          <View className="w-full absolute h-1/2 rounded-t-3xl bg-gray-400 bottom-0">
            <TouchableOpacity
              onPress={() => {
                setShowEditLineupModal(false);
                setSubstitution({
                  startingPlayer: null,
                  subPlayer: null,
                });
              }}
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
                data={lineUp.filter((player) => player.onPitch)}
                horizontal
                keyExtractor={(item) => item.playerNumber.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex my-auto justify-center  items-center mx-2"
                    style={{ width: width / 8, height: 50 }}
                    onPress={() =>
                      setSubstitution((prevState) => ({
                        ...prevState,
                        startingPlayer: item.playerNumber,
                      }))
                    }
                  >
                    <ImageBackground
                      source={require("../assets/jersey.png")}
                      resizeMode="contain"
                      className={`flex justify-center items-center ${
                        item.playerNumber === substitution.startingPlayer
                          ? "border-b border-b-1 border-b-green-500"
                          : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <Text
                        className={`text-base font-bold ${
                          item.playerNumber === substitution.startingPlayer
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        {item.playerNumber}
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
                data={lineUp.filter((player) => !player.onPitch)}
                horizontal
                keyExtractor={(item) => item.playerNumber.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex my-auto justify-center  items-center mx-2"
                    style={{ width: width / 8, height: 50 }}
                    onPress={() =>
                      setSubstitution((prevState) => ({
                        ...prevState,
                        subPlayer: item.playerNumber,
                      }))
                    }
                  >
                    <ImageBackground
                      source={require("../assets/jersey.png")}
                      resizeMode="contain"
                      className={`flex justify-center items-center ${
                        item.playerNumber === substitution.subPlayer
                          ? "border-b border-b-1 border-b-green-500"
                          : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <Text
                        className={`text-base font-bold ${
                          item.playerNumber === substitution.subPlayer
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        {item.playerNumber}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View className="flex-1 ">
              <TouchableOpacity
                disabled={!substitution.playerName && !substitution.subPlayer}
                onPress={() => {
                  makeSubstitute(
                    substitution.startingPlayer,
                    substitution.subPlayer
                  );
                }}
                // if there is a starting/sub player selected make the button clickable
                className={`rounded-md mx-auto my-auto p-2 w-1/4

                ${
                  substitution.startingPlayer && substitution.subPlayer
                    ? "bg-green-500"
                    : "bg-gray-100"
                }
                `}
              >
                <Text className="text-center font-semibold textlg">
                  Make Sub
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      {showHalftimeModal && (
        <>
          <TouchableOpacity
            onPress={() => setShowHalftimeModal(false)}
            className="h-4/5 flex-1 w-full  absolute bottom-1/5 "
          ></TouchableOpacity>
          <View className="w-full absolute h-1/5 flex-row rounded-t-3xl bg-gray-400 bottom-0">
            <TouchableOpacity className="mx-auto my-auto px-3 bg-green-600 py-2 rounded-md">
              <Text>Start 2nd Half</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {showEditTimerModal && (
        <>
          <TouchableOpacity
            onPress={() => setShowEditTimeModal(false)}
            className="h-4/5 w-full  absolute top-0 bg-transparent"
          ></TouchableOpacity>
          <View className="w-full absolute h-1/5 flex-row rounded-t-3xl bg-gray-400 bottom-0">
            <View className="mx-auto flex-row  h-auto">
              <TouchableOpacity
                onPress={() => {
                  if (seconds > 60) {
                    setSeconds(seconds - 60);
                  } else {
                    setSeconds(0);
                  }
                }}
                className="bg-white mx-auto my-auto mr-5 justify-center p-2 rounded-full w-10 h-10"
              >
                <Text className="text-center">-</Text>
              </TouchableOpacity>
              <Text className="text-center font-bold text-2xl my-auto">
                {Math.floor(seconds / 60)}:
                {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (seconds < 2100) {
                    setSeconds(seconds + 60);
                  }
                }}
                className="bg-white mx-auto my-auto ml-5 justify-center p-2 rounded-full w-10 h-10"
              >
                <Text className="text-center">+</Text>
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
