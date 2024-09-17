import React, { useState, useEffect, act } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useRoute } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5"; // FontAwesome5 for newer icons
import { Svg, Path } from "react-native-svg";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faPeopleGroup,
  faEye,
  faStopwatch,
  faChevronLeft,
  faFloppyDisk,
  faUser,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
export default function App() {
  const navigation = useNavigation();
  const route = useRoute();
  const [teamLineout, setTeamLineout] = useState(null);
  const {
    opponent,
    venue,
    gameData,
    minutes,
    gameActions,
    gameInProgressFlag,
  } = route.params; // Access the passed parameters
  // console.log(gameActions);

  //if the ingame game is loaded back from a saved file, the lineout will be blank since it is passed by the params from the setting up of the game , we need to do a check and then set it to the correct lienout for this case.
  // Check if the required parameters are present
  // Extract parameters from route
  const { lineout } = route.params; // You can destructure other params similarly if needed
  useEffect(() => {
    // Check if lineout is provided and set it to state
    if (gameInProgressFlag) {
      setIsActive(true);
      // setSeconds(1600);
      setTimerIcon("pause");
      setIsActive(true);
    } else {
      console.log("oop");
    }
  }, [gameInProgressFlag]);
  useEffect(() => {
    // Check if lineout is provided and set it to state
    if (lineout) {
      setTeamLineout(lineout);
    }
  }, [lineout]); // Dependency array ensures useEffect runs only when lineout changes
  // console.log(lineout);
  // console.log(lineout);
  const minutesperhalfInSeconds = minutes * 60;

  const [showProfileMiniMenu, setShowProfileMiniMenu] = useState(false);

  const AlertComponent = () => {
    return (
      <View className=" absolute w-full  top-48 z-50 text-center py-4 lg:px-4">
        <View
          className="p-2 rounded-md w-3/4 mx-auto  items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
          role="alert"
        >
          <View className="flex rounded-md bg-white uppercase  px-4 py-2 text-xs font-bold mr-3">
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
        backgroundColor: "#191A22",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      },
      component: <Text style={styles.xMarkerLoss}>X</Text>,
    },
    turnOverWon: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#80ed99",
        backgroundColor: "#191A22",
        justifyContent: "center",
        alignItems: "center",
      },
      component: <Text style={styles.xMarkerWon}>X</Text>,
    },
    Wide: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 0,
        backgroundColor: "#0b63fb",
      },
    },
    free: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#0b63fb",
      },
    },
    kickoutLoss: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#FD5F5F",
        backgroundColor: "#191A22",
      },
    },
    point: {
      style: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: "#0b63fb",
      },
    },
    short: {
      style: {
        width: 8,
        height: 8,

        borderRadius: 10,

        backgroundColor: "#ffcb77",
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
    kickoutCatchWon: {
      style: {
        width: 8,
        height: 8,

        // borderRadius: 10,

        backgroundColor: "#0b63fb",
      },
    },
    kickoutBreakWon: {
      style: {
        width: 8,
        height: 8,

        // borderRadius: 10,

        backgroundColor: "#0b63fb",
      },
    },
    kickoutOppBreak: {
      style: {
        width: 8,
        height: 8,

        // borderRadius: 10,

        backgroundColor: "#ffcb77",
      },
    },
    kickOppCatch: {
      style: {
        width: 8,
        height: 8,

        // borderRadius: 10,

        backgroundColor: "#0b63fb",
      },
    },
    kickoutOut: {
      style: {
        width: 8,
        height: 8,

        // borderRadius: 10,

        backgroundColor: "#fff",
      },
    },
    //kickoutOppBreak
    //4ecdc4
    goal: {
      style: {
        width: 8,
        height: 8,

        borderRadius: 10,

        backgroundColor: "#0b63fb",
      },
    },
    kickoutWon: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#0b63fb",
        backgroundColor: "#0b63fb",
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
  const [actionCategorySelected, setActionCategorySelected] = useState("shot");
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
  const [savedGameViewingId, setSavedGameViewingId] = useState(null);
  const [showHalftimeModal, setShowHalftimeModal] = useState(false);
  const [showSaveGameDataModal, setShowSaveGameDataModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [showUnsavedGameModal, setShowUnsavedGameModal] = useState(false);
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
  // setIsActive(true);
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
      action: "miss",
      label: "miss",
    },
    {
      category: "shot",
      action: "short",
      label: "short",
    },
    {
      category: "shot",
      action: "45Score",
      label: "45 Score",
    },
    {
      category: "shot",
      action: "45Miss",
      label: "45 Miss",
    },
    {
      category: "shot",
      action: "freeScore",
      label: "Free Score",
    },
    {
      category: "shot",
      action: "freeMiss",
      label: "Free Miss",
    },
    {
      category: "shot",
      action: "markScore",
      label: "Mark point",
    },
    {
      category: "shot",
      action: "markMiss",
      label: "Mark Miss",
    },
    {
      category: "kickout",
      action: "kickoutCatchWon",
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
  useEffect(() => {
    const mergeCustomActions = () => {
      // Set a default value for gameActions if it's undefined
      const actionsToMerge = gameActions || [];
      const existingLabels = actions.map((action) => action.label);

      const newCustomActions = actionsToMerge
        .filter((btn) => !existingLabels.includes(btn.label))
        .map((btn) => ({
          category: "custom",
          action: btn.label.toLowerCase().replace(/\s+/g, ""),
          label: btn.label,
        }));

      if (newCustomActions.length > 0) {
        setActions((prevActions) => [...prevActions, ...newCustomActions]);
      }
    };

    mergeCustomActions();
  }, [gameActions]);

  const initialLineUp = [];
  // useEffect(() => {
  //   const lineoutLength = teamLineout ? teamLineout.length : 0;
  // const lineoutlength = gameData.teamLineout.names.length;
  const lineoutLength =
    gameData && gameData.teamLineout && gameData.teamLineout.names
      ? gameData.teamLineout.names.length
      : 16;

  // }, [teamLineout]);
  // console.log("diggggggaaa :L");
  // console.log(teamLineout);
  // const lineoutLength = lineout ? lineout.length : 0;

  for (let i = 1; i <= lineoutLength; i++) {
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
    // minutesperhalfInSeconds is 35 mins
    if (
      isActive &&
      //! here lies the issue to the timer
      seconds <= 1799
    ) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (seconds >= 3600) {
      console.log("End of Game Reached");
      setTimerLimitReached(true);
      setIsActive(false);
      clearInterval(interval);
    } else if (seconds === 1800 && currentHalf === 1) {
      console.log("we hit the first half");
      setTimerIcon("play");
    } else if (currentHalf === 2 && seconds < 3600) {
      setIsActive(true);
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
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
  //this below section of code is for when the user is opening a saved game and wants to continue editing the game
  const [isGameAlreadySaved, setIsGameAlreadySaved] = useState(false);
  if (gameData) {
    // console.log(gameData);
    if (!shootingDirect && gameData.direction) {
      console.log("=======id BAIIIIII==============");
      console.log(gameData.id);
      setSavedGameViewingId(gameData.id);
      console.log("====================================");
      setIsGameAlreadySaved(true);
      setShootingDirection(gameData.direction);
    }
    if (positions.length === 0 && gameData.positions) {
      console.log("whatbthey gone say now");
      setPositions(gameData.positions);
    }
    if (seconds < 1) {
      setScoreBaord({
        point: gameData.gameScorePoint,
        goal: gameData.gameScoreGoal,
      });
      // setScoreBaord({ point: gameData.gameScorePoint });
      console.log("gigidi");
      console.log(scoreBoard);
      // setScoreBaord({ goal: gameData.gameScoreGoal });

      setSeconds(gameData.timer);
      setIsActive(true);
      if (timerIcon == "play") {
        setTimerIcon("pause");
      } else {
        setTimerIcon("play");
      }
    }
  }

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
            className="bg-[#0b63fb]
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
            className="bg-[#0b63fb]
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
  function UnsavedChangesModal() {
    return (
      <>
        <View className="w-full  z-50 h-1/3 rounded-t-md justify-center items-center bottom-0 absolute bg-[#191A22] ">
          <Text className="text-white">
            You have unsaved changes in this game
          </Text>
          <Text className="mt-2 text-white">
            This game data will be lost if not saved
          </Text>
          <View className="flex-row w-full px-10 mx-auto items-center justify-center mt-5 ">
            <TouchableOpacity
              onPress={() => {
                setShowUnsavedGameModal(false);
                setShowSaveGameDataModal(true);
              }}
              className="bg-[#0b63fb] mr-2  p-4 w-1/2 rounded-md"
            >
              <Text className="text-center">Save Game</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("HomeDashboard");
              }}
              className="bg-gray-400 ml-2 w-1/2 p-4 rounded-md"
            >
              <Text className="text-center">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
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
        team: selected,
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
  const finishGameBtnHandler = () => {
    saveGameData(positions);
  };
  const uniqueCategories = Array.from(
    new Set(actions.map((item) => item.category))
  );
  const playerNameLookup = (number, lineout) => {
    let player;

    if (route.params && lineout) {
      // If route.params is present and lineout is passed
      player = lineout.names.find((player) => player.number === number);
    } else if (gameData && gameData.teamLineout) {
      // If gameData is present and teamLineout is available
      player = gameData.teamLineout.names.find(
        (player) => player.number === number
      );
    }

    return player ? player.name : "Player not found";
  };

  const handleSavePosition = () => {
    if (tempPosition) {
      setTempPosition((prev) => ({
        ...prev,
        player: selectedNumber,
      }));
      const adjustedTimeStamp =
        currentHalf === 2
          ? actionTimeStamp + minutesperhalfInSeconds
          : actionTimeStamp;
      setPositions((prev) => [
        ...prev,
        {
          ...tempPosition,
          player: selectedNumber,
          time: adjustedTimeStamp,
          playerName: playerNameLookup(selectedNumber, teamLineout),
        },
      ]);
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
    const matchesActionCategory =
      showActionsOnPitchFilter === "all" ||
      (showActionsOnPitchFilter !== "none" &&
        position.actionCategory === showActionsOnPitchFilter);
    const matchesTeam = selected === "all" || position.team === selected;

    return matchesActionCategory && matchesTeam;
  });
  const filteredPositions = positions.filter((position) => {
    const matchesCategory =
      ingameStatModalFilter === "All" ||
      position.actionCategory === ingameStatModalFilter;
    const matchesTeam = selected === "All" || position.team === selected;
    return matchesCategory && matchesTeam;
  });
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad it with leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month and pad it with leading zero if needed
  const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year

  const formattedDate = `${day}/${month}/${year}`; // Format the date as DD/MM/YY
  const saveGameData = async (gameData) => {
    try {
      let id;
      if (isGameAlreadySaved) {
        id = savedGameViewingId; // Use the new savedGameViewingId
      } else {
        id = new Date().getTime().toString();
      }

      const timestamp = formattedDate;
      // const gameName = `${opponent} Game ${venue} on ${timestamp}`;
      // const gameName = `${opponent}  ${venue}`;
      const gameName = `${opponent} `;
      console.log("we are in here now");
      console.log("This is the score in points");
      console.log(scoreBoard.point);
      const newGameData = {
        id,
        timestamp,
        opponent,
        venue,
        gameName,
        // positions: gameData.positions, // Assuming positions array is part of gameData
        positions: positions, // Assuming positions array is part of gameData
        direction: shootingDirect,
        gameScorePoint: scoreBoard.point,
        gameScoreGoal: scoreBoard.goal,
        timer: seconds,
        gameFinihsed: isGameFinished,
        teamLineout: teamLineout,
      };
      console.log("daddy chill");
      console.log(newGameData.gameScorePoint);
      // Load existing data
      const jsonValue = await AsyncStorage.getItem("@game_data");
      let existingData = [];
      if (jsonValue != null) {
        existingData = JSON.parse(jsonValue);
        if (!Array.isArray(existingData)) {
          existingData = [];
        }
      }

      if (isGameAlreadySaved) {
        // Find the game index and update positions
        const targetId = savedGameViewingId; // Use the new savedGameViewingId

        if (Array.isArray(existingData)) {
          existingData.forEach((item) => {
            if (item.id === targetId) {
            }
          });
        } else {
          console.error("existingData is not an array");
        }

        const gameIndex = existingData.findIndex((game) => {
          return game.id === id;
        });

        if (gameIndex !== -1) {
          // existingData[gameIndex].positions = gameData.positions; // Update positions array only
          existingData[gameIndex].positions = positions; // Update positions array only
          existingData[gameIndex].timer = seconds;
          existingData[gameIndex].gameScorePoint = scoreBoard.point;
          existingData[gameIndex].gameScoreGoal = scoreBoard.goal;
          existingData[gameIndex].half = currentHalf;
          console.log("we found the game happyface emoji");
        } else {
          console.log("we did not find the game sadface emoji");
          existingData.push(newGameData); // If game is not found, add it as a new entry
        }
      } else {
        existingData.push(newGameData); // Add new game data
      }

      // Save updated data back to AsyncStorage
      const updatedJsonValue = JSON.stringify(existingData);
      await AsyncStorage.setItem("@game_data", updatedJsonValue);
      console.log("Data saved");
      navigation.navigate("HomeDashboard"), { newGameAdded: true };
    } catch (e) {
      console.error("Error saving data", e);
    }
  };
  return (
    <>
      {showSaveGameDataModal && (
        <TouchableOpacity
          className="w-full h-full bg-[#191A22]/50 z-50 absolute justify-center items-center"
          onPress={() => setShowSaveGameDataModal(false)}
          activeOpacity={1} // Ensures the click outside the modal triggers the onPress
        >
          <View
            className="w-4/5 h-2/5  rounded-md bg-[#161616] justify-center items-center"
            onStartShouldSetResponder={() => true} // Prevents the click from propagating to the parent TouchableOpacity
          >
            <Text className="text-center text-white text-md font-semibold">
              Ready to Save Game
            </Text>
            <Text className="text-center text-white text-md mt-5">
              You can re-open the saved game at any time and continue working on
              it
            </Text>
            <View className="bg-[#191A22]/20 mt-5 w-3/4 p-2 rounded-md">
              <Text className="text-center text-white text-md mt-2">
                Kilkerley vs {opponent}
              </Text>
              <Text className="text-center text-md mt-2 text-white">
                {formattedDate}
              </Text>
              <Text className="text-center text-md my-2 text-white">
                15 Actions
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                saveGameData(positions);
              }}
              className="text-center mt-5 text-md font-semibold bg-[#191A22] px-5 py-2 rounded-md text-white border-[#0b63fb]/20 border"
            >
              <Text className="text-[#0b63fb] ">Save Game</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
      <SafeAreaView className="flex-1 bg-[#12131A]  overflow-visible">
        {showUnsavedGameModal && <UnsavedChangesModal />}
        <ScrollView>
          {showStartGameModal && <StartGameModal />}
          {timerLimitReached && showTimerAlert && !gameData.gameFinihsed && (
            <>
              <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <Text className="font-bold">{minutes} minutes reached!</Text>
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
                <View className="w-[15%] space-x-1 bg-[#191A22] px-3   py-2 rounded-md ">
                  <TouchableOpacity
                    // onPress={() => navigation.navigate("HomeDashboard")}
                    onPress={() => {
                      if (positions.length > 0) {
                        setShowUnsavedGameModal(true);
                      } else {
                        navigation.navigate("HomeDashboard");
                      }
                    }}
                    className="w-full flex justify-center items-center"
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      size={25}
                      color="#0b63fb"
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setShowEditTimeModal(true)}
                  className={`${
                    showEditTimerModal ? "border-b-2 border-b-[#0b63fb]" : ""
                  } w-[15%]  rounded-md  h-full justify-center text-center `}
                >
                  <Text className="text-center font-bold text-lg text-white">
                    {Math.floor(seconds / 60)}:
                    {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
                  </Text>
                </TouchableOpacity>
                <View className="w-[40%] h-full justify-center text-center">
                  <Text className="text-center font-bold text-xl  text-gray-200">
                    {scoreBoard.goal}
                    <Text className="text-white text-center  my-auto justify-center items-center font-bold text-xl ">
                      :
                    </Text>
                    {scoreBoard.point}
                  </Text>
                </View>
                <View className="w-[15%] space-x-1 bg-[#191A22] px-3   py-2 rounded-md ">
                  <TouchableOpacity
                    onPress={() => {
                      setShowSaveGameDataModal(true);
                    }}
                    className="w-full flex justify-center items-center"
                  >
                    <FontAwesomeIcon
                      icon={faFloppyDisk}
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                <View className="  w-[15%]  font-extrabold text-2xl text-center">
                  <TouchableOpacity
                    onPress={() => setShowProfileMiniMenu(!showProfileMiniMenu)}
                    className=" h-10 cursor-pointer w-full rounded-md justify-center mx-auto items-center"
                  >
                    {!showProfileMiniMenu ? (
                      <View className="w-[50%] flex justify-center items-center">
                        <FontAwesomeIcon icon={faUser} size={20} color="#fff" />
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
                  <Text className="text-[#0b63fb]">Logout</Text>
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
                  className={`bg-[#191A22] w-[50%]  p-2 rounded-md
                
              
                
                `}
                >
                  <Text className={`text-white my-auto mx-auto text-center  `}>
                    <FontAwesomeIcon
                      icon={faStopwatch}
                      size={23}
                      color={`${timerLimitReached ? "#0b63fb" : "#FFF"}`}
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
                    showEditLineupModal ? "border-b-2 border-b-[#0b63fb]" : ""
                  } bg-[#191A22] w-[50%] p-2 rounded flex justify-center items-center`}
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
              <View className="flex-row  w-[35%] mx-2 h-full justify-center   ">
                <TouchableOpacity
                  className={`p-2 w-[50%] bg-[#191A22] mx-auto my-auto h-full rounded-md ${
                    selected === "Home" ? "border bg-gray-200" : ""
                  }`}
                  onPress={() => setSelected("Home")}
                >
                  <Text
                    className={`text-white text-center my-auto ${
                      selected === "Home" ? "text-[#191A22]" : ""
                    }`}
                  >
                    Home
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`p-2 bg-[#191A22] w-[50%] rounded-md  ${
                    selected === "Away"
                      ? "border-b border-b-[#0b63fb] bg-gray-200"
                      : "bg-[#191A22]"
                  }`}
                  onPress={() => setSelected("Away")}
                >
                  <Text
                    className={`text-white my-auto text-center ${
                      selected === "Away" ? "text-[#191A22]" : ""
                    }`}
                  >
                    Away
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                className={`p-2 w-[50%] mx-auto rounded ${
                  selected === "Home"
                    ? "border border-[#0b63fb]"
                    : "bg-[#191A22]"
                }`}
                onPress={() => setSelected("Home")}
              >
                <Text
                  className={`text-white text-center ${
                    selected === "Home" ? "text-[#0b63fb]" : ""
                  }`}
                >
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`p-2 w-[50%] rounded ${
                  selected === "Away" ? "bg-[#0b63fb]" : "bg-[#191A22]"
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
                    showActionsOnPitch ? "border-b-2 border-b-[#0b63fb]" : ""
                  } bg-[#191A22] w-[50%] z-[-1]  p-2 rounded`}
                >
                  <View className="w-full flex justify-center items-center">
                    <FontAwesomeIcon icon={faEye} size={25} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowIngameStatModal(!showIngameStatModal)}
                  className={`  ${
                    showIngameStatModal ? "border-b-2 border-b-[#0b63fb]" : ""
                  } p-2 w-[50%] h-10 mx-auto bg-[#191A22] rounded `}
                >
                  <View className="w-full flex justify-center items-center">
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      size={25}
                      color="#FFFFFF"
                    />
                  </View>
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
            ? "border-b-2 border-b-[#0b63fb]"
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
                  ? "border-b-2 border-b-[#0b63fb]"
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
                  ? "border-b-2 border-b-[#0b63fb]"
                  : ""
              }
              w-1/5 rounded-md mx-auto mx-1 py-2  items-center justify-center`}
              >
                <Text className="text-center text-white">None</Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            className={`w-[96%] mt-5 border-[.5px] border-gray-700
        ${
          tempPosition ? "shadow shadow-[#0b63fb]/20" : ""
        }   mx-auto  rounded-md h-[63vh] bg-[#191A22]   relative`}
            onStartShouldSetResponder={() => true}
            onResponderRelease={handlePitchPress}
            style={{ zIndex: 1 }}
          >
            {/* this section of code will be rendered if the user has not selected which side of the pitch the home team is shooting into */}
            {!shootingDirect && (
              <>
                <TouchableOpacity
                  onPress={() => shootingDirectionClickHandler("up")}
                  className="bg-[#0b63fb]/50 w-full z-50 mx-auto text-center items-center jus h-[10%] absolute"
                ></TouchableOpacity>
                <TouchableOpacity
                  onPress={() => shootingDirectionClickHandler("down")}
                  className="bg-[#0b63fb]/50 w-full z-50  bottom-0  h-[10%] absolute"
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
                  zIndex: 0,
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
              <View className="h-auto border-white/10 p-2 rounded-md w-full  mx-auto">
                <FlatList
                  // inverted={actionCategorySelected === "shot"}
                  data={lineUp.filter((player) => player.onPitch)}
                  horizontal
                  keyExtractor={(item) => item.playerNumber.toString()}
                  renderItem={({ item }) => {
                    // Determine which lineout data to use based on route.params.lineout
                    const playerName = route.params?.lineout
                      ? route.params.lineout.names.find(
                          (player) => player.number === item.playerNumber
                        )?.name
                      : gameData?.teamLineout?.names.find(
                          (player) => player.number === item.playerNumber
                        )?.name;

                    return (
                      <View className="flex my-auto justify-center items-center mx-2">
                        <TouchableOpacity
                          style={{ width: width / 8, height: 50 }}
                          onPress={() => setSelectedNumber(item.playerNumber)}
                          className="flex justify-center items-center"
                        >
                          <ImageBackground
                            source={require("../assets/jersey.png")}
                            resizeMode="contain"
                            className={`flex justify-center items-center ${
                              item.playerNumber === selectedNumber
                                ? "border-b-2 border-b-[#0b63fb]"
                                : ""
                            }`}
                            style={{ width: "100%", height: "100%" }}
                          >
                            <Text
                              className={`text-base font-bold ${
                                item.playerNumber === selectedNumber
                                  ? "text-black"
                                  : "text-black"
                              }`}
                            >
                              {item.playerNumber}
                            </Text>
                          </ImageBackground>
                        </TouchableOpacity>
                        <Text className="text-sm text-white mt-1">
                          {playerName || ""}
                        </Text>
                      </View>
                    );
                  }}
                  showsHorizontalScrollIndicator={false}
                />

                <View className="flex-row justify-center">
                  <TouchableOpacity
                    onPress={() => {
                      if (actionTimeStamp > 60) {
                        setActionTimeStamp(actionTimeStamp - 60);
                      }
                    }}
                    className="w-10 h-10 justify-center items-center my-auto mr-2 bg-[#191A22] rounded-full p-2"
                  >
                    <Text className="text-white text-center my-auto font-bold">
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text className="text-center font-bold items-center my-auto text-lg text-white">
                    {Math.floor(actionTimeStamp / 60)} Min
                  </Text>
                  <TouchableOpacity
                    className="w-10 h-10 justify-center items-center my-auto ml-2 bg-[#191A22] rounded-full p-2"
                    onPress={() => {
                      setActionTimeStamp((prevTimeStamp) => {
                        const newTimeStamp = Number(prevTimeStamp);
                        if (newTimeStamp < minutesperhalfInSeconds) {
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

              <View className="flex flex-row w-2/4 mx-auto ">
                <TouchableOpacity
                  onPress={handleCancelPosition}
                  className="flex flex-1 mx-auto text-center rounded-md p-3 border bg-[#FD5F5F]"
                >
                  <Text className="text-center w-auto h-auto rounded-full">
                    <Icon name="ban" width={14} color="#191A22" />
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSavePosition}
                  className={`flex flex-1 mx-auto justify-center items-center rounded-md p-3 border bg-[#0b63fb] ${
                    selectedNumber != null ? "" : "hidden"
                  }`}
                >
                  <Text className="text-center w-auto h-auto rounded-full">
                    <Icon name="check" width={14} color="#191A22" />
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {/* Bottom Mini Nav Btn Groups */}

          {!tempPosition && shootingDirect && (
            <View
              className={`  w-[96%] mx-auto rounded-md  ${
                showActionAlertError
                  ? "bg-[#0b63fb]/10 border  rounded-md   shadow-[#0b63fb]/20"
                  : ""
              }`}
            >
              <View className="h-10 w-[97%] mx-auto   flex-row items-center justify-center px-1">
                {/* Left buttons */}
                <View className="flex-row space-x-1 mx-auto items-center justify-center w-[40%]">
                  <TouchableOpacity className="bg-[#191A22] w-[50%] p-2 rounded">
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
                    } bg-[#191A22] w-[50%] p-2 rounded`}
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
                    } p-2 w-[100%] rounded bg-[#191A22]`}
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
                    } bg-[#191A22] w-[50%] p-2 rounded`}
                  >
                    <Text className="text-white text-center">T/O</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        actionMenuActionCategory === "custom" &&
                        showActionMenu === true
                      ) {
                        setShowActionMenu(false);
                      } else {
                        setShowActionMenu(true);
                      }

                      setActionMenuActionCategory("custom");
                    }}
                    className="bg-[#191A22] w-[50%] p-2 rounded"
                  >
                    <Text className="text-white text-center">Custom</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {showActionMenu && (
                <View className="z-50  justify-center translate-y-[0px] w-[99%]  items-center mx-auto left-0 h-auto flex-row flex-wrap ">
                  {actions
                    .filter(
                      (item) => item.category === actionMenuActionCategory
                    )
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
                       ? "border-b-2 border-b-[#0b63fb]"
                       : ""
                   }
                   w-1/5 rounded-md py-2   justify-center
                 `}
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
            <View className="w-full pt-5 bg-gray-400 h-auto absolute bottom-0 z-[50] rounded-t-3xl pb-5 mx-auto">
              <View className="w-full absolute right-0 z-50 flex-row h-auto">
                <TouchableOpacity
                  onPress={() => setShowIngameStatModal(false)}
                  className="ml-5 p-2 right-2 top-1 absolute"
                >
                  <Text className="text-xl text-black rounded-full w-full">
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      size={35}
                      color="#12131A"
                    />
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-full mb-5 p-2 mx-auto text-center justify-center">
                <View className="h-10 w-full z-[-1] flex-row items-center justify-between">
                  {/* Left buttons */}
                  <View className="flex-row space-x-1 mx-auto">
                    <TouchableOpacity
                      onPress={() => handleStatModalFilter("shot")}
                      className={`bg-[#191A22] ${
                        ingameStatModalFilter === "shot"
                          ? "border border-[#0b63fb]"
                          : ""
                      } w-16 p-2 rounded`}
                    >
                      <Text className="text-white text-center">Shots</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleStatModalFilter("kickout")}
                      className={`bg-[#191A22] ${
                        ingameStatModalFilter === "kickout"
                          ? "border border-[#0b63fb]"
                          : ""
                      } w-auto p-2 rounded`}
                    >
                      <Text className="text-white text-center">Kickouts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleStatModalFilter("T/O")}
                      className={`bg-[#191A22] ${
                        ingameStatModalFilter === "T/O"
                          ? "border-2 border-[#0b63fb]"
                          : ""
                      } w-16 p-2 rounded`}
                    >
                      <Text className="text-white text-center">T/O's</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleStatModalFilter("All")}
                      className={`bg-[#191A22] ${
                        ingameStatModalFilter === "All"
                          ? "border border-[#0b63fb]"
                          : ""
                      } w-16 p-2 rounded`}
                    >
                      <Text className="text-white text-center">All</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Home and Away buttons */}
                  <View className="flex-row"></View>
                </View>
                <View className="flex-row mt-2">
                  <Text className="w-1/4 p-1 text-center">Min</Text>
                  <Text className="w-1/4 p-1 text-center">Action</Text>
                  <Text className="w-1/4 p-1 text-center">Player</Text>
                  <Text className="w-1/4 p-1 text-center">Score</Text>
                </View>

                {/* Scrollable content */}
                <ScrollView className="h-96">
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
                              className="bg-red-500 w-auto px-5 py-1 rounded-md justify-center items-center"
                            >
                              <Text>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => setLongPressedId(null)}
                              className="ml-2 bg-[#0b63fb] w-auto px-5 py-1 rounded-md justify-center items-center"
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
                </ScrollView>
                {/* <View className="w-auto justify-end flex flex-row bg-blue-600 items-end">
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
                            ? "border-b border-b-1 border-b-[#0b63fb]"
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
                      {/* <Text>{item.playerName}</Text> */}
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
                            ? "border-b border-b-1 border-b-[#0b63fb]"
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
                    ? "bg-[#0b63fb]"
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
            <View className="w-full absolute h-1/5  rounded-t-3xl bg-gray-400 bottom-0">
              <Text className="text-center w-[30%]  left-[35%]  top-5 absolute mx-auto my-auto items-center justify-center">
                {Math.floor(seconds / 60)} Mins{" "}
                {currentHalf === 1 ? "1st" : "2nd"} half
              </Text>
              <View className="w-full my-auto px-10 flex-row">
                <TouchableOpacity
                  onPress={() => {
                    // setCurrentHalf(2);
                    {
                      currentHalf === 1 ? setCurrentHalf(2) : setCurrentHalf(1);
                    }

                    setSeconds(1802);
                    setShowHalftimeModal(false);
                    setIsActive(true);
                    setTimerLimitReached(false);
                  }}
                  className="mx-auto my-auto   px-3 bg-white py-2 rounded-md"
                >
                  <Text className="text-gray-700 font-semibold">
                    {currentHalf === 1 ? "Start 2nd Half" : "Back to 1st Half"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // setCurrentHalf(2);
                    {
                      currentHalf === 1 ? setCurrentHalf(2) : setCurrentHalf(1);
                    }
                    setSeconds(minutes * 60);
                    setShowHalftimeModal(false);
                    setIsActive(true);
                    setTimerLimitReached(true);
                    setIsGameFinished(true);
                    console.log("digga");
                    console.log(positions);
                    finishGameBtnHandler();
                  }}
                  className="mx-auto my-auto   px-3 bg-blue-600 py-2 rounded-md"
                >
                  <Text className="text-gray-200 font-semibold">
                    Finish Game
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // setCurrentHalf(2);
                    setIsActive(false);
                  }}
                  className="mx-auto my-auto   px-3 bg-blue-600 py-2 rounded-md"
                >
                  <Text className="text-gray-200 font-semibold">
                    cont clock
                  </Text>
                </TouchableOpacity>
              </View>
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
              <View className="mx-auto flex-row h-auto">
                <View className="absolute w-12 right-[35%] bg-gray-600 mt-2 rounded-full  h-12 flex justify-center items-center">
                  <TouchableOpacity
                    onPress={handlePlayPauseClick}
                    title="Start Timer"
                    disabled={timerLimitReached}
                    className="flex justify-center items-center z-50 w-full h-full"
                  >
                    <Icon name={timerIcon} width={12} color="#fff" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (currentHalf === 1) {
                      if (seconds > 60) {
                        setSeconds(seconds - 60);
                      } else {
                        setSeconds(0);
                        setIsActive(true);
                      }
                    } else if (currentHalf === 2) {
                      if (seconds > 1860) {
                        setSeconds(seconds - 60);
                      } else {
                        setSeconds(1800);
                      }
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
                    if (seconds < 3600) {
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
    </>
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
    backgroundColor: "#0b63fb",
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
    backgroundColor: "#0b63fb",
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
    color: "#0b63fb",
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
