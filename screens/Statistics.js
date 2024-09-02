import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { captureRef } from "react-native-view-shot";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import {
  BarChart,
  LineChart,
  StackedBarChart,
  ProgressChart,
} from "react-native-chart-kit";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import {
  faFutbol,
  faInfo,
  faShare,
  faChartLine,
  faChevronLeft,
  faSliders,
  faDownload,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
export default function App() {
  const viewRef = useRef();
  const navigation = useNavigation();
  //!useREfs
  const flatListRef = useRef(null);
  //!usestates
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [showShotData, setShowShotData] = useState(false);
  const [showTimingsData, setShowTimingsData] = useState(false);
  const [showGameDetailsMenu, setShowGameDetailsMenu] = useState(false);
  const route = useRoute();
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const captureAndShareScreenshot = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });

      const options = {
        html: `<img src="${uri}" width="100%">`,
        fileName: "screenshot",
        directory: "Documents",
      };

      const file = await RNHTMLtoPDF.convert(options);

      console.log("PDF saved to:", file.filePath);
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
    }
  };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;
  const handlePress = (index) => {
    setCurrentIndex(index);
    flatListRef.current.scrollToIndex({ animated: true, index: index });
  };

  const { gameData } = route.params; // Access the passed parameters
  const [sectionData, setSectionData] = useState({});
  // Function to determine the grid section based on x, y coordinates
  const determineSection = (x, y, width, height) => {
    const sectionX = Math.floor(x / (width / 3));
    const sectionY = Math.floor(y / (height / 5));

    // Ensure that sectionX and sectionY are within bounds
    const validSectionX = Math.max(0, Math.min(sectionX, 2));
    const validSectionY = Math.max(0, Math.min(sectionY, 4));

    return `${validSectionX}-${validSectionY}`;
  };

  useEffect(() => {
    const sections = {};

    gameData.positions.forEach((position) => {
      const { x, y, action } = position;

      // Assuming the pitch dimensions are 360x600 (width x height)
      // Adjust these based on your actual view dimensions
      const section = determineSection(x, y, 360, 600);

      if (!sections[section]) {
        sections[section] = { scores: 0, misses: 0 };
      }

      if (action === "point" || action === "goal" || action.includes("Score")) {
        sections[section].scores += 1;
      } else if (action === "miss" || action.includes("Miss")) {
        sections[section].misses += 1;
      }
    });

    setSectionData(sections);
  }, [gameData]);
  function Hr() {
    return (
      <>
        <View className="w-[90%] mx-auto h-[1px] my-10 bg-zinc-800"></View>
      </>
    );
  }
  const createPDF = async () => {
    let options = {
      html: "<h1>PDF Content</h1><p>This is a sample PDF</p>",
      fileName: "sample",
      directory: "Documents",
    };

    let file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);
    alert(`PDF saved to ${file.filePath}`);
  };

  const renderBarLabel = ({ value }) => {
    if (value === 0) {
      return null;
    }
    return value.toString();
  };
  const actionStyles = {
    turnOverWon: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#80ed99",
        backgroundColor: "#101010",
        justifyContent: "center",
        alignItems: "center",
      },
      component: <Text style={styles.xMarkerWon}>X</Text>,
    },
    turnOverLoss: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#80ed99",
        backgroundColor: "#0b63fb",
        justifyContent: "center",
        alignItems: "center",
      },
      component: <Text style={styles.xMarkerLoss}>X</Text>,
    },
    Wide: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 0,
        backgroundColor: "#0b63fb",
      },
    },
    freeMiss: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#d11149",
      },
    },
    freeScore: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#0b63fb",
      },
    },
    markScore: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#0b63fb",
      },
    },
    markMiss: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#ef233c",
      },
    },

    point: {
      style: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#0b63fb", // Green color for point
        shadowColor: "#0b63fb", // Same color as background for shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 19,
        elevation: 20, // For Android
      },
    },
    short: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#fb8500",
      },
    },
    miss: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#ef233c",
        shadowColor: "#ef233c", // Green color for shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 56,
      },
    },

    "45Score": {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#0b63fb", // Green color
        shadowColor: "#0b63fb", // Green color for shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 10, // For Android
      },
    },
    "45Miss": {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#ef233c", // Red color
      },
    },

    goal: {
      style: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: "#4361ee",
      },
    },
    kickoutBreakWon: {
      style: {
        width: 10,
        height: 10,

        backgroundColor: "#4361ee",
        shadowColor: "#ef233c", // Green color for shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 56,
      },
    },
    kickoutCatchWon: {
      style: {
        width: 10,
        height: 10,

        backgroundColor: "#4361ee",
        shadowColor: "#ef233c", // Green color for shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 56,
      },
    },
    kickoutOut: {
      style: {
        width: 10,
        height: 10,

        backgroundColor: "#ef233c",
        shadowColor: "#ef233c", // Green color for shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 56,
      },
    },
    kickOppCatch: {
      style: {
        width: 10,
        height: 10,

        backgroundColor: "#ef233c",
        shadowColor: "#ef233c", // Green color for shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 56,
      },
    },
    kickoutOppBreak: {
      style: {
        width: 10,
        height: 10,

        backgroundColor: "#ef233c",
        shadowColor: "#ef233c", // Green color for shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 56,
      },
    },
  };
  // Function to ensure all required fields are initialized to zero if they are missing
  const initializeSetPlayData = (data) => {
    const requiredFields = [
      ["freeScore", "freeMiss"],
      ["45Score", "45Miss"],
      ["markScore", "markMiss"],
    ];

    const result = {
      labels: ["Free", "45", "Mark"],
      legend: ["Score", "Miss"],
      data: [],
      barColors: ["#0b63fb80", "#242424"],
    };

    requiredFields.forEach((fields) => {
      const scores =
        data.filter(
          (position) =>
            position.action.toLowerCase() === fields[0].toLowerCase()
        ).length || 0;
      const misses =
        data.filter(
          (position) =>
            position.action.toLowerCase() === fields[1].toLowerCase()
        ).length || 0;
      result.data.push([scores, misses]);
    });

    console.log("Initialized Set Play Data:", result); // Add logging
    return result;
  };

  //!this is for handling scroll to page events
  const scrollViewRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;
  const pageHeight = screenHeight * 0.85; // 85vh of the screen height
  const filteredKickoutPositions = gameData.positions.filter(
    (position) => position.actionCategory === "kickout"
  );
  const filteredCustomPositions = gameData.positions.filter(
    (position) => position.actionCategory === "custom"
  );

  const filteredTurnoverPositions = gameData.positions.filter(
    (position) => position.actionCategory === "T/O"
  );

  const filteredPositions = gameData.positions.filter(
    (position) => position.actionCategory === "shot"
  );

  function GameDataDisplay({
    filteredPositions,
    filteredKickoutPositions,
    filteredTurnoverPositions,
    filteredCustomPositions,
  }) {
    // Function to trim the action name
    const trimActionName = (action, category) => {
      if (category === "T/O") {
        // Handle Turnovers specifically since the category is abbreviated
        if (action.toLowerCase().startsWith("turnover")) {
          return action
            .slice(8)
            .replace(/([A-Z])/g, " $1")
            .trim();
        }
      } else if (action.toLowerCase().startsWith(category.toLowerCase())) {
        return action
          .slice(category.length)
          .replace(/([A-Z])/g, " $1")
          .trim();
      }
      return action;
    };
    const percentageMap = {
      "Shots Data": Math.round(shotPercentage),
      "Kickouts Data": Math.round(kickoutsPercentage),
      "Turnovers Data": Math.round(turnoverPercentage),
      "Custom Data": Math.round(turnoverPercentage),
      // Add more mappings as needed
    };

    // Helper function to render a section
    const renderSection = (title, data, category) => (
      <View className="w-full h-auto mb-6">
        <Text className="font-bold text-xl mb-2 text-white">
          {title} -{" "}
          <Text className="text-md font-light text-base">
            {percentageMap[title]}%
          </Text>
        </Text>
        <ScrollView className="py-4 bg-[#191a22] rounded-lg">
          <View className="flex-row border-b px-4 border-gray-700 pb-2 mb-2">
            <Text className="flex-1 text-white font-semibold text-md">
              Stat
            </Text>
            <Text className="flex-1 text-white font-semibold text-md">
              Player
            </Text>
            <Text className="flex-1 text-white font-semibold text-md">
              Time(M)
            </Text>
          </View>
          {data.length > 0 ? (
            data.map((item, index) => (
              <View
                key={index}
                className={`flex-row py-2 px-4 ${
                  index % 2 === 0 ? "bg-[#2a2c37]" : ""
                }`}
              >
                <Text className="flex-1 text-gray-300">
                  {trimActionName(item.action, category)}
                </Text>
                <Text className="flex-1 text-gray-300">
                  {/* Conditional rendering based on player number */}
                  {item.player && item.player !== 0
                    ? `(${item.player}) ${item.playerName}`
                    : ""}
                </Text>
                <Text className="flex-1 text-gray-300">
                  {Math.round(item.time / 60)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-center capitalize text-gray-500">
              No {category} data Yet
            </Text>
          )}
        </ScrollView>
      </View>
    );

    return (
      <View className="flex-1 bg-[#12131A] p-1 ">
        <View className=" rounded-md w-full p-3">
          {renderSection("Shots Data", filteredPositions, "shot")}
          {renderSection("Kickouts Data", filteredKickoutPositions, "kickout")}
          {renderSection("Turnovers Data", filteredTurnoverPositions, "T/O")}

          {filteredCustomPositions.length > 0 &&
            renderSection("User Data", filteredCustomPositions, "custom")}
        </View>
      </View>
    );
  }
  console.log("boyakapppapap");
  console.log(gameData.positions);
  const scoringActions = ["point", "freeScore", "45Score", "goal", "markScore"];
  const missActions = ["miss", "short", "freeMiss", "markMiss", "45Miss"];

  const summaryShotsPositionsFiltered = filteredPositions.reduce(
    (acc, position) => {
      const playerIndex = acc.findIndex(
        (item) => item.player === position.player
      );
      if (playerIndex === -1) {
        acc.push({
          player: position.player,
          playerName: position.playerName,
          scores: scoringActions.includes(position.action) ? 1 : 0,
          misses: missActions.includes(position.action) ? 1 : 0,
        });
      } else {
        if (scoringActions.includes(position.action)) {
          acc[playerIndex].scores += 1;
        }
        if (missActions.includes(position.action)) {
          acc[playerIndex].misses += 1;
        }
      }
      return acc;
    },
    []
  );

  const kickoutActionsSummary = {
    catch: ["kickoutCatchWon", "kickOppCatch"],
    break: ["kickoutBreakWon", "kickoutOppBreak"],
  };

  const summaryKickoutsPositionsFiltered = filteredKickoutPositions.reduce(
    (acc, position) => {
      const actionType = Object.keys(kickoutActionsSummary).find((key) =>
        kickoutActionsSummary[key].includes(position.action)
      );

      if (actionType) {
        const playerIndex = acc.findIndex((item) => item.player === actionType);

        if (playerIndex === -1) {
          acc.push({
            player: actionType,
            scores: position.action.includes("Won") ? 1 : 0,
            misses: position.action.includes("Opp") ? 1 : 0,
          });
        } else {
          if (position.action.includes("Won")) {
            acc[playerIndex].scores += 1;
          }
          if (position.action.includes("Opp")) {
            acc[playerIndex].misses += 1;
          }
        }
      }

      return acc;
    },
    []
  );
  const windowHeight = Dimensions.get("window").height;
  const pitchHeight = windowHeight * 0.63; // Convert 63vh to pixels

  const summaryTurnoversPositionsFiltered = filteredTurnoverPositions.reduce(
    (acc, position) => {
      const third = Math.floor((position.y / pitchHeight) * 3);
      let section;

      switch (third) {
        case 0:
          section = "top";
          break;
        case 1:
          section = "middle";
          break;
        case 2:
          section = "bottom";
          break;
        default:
          section = "unknown";
      }

      const playerIndex = acc.findIndex((item) => item.player === section);

      if (playerIndex === -1) {
        acc.push({
          player: section, // Using 'player' key to keep it consistent
          scores: position.action.includes("Won") ? 1 : 0, // Using 'scores' for won turnovers
          misses: position.action.includes("Loss") ? 1 : 0, // Using 'misses' for lost turnovers
        });
      } else {
        if (position.action.includes("Won")) {
          acc[playerIndex].scores += 1;
        }
        if (position.action.includes("Loss")) {
          acc[playerIndex].misses += 1;
        }
      }

      return acc;
    },
    []
  );
  const testTableData = [
    { stat: "Points", player: "John Doe", time: "12:34" },
    { stat: "Assists", player: "Jane Smith", time: "08:45" },
    { stat: "Rebounds", player: "Mike Johnson", time: "09:12" },
  ];
  console.log(summaryTurnoversPositionsFiltered);
  console.log("fuck ya");
  console.log(summaryKickoutsPositionsFiltered);
  // console.log(summaryShotsPositionsFiltered);
  const setPlayFilteredPositions = filteredPositions.filter((position) =>
    [
      "freeMiss",
      "freeScore",
      "markScore",
      "markMiss",
      "45Score",
      "45Miss",
    ].includes(position.action)
  );
  // Update the setPlayData1 initialization
  const setPlayData1 = initializeSetPlayData(filteredPositions);
  // const setPlayData1 = {
  //   labels: ["Free", "45", "Mark"],
  //   legend: ["Score", "Miss"],
  //   data: ["free", "45", "mark"].map((action) => {
  //     const scores = filteredPositions.filter(
  //       (position) =>
  //         position.action.toLowerCase() === `${action.toLowerCase()}score`
  //     ).length;
  //     const misses = filteredPositions.filter(
  //       (position) =>
  //         position.action.toLowerCase() === `${action.toLowerCase()}miss`
  //     ).length;
  //     return [scores, misses];
  //   }),
  //   barColors: ["#0b63fb80", "#242424"],
  // };
  const kickoutActions = [
    "kickoutCatchWon",
    "kickoutBreakWon",
    "kickoutOppBreak",
    "kickOppCatch",
    "kickoutOut",
  ];
  const turnoverBarChartData = {
    labels: ["Turnover Won", "Turnover Loss"],
    legend: ["1st Half", "2nd Half"],
    data: [
      [
        // 1st Half
        filteredTurnoverPositions.filter(
          (position) => position.action === "turnOverWon" && position.half === 1
        ).length,
        filteredTurnoverPositions.filter(
          (position) =>
            position.action === "turnOverLoss" && position.half === 1
        ).length,
      ],
      [
        // 2nd Half
        filteredTurnoverPositions.filter(
          (position) => position.action === "turnOverWon" && position.half === 2
        ).length,
        filteredTurnoverPositions.filter(
          (position) =>
            position.action === "turnOverLoss" && position.half === 2
        ).length,
      ],
    ],
    barColors: ["#0b63fb80", "#242424"],
  };
  const kickoutBarChartData = {
    labels: ["Catch", "Breaking Ball", "Out"],
    legend: ["Win", "Loss"],
    data: [
      [
        filteredKickoutPositions.filter(
          (position) => position.action === "kickoutCatchWon"
        ).length,
        filteredKickoutPositions.filter(
          (position) => position.action === "kickOppCatch"
        ).length,
      ],
      [
        filteredKickoutPositions.filter(
          (position) => position.action === "kickoutBreakWon"
        ).length,
        filteredKickoutPositions.filter(
          (position) => position.action === "kickoutOppBreak"
        ).length,
      ],
      [
        filteredKickoutPositions.filter(
          (position) => position.action === "kickoutOut"
        ).length,
        0, // Assuming "Out" does nob have a win/loss category
      ],
    ],
    barColors: ["#0b63fb80", "#242424"],
  };

  const kickoutsCount = filteredKickoutPositions.reduce((count, position) => {
    if (position.actionCategory === "kickout") {
      if (!count[position.action]) {
        count[position.action] = 0;
      }
      count[position.action]++;
    }
    return count;
  }, {});
  const actionCounts = filteredPositions.reduce((acc, position) => {
    acc[position.action] = (acc[position.action] || 0) + 1;
    return acc;
  }, {});
  // Create a mapping from action types to these labels
  const actionMap = {
    point: "Points",
    miss: "Wides",
    goal: "Goals",
    short: "Short",
    freeScore: "Free",
  };

  // Define the labels in the order you want them to appear
  const labels = ["Points", "Wides", "Goals", "Short", "Free"];
  // Define the labels in the order you want them to appear
  const kickoutLabels = ["Catch", "Break", "Loss", "Out", "Op Catch"];
  // Define the labels in the order you want them to appear
  const turnoverLabels = [
    "1st half Won",
    "1st Half Loss",
    "2nd Half Won",
    "2nd Half Loss",
  ];
  // Populate the data array in the order of labels
  const data = labels.map((label) => {
    // Find the action key that maps to the current label
    const actionKey = Object.keys(actionMap).find(
      (key) => actionMap[key] === label
    );
    return actionCounts[actionKey] || 0;
  });
  const dataKickouts = kickoutLabels.map((label) => {
    // Find the action key that maps to the current label
    const actionKey = Object.keys(actionMap).find(
      (key) => actionMap[key] === label
    );
    return actionCounts[actionKey] || 0;
  });
  const kickoutsData = {
    labels: kickoutLabels,
    datasets: [
      {
        data: data,
      },
    ],
  };
  const shotsData = {
    labels: labels,
    datasets: [
      {
        data: data,
      },
    ],
  };

  const shotTimes = filteredPositions.reduce((acc, position) => {
    if (["point", "goal", "freeScore"].includes(position.action)) {
      acc.push({ action: position.action, time: position.time });
    }
    return acc;
  }, []);

  const quarters = [
    { label: "Q1", start: 0, end: 1050 },
    { label: "Q2", start: 1050, end: 2100 },
    { label: "Q3", start: 2100, end: 3150 },
    { label: "Q4", start: 3150, end: 4200 },
  ];

  const scoreTimingsData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        data: quarters.map(
          (quarter) =>
            shotTimes.filter(
              (shot) => shot.time >= quarter.start && shot.time < quarter.end
            ).length
        ),
      },
    ],
  };

  const actions = ["Free", "45", "Mark"];
  const kickoutActionCounts = {
    kickOppCatch: 1,
    kickoutBreakWon: 1,
    kickoutCatchWon: 1,
    kickoutOppBreak: 1,
    kickoutOut: 1,
  };

  const goodKickouts =
    (kickoutActionCounts.kickoutCatchWon || 0) +
    (kickoutActionCounts.kickoutBreakWon || 0);
  const missKickouts =
    (kickoutActionCounts.kickOppCatch || 0) +
    (kickoutActionCounts.kickoutOppBreak || 0) +
    (kickoutActionCounts.kickoutOut || 0);

  const totalKickouts = goodKickouts + missKickouts;
  const kickoutsPercentage = (goodKickouts / totalKickouts) * 100;
  let turnOverWonCount = 0;
  let turnOverLossCount = 0;
  filteredTurnoverPositions.forEach(function (turnover) {
    console.log(turnover.action);
    if (turnover.action === "turnOverWon") {
      turnOverWonCount += 1;
    } else {
      turnOverLossCount += 1;
    }
  });
  console.log(turnOverWonCount + "  is the total number of won turnovers");
  console.log(turnOverLossCount + "  is the total number of Loss turnovers");
  // Calculating the turnover percentage
  const turnoverPercentage =
    (turnOverWonCount / (turnOverLossCount + turnOverWonCount)) * 100;
  // const turnoverPercentage = 60;

  const totalAttempts =
    (actionCounts.freeScore || 0) +
    (actionCounts.goal || 0) +
    (actionCounts.point || 0) +
    (actionCounts.miss || 0) +
    (actionCounts.short || 0);
  const kickoutsWonNumber =
    (actionCounts.kickoutCatchWon || 0) + (actionCounts.kickoutBreakWon || 0);

  const successfulAttempts =
    (actionCounts.freeScore || 0) +
    (actionCounts.goal || 0) +
    (actionCounts.point || 0);
  const shotPercentage = (successfulAttempts / totalAttempts) * 100;

  const setplayData = {
    labels: ["Free", "45", "Mark"],
    legend: ["Score", "Miss"],
    data: [
      [3, 2],
      [4, 7],
      [5, 3],
    ],
    barColors: ["#0b63fb", "#242424"],
  };
  const barData = {
    labels: ["Blues", "Cooley", "Joes"], // optional
    data: [0.4, 0.6, 0.3],
  };
  const barChartConfig = {
    backgroundGradientFrom: "#12131A",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#12131A",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(11, 99, 251, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const setplayChartConfig = {
    backgroundColor: "#12131A",

    backgroundGradientFrom: "#12131A",
    backgroundGradientTo: "#12131A",

    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid lines instead of dashed
      stroke: "transparent", // effectively remove the lines
    },

    decimalPlaces: 0,
    barRadius: 10,
  };
  const chartConfig = {
    backgroundColor: "#12131A",
    backgroundGradientFrom: "#12131A",
    backgroundGradientTo: "#12131A",

    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "0",
      strokeWidth: "0",
      stroke: "#12131A",
    },
    fillShadowGradient: "#0964FB", // Bar color
    fillShadowGradientOpacity: 1, // Ensure the gradient is solid
    fillShadowGradientTo: "#0964FB", // Make sure the gradient goes to the same color
    barRadius: 8,
  };
  const PitchComponent = ({ positions, type, showSections }) => {
    const pitchWidth = Dimensions.get("window").width * 0.9; // 90% of the screen width
    const pitchHeight = Dimensions.get("window").height * 0.75; // Assuming 63% of the screen height for the pitch

    // Center of the top red box
    const centerOfTopGoal = {
      x: pitchWidth / 2,
      y: 0, // Adjust if the red box is not at the absolute top
    };

    // Separate positions into points and others
    const points = useMemo(() => {
      return positions
        .filter((position) => position.action === "point")
        .sort((a, b) => a.time - b.time);
    }, [positions]);

    const others = useMemo(() => {
      return positions.filter((position) => position.action !== "point");
    }, [positions]);

    const [visiblePaths, setVisiblePaths] = useState([]);

    useEffect(() => {
      points.forEach((position, index) => {
        setTimeout(() => {
          setVisiblePaths((prevVisiblePaths) => [
            ...prevVisiblePaths,
            { ...position, animatedValue: new Animated.Value(0) },
          ]);
        }, index * 300); // Adjust the delay as needed
      });
    }, [points]);

    useEffect(() => {
      visiblePaths.forEach(({ animatedValue }, index) => {
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      });
    }, [visiblePaths]);

    const mappedActions = useMemo(() => {
      const allPositions = [...visiblePaths, ...others]; // Combine staggered points and other actions

      return allPositions.map((position, index) => {
        const actionStyle = actionStyles[position.action];

        if (actionStyle) {
          if (
            position.action === "turnOverLoss" ||
            position.action === "turnOverWon"
          ) {
            return (
              <View
                key={index}
                style={{
                  position: "absolute",
                  top: position.y - 10,
                  left: position.x - 15,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 20,
                  height: 20,
                }}
              >
                {actionStyle.component}
              </View>
            );
          }

          const dx = centerOfTopGoal.x - position.x;
          const dy = centerOfTopGoal.y - position.y;
          const controlPointX = (position.x + centerOfTopGoal.x) / 2;
          const controlPointY = position.y - 50; // Adjust this value to control the curve

          const pathData = `M${position.x},${position.y} Q${controlPointX},${controlPointY} ${centerOfTopGoal.x},${centerOfTopGoal.y}`;

          const strokeDasharray = position.animatedValue
            ? position.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, pitchHeight], // Adjust the output range as needed
              })
            : pitchHeight;

          return (
            <React.Fragment key={index}>
              {position.action === "point" && (
                <Svg
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: pitchWidth,
                    height: pitchHeight,
                  }}
                >
                  <Path
                    d={pathData}
                    stroke="#0b63fb"
                    strokeWidth=".3"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                  />
                </Svg>
              )}
              <View
                style={[
                  {
                    position: "absolute",
                    top: position.y - 10,
                    left: position.x - 7,
                  },
                  actionStyle.style,
                ]}
              >
                {actionStyle.component || null}
              </View>
            </React.Fragment>
          );
        }
        return (
          <View
            key={index}
            style={{
              position: "absolute",
              top: position.y - 10,
              left: position.x - 7,
              width: 15,
              height: 15,
              backgroundColor: "#FFF",
              borderRadius: 10,
            }}
          />
        );
      });
    }, [visiblePaths, others]);

    return (
      <View
        className={`w-full ${
          type === "kickout" ? "h-[63vh]" : "h-[63vh]"
        } border-gray-400 border-1 rounded-xl overflow-hidden`}
      >
        <Text className="text-white mb-5  text-lg font-semibold">
          Pitch Section Stats
        </Text>
        <View className="bg-[#191A22] rounded-3xl h-full">
          <View className="h-full">
            {showSections && (
              //display square section
              <>
                <View className="w-1/3 h-[20%] border border-gray-300 absolute border-[#0b63fb]"></View>
                <View className="w-1/3 h-[20%] top-[20%] border border-gray-300 absolute border-[#0b63fb]"></View>
                <View className="w-1/3 h-[20%] top-[40%] border border-gray-300 absolute border-[#0b63fb]"></View>
                <View className="w-1/3 h-[20%] top-[60%] border border-gray-300 absolute border-[#0b63fb]"></View>
                <View className="w-1/3 h-[20%] top-[80%] border border-gray-300 absolute border-[#0b63fb]"></View>
                <View className="w-1/3 h-[20%] border border-gray-300 absolute border-[#0b63fb] left-1/3"></View>
                <View className="w-1/3 h-[20%] top-[20%] border border-gray-300 absolute border-[#0b63fb] left-1/3"></View>
                <View className="w-1/3 h-[20%] top-[40%] border border-gray-300 absolute border-[#0b63fb] left-1/3"></View>
                <View className="w-1/3 h-[20%] top-[60%] border border-gray-300 absolute border-[#0b63fb] left-1/3"></View>
                <View className="w-1/3 h-[20%] top-[80%] border border-gray-300 absolute border-[#0b63fb] left-1/3"></View>
                <View className="w-1/3 h-[20%] border border-gray-300 absolute border-[#0b63fb] left-2/3"></View>
                <View className="w-1/3 h-[20%] top-[20%] border border-gray-300 absolute border-[#0b63fb] left-2/3"></View>
                <View className="w-1/3 h-[20%] top-[40%] border border-gray-300 absolute border-[#0b63fb] left-2/3"></View>
                <View className="w-1/3 h-[20%] top-[60%] border border-gray-300 absolute border-[#0b63fb] left-2/3"></View>
                <View className="w-1/3 h-[20%] top-[80%] border border-gray-300 absolute border-[#0b63fb]  left-2/3"></View>
              </>
            )}
            {/* Pitch markings */}
            <View style={styles.pitchMarkings}>
              <View className="w-[15%] absolute left-[42.5%] h-6 border border-b-zinc-600 border-l-zinc-600 border-r-zinc-600"></View>
              <View style={[styles.line, { top: "10%" }]}></View>
              <View className="w-[30%] left-[35%] h-14 rounded-b-full border border-zinc-600 top-[15.5%]"></View>
              <View style={[styles.line, { top: "15.5%" }]}></View>
              <View style={[styles.line, { top: "34%" }]}></View>
              <View style={[styles.line, { top: "50%" }]}></View>
              <View style={[styles.line, { top: "64%" }]}></View>
              <View style={[styles.line, { top: "83.6%" }]}></View>
              <View style={[styles.line, { top: "89.5%" }]}></View>
            </View>
            {mappedActions}
          </View>
        </View>
      </View>
    );
  };
  const SummaryDataPercentageComponent = ({
    summaryPositions,
    summaryType,
  }) => {
    return summaryPositions
      .map((summary) => ({
        ...summary,
        percentage: Math.round(
          (summary.scores / (summary.scores + summary.misses)) * 100
        ),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .map((summary, index) => {
        const total = summary.scores + summary.misses;
        const getClassNameByPercentage = (percentage) => {
          if (percentage <= 25) {
            return "bg-gray-800";
          } else if (percentage <= 50) {
            return "bg-blue-300";
          } else if (percentage <= 75) {
            return "bg-blue-400";
          } else {
            return "bg-blue-700";
          }
        };
        const percentage = summary.percentage;
        const barClassName = getClassNameByPercentage(percentage);
        return (
          <>
            <View
              key={index}
              className="w-[85%] flex-row bg-[#191A22] mt-2 mx-auto rounded-lg p-1 px-2 justify-between"
            >
              <View className="h-auto flex-row w-full">
                <View className="my-auto h-12 flex-1 flex-row">
                  <View className="w-[30%] px-1 my-auto justify-center h-full flex-col">
                    {summaryType === "shot" && (
                      <Text className="text-gray-300 text-md font-semibold">
                        {summary.playerName}
                      </Text>
                    )}
                    {summaryType === "turnover" && (
                      <Text className="text-gray-300 text-md font-semibold">
                        Section
                      </Text>
                    )}
                    {/* <Text className="text-gray-300 text-md font-semibold">
                    C Bellew
                  </Text> */}
                    <Text className="text-gray-500 text-sm">
                      {summary.player}
                    </Text>
                  </View>
                  <View className="justify-center flex-col h-full items-center w-[40%]">
                    <View className="px-2 mx-auto items-center justify-center flex-row w-full">
                      <View
                        className="bg-blue-600 rounded-l-lg h-1"
                        style={{
                          width: `${(summary.scores / total) * 100}%`,
                        }}
                      ></View>
                      <View
                        className="bg-gray-400 h-1 rounded-r-lg"
                        style={{
                          width: `${(summary.misses / total) * 100}%`,
                        }}
                      ></View>
                    </View>
                    <View className="flex-row w-full mt-2 px-2">
                      <Text className="text-gray-300">{summary.scores} +</Text>
                      <Text className="ml-auto text-gray-300">
                        {summary.misses} -
                      </Text>
                    </View>
                  </View>
                  <View className="w-[40%] h-full">
                    <Text className="text-lg mx-auto my-auto font-bold text-gray-300">
                      {percentage}%
                    </Text>
                    <View
                      className={`w-8 mx-auto h-[2px] rounded-lg top-[-1vh] ${barClassName}`}
                    ></View>
                  </View>
                </View>
              </View>
            </View>
          </>
        );
      });
  };

  const DataTableSummaryComponent = ({ tableData }) => {
    return (
      <>
        <View className=" w-[90%] mx-auto rounded-lg p-2">
          <View className="w-full mx-auto flex-row p-2">
            <View className="w-1/3 px-1">
              <Text className="text-gray-200  ">Action</Text>
            </View>

            <View className="w-1/3 px-1">
              <Text className="text-gray-200 text-center">Player</Text>
            </View>
            <View className="w-1/3 px-1">
              <Text className="text-gray-200 text-center">Score</Text>
            </View>
          </View>
          <ScrollView
            className="h-[50vh]"
            style={{ maxHeight: "10vh" }} // Set a maxHeight to ensure it scrolls within its bounds
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {tableData.map((position, index) => (
              <View
                key={index}
                className="flex-row bg-[#191A22] my-1  p-3 rounded-lg"
              >
                <View className="w-1/3 flex-row px-1">
                  <Text className="text-gray-500 mr-2 text-center">
                    {String(Math.round(position.time / 60)).padStart(2, "0")}
                  </Text>

                  <Text className="text-gray-200 text-center">
                    {position.action}
                  </Text>
                </View>

                <View className="w-1/3 my-auto  px-1">
                  <Text className="text-gray-200 text-center">
                    {position.player}
                  </Text>
                </View>
                <View className="w-1/3 my-auto  px-1">
                  <Text className="text-gray-200 text-center">2-11</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </>
    );
  };
  const DataTableComponent = ({ tableData }) => {
    return (
      <>
        <View className=" w-[90%] mx-auto rounded-lg p-2">
          <View className="w-full mx-auto flex-row p-2">
            <View className="w-1/3 px-1">
              <Text className="text-gray-200  ">Action</Text>
            </View>

            <View className="w-1/3 px-1">
              <Text className="text-gray-200 text-center">Player</Text>
            </View>
            <View className="w-1/3 px-1">
              <Text className="text-gray-200 text-center">Score</Text>
            </View>
          </View>
          <ScrollView
            className="h-[50vh]"
            style={{ maxHeight: "10vh" }} // Set a maxHeight to ensure it scrolls within its bounds
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {tableData.map((position, index) => (
              <View
                key={index}
                className="flex-row bg-[#191A22] my-1  p-3 rounded-lg"
              >
                <View className="w-1/3 flex-row px-1">
                  <Text className="text-gray-500 mr-2 text-center">
                    {String(Math.round(position.time / 60)).padStart(2, "0")}
                  </Text>

                  <Text className="text-gray-200 text-center">
                    {position.action}
                  </Text>
                </View>

                <View className="w-1/3 my-auto  px-1">
                  <Text className="text-gray-200 text-center">
                    {position.player}
                  </Text>
                </View>
                <View className="w-1/3 my-auto  px-1">
                  <Text className="text-gray-200 text-center">2-11</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </>
    );
  };
  const maxValue = Math.max(
    ...scoreTimingsData.datasets.map((dataset) => Math.max(...dataset.data))
  );
  const ListDataTest = [
    {
      id: "1",
      firstPitchTitle: "Scores/Misses",
      secondPitchTitle: "Set Plays Breakdown",
      lineChartTitle: "Score Timings",
      text: "This is some text for page 1",
      pitchData: filteredPositions, // Pass filteredPositions directly
      pitchType: "shot",
      firstChartPercentage: (successfulAttempts / totalAttempts) * 100,
      firstPitchDataLegend: [
        { title: "Score", color: "bg-blue-600" },
        { title: "Miss", color: "bg-red-600" },
      ],
      secondPitchDataLegend: [
        { title: "Score", color: "bg-blue-600" },
        { title: "Miss", color: "bg-red-600" },
        { title: "Short", color: "bg-red-300" },
        { title: "Goal", color: "bg-cyan-600" },
        { title: "Free", color: "bg-blue-800" },
      ],
      lineChartData: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            data: quarters.map(
              (quarter) =>
                shotTimes.filter(
                  (shot) =>
                    shot.time >= quarter.start && shot.time < quarter.end
                ).length
            ),
          },
        ],
      },
      setPlayData: setPlayFilteredPositions,
      setPlayDataBarChart: setPlayData1,
      shotDataChart: shotsData,
      summaryDataPercentage: summaryShotsPositionsFiltered,
      summaryDataLegend: [
        { title: "score", color: "bg-blue-600" },
        { title: "miss", color: "bg-gray-400" },
      ],
      dataType: "shot",
    },
    {
      id: "2",
      firstPitchTitle: "Kickouts",
      secondPitchTitle: "Kickouts Breakdown",
      lineChartTitle: "Kickouts Timings",
      text: "This is some text for page 1",
      firstChartPercentage: kickoutsPercentage,
      pitchData: filteredKickoutPositions, // Pass filteredPositions directly
      pitchType: "kickout",
      firstPitchDataLegend: [
        { title: "Won", color: "0b63fb" },
        { title: "Loss", color: "ef233c" },
      ],
      secondPitchDataLegend: [
        { title: "Catch", color: "0b63fb" },
        { title: "Break Won", color: "ef233c" },
        { title: "Loss", color: "ef233c" },
        { title: "Break Loss", color: "0b63fb" },
        { title: "Out", color: "0b63fb" },
      ],
      lineChartData: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            data: quarters.map(
              (quarter) =>
                shotTimes.filter(
                  (shot) =>
                    shot.time >= quarter.start && shot.time < quarter.end
                ).length
            ),
          },
        ],
      },
      setPlayData: filteredKickoutPositions,
      setPlayDataBarChart: kickoutBarChartData,
      shotDataChart: kickoutsData,
      summaryDataPercentage: summaryKickoutsPositionsFiltered,
      summaryDataLegend: [
        { title: "won", color: "#0b63fb" },
        { title: "loss", color: "#c9c9c9" },
      ],
      dataType: "kickout",
    },
    {
      id: "3",
      firstPitchTitle: "Turnovers",
      secondPitchTitle: "Turnovers Breakdown",
      lineChartTitle: "Turnover Timings",
      text: "This is some text for page 1",
      firstChartPercentage: turnoverPercentage,
      pitchData: filteredTurnoverPositions, // Pass filteredPositions directly
      pitchType: "kickout",
      firstPitchDataLegend: [
        { title: "Won", color: "0b63fb" },
        { title: "Loss", color: "ef233c" },
      ],
      secondPitchDataLegend: [
        { title: "1st Won", color: "0b63fb" },
        { title: "1st Loss", color: "ef233c" },
        { title: "2nd Won", color: "ef233c" },
        { title: "2nd Loss ", color: "0b63fb" },
      ],
      lineChartData: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            data: quarters.map(
              (quarter) =>
                shotTimes.filter(
                  (shot) =>
                    shot.time >= quarter.start && shot.time < quarter.end
                ).length
            ),
          },
        ],
      },
      setPlayData: filteredTurnoverPositions,
      setPlayDataBarChart: turnoverBarChartData,
      shotDataChart: kickoutsData,
      summaryDataPercentage: summaryTurnoversPositionsFiltered,
      summaryDataLegend: [
        { title: "won", color: "#0b63fb" },
        { title: "loss", color: "#c9c9c9" },
      ],
      dataType: "turnover",
    },
  ];
  const renderItem = ({ item }) => (
    <View style={styles.page} className="px-5  top-0  h-auto ">
      {/* <View className="bg-red-600"> */}
      <View className="w-[95%] flex-row mb-3">
        <View className="w-3/5 ">
          <Text className="" style={styles.title}>
            {item.firstPitchTitle}
          </Text>
        </View>
        <View className="w-2/5   items-end items-end">
          <Text className="mx-auto  justify-center my-auto items-center text-white text-md font-semibold">
            {Math.round(item.firstChartPercentage)}%
          </Text>
          <View className="h-2 mb-2justify-end my-auto w-[100%] flex-row   rounded-lg">
            <View
              style={{
                width: `${Math.round(item.firstChartPercentage)}%`,
                height: "100%",
                backgroundColor: "#0b63fb86",
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
            ></View>
            <View
              style={{
                width: `${100 - Math.round(shotPercentage)}%`,
                height: "100%",
                backgroundColor: "#242424",
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
            ></View>
          </View>
        </View>
      </View>
      {/* </View> */}
      <View className="w-full  top- h-auto ">
        {item.firstPitchDataLegend && (
          <View className="items-start justify-start items-center w-[90%] flex-row mb-2">
            {item.firstPitchDataLegend.map((legend, index) => (
              <React.Fragment key={index}>
                <View
                  className={`${legend.color} w-3 h-3 mr-2 rounded-full`}
                ></View>
                <Text className="text-white capitalize mr-2">
                  {legend.title}
                </Text>
              </React.Fragment>
            ))}
          </View>
        )}
        {item.pitchData && (
          //! here is wherw I can fix the pitch height issue
          <View
            className={` w-full mx-auto
          ${currentIndex === 0 ? "max-h-[63vh]" : "max-h-[63vh]"}

           
           overflow-hidden  z-50`}
          >
            <PitchComponent positions={item.pitchData} type={item.pitchType} />
          </View>
        )}
      </View>
      {item.shotDataChart && (
        <ShotChartComponent shotChartDataProp={item.shotDataChart} />
      )}
      <Text></Text>
      <Hr />
      <Text></Text>
      <View className="w-[95%] mb-3">
        <Text className="" style={styles.title}>
          {item.secondPitchTitle}
        </Text>
      </View>
      {/* below is cuaing issue rendering when not existsed */}
      {item.secondPitchDataLegend && (
        <View className="items-start justify-start items-center w-[90%] h-auto flex-row mb-2">
          {item.secondPitchDataLegend.map((legend, index) => (
            <>
              <React.Fragment key={index}>
                <View
                  key={index}
                  className={`${legend.color} w-3 h-3 mr-2 rounded-full`}
                ></View>
                <Text className="text-white capitalize mr-2">
                  {legend.title}
                </Text>
              </React.Fragment>
            </>
          ))}
        </View>
      )}
      {item.setPlayData && (
        <View
          className={` w-full mx-auto
         ${currentIndex === 0 ? "max-h-[63vh]" : "max-h-[63vh]"}

          
          overflow-hidden  z-50`}
        >
          <PitchComponent positions={item.setPlayData} />
        </View>
      )}

      {item.setPlayDataBarChart && (
        <>{/* <SetPlayChartComponent setplayDataProp={setPlayData1} /> */}</>
      )}
      {/* above is causing issue */}
      <Hr />
      <View className=" w-full ml-10">
        <Text className="text-white  items-start justify-start mt-5 text-2xl font-bold tracking-wider">
          {item.lineChartTitle && (
            <>
              <Text>{item.lineChartTitle}</Text>
            </>
          )}
          {/* <Text className="text-white   mt-5 text-xl font-semibold tracking-wider">
            Score Timings
          </Text> */}
        </Text>
      </View>
      {item.lineChartData && (
        <LineChart
          data={{
            labels: item.lineChartData.labels,
            datasets: item.lineChartData.datasets.concat([
              { data: [1] }, // min
              { data: [maxValue] }, // max
            ]),
          }}
          width={Dimensions.get("window").width * 0.9} // from react-native
          height={225}
          chartConfig={{
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
            backgroundColor: "#12131A",
            backgroundGradientFrom: "#12131A",
            backgroundGradientTo: "#12131A",
            fillShadowGradient: "rgba(11, 99, 251, 1)",
            fillShadowGradientTo: "rgba(0, 0, 0, 1)", // Bottom gradient color
            fillShadowGradientOpacity: 1, // Ensure the gradient is solid
            decimalPlaces: 0, // optional, defaults to 2dp
            withDots: false,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      )}
      {/* enter new shot data table here hai  */}
      <Hr />

      <View className="w-full mb-5">
        <PitchComponent
          positions={item.pitchData}
          type={item.pitchType}
          showSections={true}
        />
      </View>
      <View className="ml-10 mb-2 justify-start items-start w-full px-2">
        <Text className="text-white w-auto text-2xl font-bold ">
          {item.firstPitchTitle} Data
        </Text>
        <View className=" w-auto flex-row space-x-2 py-2">
          {item.summaryDataLegend &&
            item.summaryDataLegend.map((legend) => (
              <>
                <View
                  className={`rounded-2xl w-10 ${legend.color} h-1 my-auto mr-2`}
                ></View>
                <Text className="text-white mr-4">{legend.title}</Text>
              </>
            ))}
        </View>
      </View>

      <SummaryDataPercentageComponent
        summaryPositions={item.summaryDataPercentage}
        summaryType={item.dataType}
      />

      {/* <DataTableComponent tableData={item.pitchData} /> */}
    </View>
  );

  const ChartDataDropdown2 = ({ shotsData, title }) => {
    const [showShotData, setShowShotData] = useState(false);

    const transformShotsData = (shotsData) => {
      if (
        !shotsData.labels ||
        !shotsData.datasets ||
        !shotsData.datasets[0].data
      ) {
        return [];
      }
      return shotsData.labels.map((label, index) => ({
        id: index.toString(),
        col1: label,
        col2: shotsData.datasets[0].data[index]?.toString() || "N/A",
      }));
    };

    const transformedShotsData = transformShotsData(shotsData);

    return (
      <View className="bg-[#191A22] rounded-md  w-full items-center ">
        {/* <TouchableOpacity
          onPress={() => setShowShotData(!showShotData)}
          className="w-64 bg-[#191A22] items-center p-2 rounded-lg flex-row"
        >
          <Text className="text-white text-center mx-auto">{title}</Text>
          <View className="l-5  w-7 h-7 rounded-full">
            <Text className="text-white text-center my-auto font-bold text-md">
              {!showShotData ? "+" : "-"}
            </Text>
          </View>
        </TouchableOpacity> */}
        {/* <View className="flex-row justify-between items-center w-auto space-x-2 mx-auto ">
          <TouchableOpacity
            onPress={() => setShowShotData(!showShotData)}
            className="mx-5 bg-[#191A22] w-auto mx-auto  items-center  p-2 rounded-md flex-row"
          >
            <Text className="text-white text-center mx-auto"></Text>
            <View className="p-2 rounded-md">
              <Text className="text-white text-center my-auto font-bold text-md">
                Data
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowTimingsData(!showTimingsData)}
            className="mx-5 bg-[#191A22] w-auto mx-auto  items-center  p-2 rounded-md flex-row"
          >
            <Text className="text-white text-center mx-auto"></Text>
            <View className="p-2 rounded-md">
              <Text className="text-white text-center my-auto font-bold text-md">
                Pitch View
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}
        {/* {showShotData && (
          <View className="w-full bg-red-600 mt-3">
            <View className="flex flex-row px-2 justify-between border-b border-gray-700 pb-2">
              <Text className="text-white w-1/4">Actions</Text>
              <Text className="text-white w-1/4">Totals</Text>
            </View>
            {Array.isArray(transformedShotsData) &&
              transformedShotsData.map((item, index) => (
                <View
                  key={item.id}
                  className={`flex flex-row justify-between rounded-lg px-2 py-1 ${
                    index % 2 === 1 ? "bg-[#1011010]" : ""
                  }`}
                >
                  <Text className="text-white w-1/4">{item.col1}</Text>
                  <Text className="text-white w-1/4">{item.col2}</Text>
                </View>
              ))}
          </View>
        )} */}
      </View>
    );
  };
  const ChartDropdown2 = ({ dropDownData, title }) => {
    const [showShotData, setShowShotData] = useState(false);

    // Validate dropDownData structure
    const hasValidData =
      dropDownData &&
      dropDownData.labels &&
      dropDownData.legend &&
      dropDownData.data;

    return (
      <View className="bg-[#191A22] rounded-md p-4 w-[90%] items-center mt-5">
        <TouchableOpacity
          onPress={() => setShowShotData(!showShotData)}
          className="w-64 bg-[#191A22] items-center p-2 rounded-lg flex-row"
        >
          <Text className="text-white text-center mx-auto">{title}</Text>
          <View className="l-5  w-7 h-7 rounded-full">
            <Text className="text-white text-center my-auto font-bold text-md">
              {!showShotData ? "+" : "-"}
            </Text>
          </View>
        </TouchableOpacity>
        {showShotData && hasValidData && (
          <View className="w-full mt-3">
            <View className="flex flex-row px-2 justify-between border-b border-gray-700 pb-2">
              <Text className="text-white w-1/4">Label</Text>
              {dropDownData.legend.map((legendItem, index) => (
                <Text key={index} className="text-white w-1/4">
                  {legendItem}
                </Text>
              ))}
            </View>
            {dropDownData.data.map((item, index) => (
              <View
                key={index}
                className={`flex flex-row justify-between rounded-lg px-2 py-1 ${
                  index % 2 === 1 ? "bg-[#1011010]" : ""
                }`}
              >
                <Text className="text-white w-1/4">
                  {dropDownData.labels[index]}
                </Text>
                {item.map((value, subIndex) => (
                  <Text key={subIndex} className="text-white w-1/4">
                    {value}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
        {showShotData && !hasValidData && (
          <Text className="text-white mt-3">No valid data available</Text>
        )}
      </View>
    );
  };
  const ShotChartComponent = ({ shotChartDataProp }) => {
    return (
      <View
        style={{
          width: "90%",
          backgroundColor: "#12131A",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: "auto",
          borderRadius: 16,
        }}
        className="h-[25vh]"
      >
        <BarChart
          style={{ marginVertical: 0, borderRadius: 16, marginRight: 0 }}
          data={shotChartDataProp}
          withInnerLines={false}
          width={Dimensions.get("window").width * 0.9}
          height={200}
          yAxisLabel=""
          verticalLabelRotation={0}
          chartConfig={chartConfig}
          fromZero
        />
      </View>
    );
  };
  function ShotPercentageComponent() {
    return (
      <View className="w-[90%] bg-[#12131A] p-4 rounded-lg my-5 mx-auto h-auto ">
        <View className=" ">
          <View className="h-auto mb-5  justify-center">
            <Text className="text-white text-center text-xl mt-5 font-semibold mb-5">
              Shot Percentage
            </Text>
            <View className="h-6 w-[70%] flex-row  mx-auto rounded-lg">
              <View
                style={{
                  width: `${Math.round(shotPercentage)}%`,
                  height: "100%",
                  backgroundColor: "#0b63fb86",
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              ></View>
              <View
                style={{
                  width: `${100 - Math.round(shotPercentage)}%`,
                  height: "100%",
                  backgroundColor: "#242424",
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              ></View>
            </View>
            <View className="w-[70%] mx-auto mt-2  justify-between flex-row">
              <Text className="text-zinc-400">Scores</Text>
              <Text className="mx-auto text-white text-lg font-semibold">
                {Math.round(shotPercentage)}%
              </Text>
              <Text className="text-zinc-400 items-end justify-end end-0 right-0">
                Misses
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const ScoresTimingsComponent = () => {
    // const scoreTimingsData = {
    //   labels: ["Q1", "Q2", "Q3", "Q4"],
    //   datasets: [
    //     {
    //       data: [3, 4, 2, 6], // dataset
    //     },
    //   ],
    // };
    const maxValue = Math.max(
      ...scoreTimingsData.datasets.map((dataset) => Math.max(...dataset.data))
    );
    return (
      <>
        <View className="w-[90%] bg-[#12131A] mx-auto h-auto mt-5 rounded-t-xl">
          {/* <Hr /> */}
        </View>
        <View className="bg-[#12131A] w-[90%] mx-auto">
          {/* <LineChart
            data={{
              labels: scoreTimingsData.labels,
              datasets: scoreTimingsData.datasets.concat([
                { data: [1] }, // min
                { data: [maxValue] }, // max
              ]),
            }}
            width={Dimensions.get("window").width * 0.9} // from react-native
            height={225}
            chartConfig={{
              propsForBackgroundLines: {
                strokeWidth: 0,
              },
              backgroundColor: "#12131A",
              backgroundGradientFrom: "#12131A",
              backgroundGradientTo: "#12131A",
              fillShadowGradient: "rgba(11, 99, 251, 1)",
              fillShadowGradientTo: "rgba(0, 0, 0, 1)", // Bottom gradient color
              fillShadowGradientOpacity: 1, // Ensure the gradient is solid
              decimalPlaces: 0, // optional, defaults to 2dp
              withDots: false,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          /> */}
        </View>
        {/* <View className="flex-row pb-2 bg-[#12131A]  rounded-b-lg w-[90%] justify-between items-center  space-x-2 mx-auto ">
          <TouchableOpacity
            onPress={() => setShowTimingsData(!showTimingsData)}
            className="mx-5 bg-[#12131A] w-auto mx-auto  items-center  p-2 rounded-md flex-row"
          >
            <Text className="text-white text-center mx-auto"></Text>
            <View className="p-2 rounded-md">
              <Text className="text-white text-center my-auto font-bold text-md">
                Data
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowTimingsData(!showTimingsData)}
            className="mx-5 bg-[#12131A] w-auto mx-auto  items-center  p-2 rounded-md flex-row"
          >
            <Text className="text-white text-center mx-auto"></Text>
            <View className="p-2 rounded-md">
              <Text className="text-white text-center my-auto font-bold text-md">
                Pitch View
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}

        <View className=" w-[90%] bg-[#12131A] mx-auto">
          {showTimingsData && (
            <View className="mx-auto items-center justify-center my-auto w-[90%]">
              <View className="w-full bg-[#12131A] p-4 rounded-lg ">
                <View className="flex flex-row px-4 justify-between border-b border-gray-700 pb-2">
                  <Text className="text-white w-1/2">Quarter</Text>
                  <Text className="text-white w-1/2">Total</Text>
                </View>
                {scoreTimingsData.labels.map((label, index) => (
                  <View
                    key={index}
                    className={`flex rounded-lg px-4 flex-row justify-between py-2 ${
                      index % 2 === 1 ? "bg-[#202020]" : ""
                    }`}
                  >
                    <Text className="text-white w-1/2">{label}</Text>
                    <Text className="text-white w-1/2">
                      {scoreTimingsData.datasets[0].data[index]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
        {/* <Hr /> */}
      </>
    );
  };
  // Component definition
  function SetPlayChartComponent({ setplayDataProp }) {
    // Defensive checks to ensure data is defined and correct
    const chartData = useMemo(() => {
      if (
        !setplayDataProp ||
        !setplayDataProp.data ||
        !Array.isArray(setplayDataProp.data) ||
        setplayDataProp.data.length === 0
      ) {
        return { data: [], labels: [], legend: [], barColors: [] };
      }

      // Ensure all data entries are numbers
      const validData = setplayDataProp.data.map((entry) =>
        entry.map((value) => (isNaN(value) ? 0 : value))
      );

      return {
        ...setplayDataProp,
        data: validData,
      };
    }, [setplayDataProp]);

    console.log("Chart Data:", chartData); // Add logging

    // Ensure width and height are valid
    const chartWidth = useMemo(() => {
      const width = Dimensions.get("window").width * 0.9;
      return isNaN(width) ? 300 : width; // Fallback to 300 if NaN
    }, []);

    const chartHeight = useMemo(() => {
      const height = 220;
      return isNaN(height) ? 220 : height; // Fallback ssto 220 if NaN , dpesn not work
    }, []);

    return (
      <View className="w-[90%] h-[29vh] mt-2 mx-auto justify-center rounded-xl bg-[#12131A] text-center items-center">
        <StackedBarChart
          className="mx-auto"
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          renderBarLabel={renderBarLabel}
          chartConfig={setplayChartConfig}
          style={{
            marginVertical: 0,
            borderRadius: 20,
          }}
        />
      </View>
    );
  }

  // function SetPlayChartComponent({ setplayDataProp = { data: [] } }) {
  //   // Add defensive checks to ensure data is defined
  //   const chartData =
  //     setplayDataProp && setplayDataProp.data ? setplayDataProp : { data: [] };

  //   return (
  //     <View className=" w-[90%] h-[29vh] mt-2 mx-auto justify-center rounded-xl bg-[#12131A]  text-center items-center">
  //       <StackedBarChart
  //         className="mx-auto"
  //         data={chartData}
  //         width={Dimensions.get("window").width * 0.9}
  //         height={220}
  //         renderBarLabel={renderBarLabel}
  //         chartConfig={setplayChartConfig}
  //         style={{
  //           marginVertical: 0,
  //           borderRadius: 20,
  //         }}
  //       />
  //       {/* <ChartDropdown2 dropDownData={setPlayData1} title="Set Play Data" /> */}
  //     </View>
  //   );
  // }
  return (
    <>
      {showGameDetailsMenu && (
        <View className="h-full absolute w-full  z-40">
          <TouchableOpacity
            onPress={() => setShowGameDetailsMenu(false)}
            className="flex-1 bg-black/50  w-full z-40 "
          ></TouchableOpacity>
          <View className="bg-[#12131A] items-center justify-center w-full h-auto z-50 rounded-3xl">
            {/* <TouchableOpacity
              onPress={() => setShowGameDetailsMenu(false)}
              className="bg-[#191A22]  absolute top-20  w-10 h-10 justify-center items-center rounded-lg  left-10"
            >
              <FontAwesomeIcon icon={faChevronLeft} size={25} color="#fff" />
            </TouchableOpacity> */}
            <View
              ref={viewRef}
              className=" justify-center mx-auto w-[95%] mx-10 relative"
            >
              <View className=" w-[95%] mx-auto flex-row h-auto">
                <View className="w-1/2 h-full ">
                  <Text className="text-xl mx-5 mt-10 font-bold text-gray-200 ">
                    Game Details
                  </Text>
                  <Text className="text-xl mx-5  capitalize  text-gray-500 ">
                    {gameData.timestamp}
                  </Text>
                  <Text className="text-2xl mx-5 font-bold capitalize mt-3 text-gray-200 ">
                    {gameData.gameName}
                  </Text>
                  <Text className="text-xl mx-5  capitalize  text-gray-500 ">
                    {gameData.venue}
                  </Text>
                </View>
                <View className="w-1/2 h-full items-end ">
                  <Text className="text-xl mx-5 mt-10 font-bold text-gray-200 ">
                    Score
                  </Text>
                  <Text className="text-xl mx-5    text-gray-500 ">FT</Text>
                  {/* <Text className="text-md mx-10 font-semibold capitalize mt-3 text-[#191A22] ">
                {gameData.timestamp}
              </Text> */}
                  <Text className="text-2xl mx-5 font-bold capitalize mt-3 text-[#0b63fb] ">
                    2:10 - 3:09
                  </Text>
                  <Text className="text-xl mx-5  capitalize  text-gray-500 ">
                    Win
                  </Text>
                </View>
              </View>

              <View className="justify-center mx-auto w-full  items-center">
                <TouchableOpacity className="p-4 bg-[#0b63fb] w-[90%] items-center  rounded-3xl mt-16">
                  <Text className="font-bold text-white text-md px-4">
                    Share to WhatsApp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Testing")}
                  className="p-4 mb-10 bg-gray-300 w-[90%] items-center  rounded-lg mt-4"
                >
                  <Text className="font-bold text-md px-4">Download Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      <Modal
        transparent={true}
        visible={showStatisticsModal}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-full min-h-screen bg-white">
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              className="bg-blue-400"
            >
              <View className="w-full max-w-md bg-yellow-300 justify-center items-center p-4">
                <Text className="text-black text-2xl mb-4">
                  Scrollable Content
                </Text>
                <TouchableOpacity
                  className="bg-red-500 p-2 rounded"
                  onPress={() => setShowStatisticsModal(false)}
                >
                  <Text className="text-white">Close Modal</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <SafeAreaView className="flex-1 bg-[#12131A]">
        <ScrollView
          ref={scrollViewRef}
          style={{ marginBottom: 40 }}
          // onScrollEndDrag={handleScrollEnd}
          scrollEventThrottle={16}
          // className="bg-red-600"
        >
          <View
            id="page1"
            className="h-auto w-[90%] mx-auto  justify-center my-auto "
          >
            <View className="flex-row h-[5vh] my-5  justify-start   space-x-7 mx-auto items-center w-[95%]">
              <View className="flex-1 h-full flex-row space-x-2 items-center">
                <View>
                  <Text className="text-white text-start text-xl ">
                    {gameData.gameName}
                  </Text>
                  <View className="flex-row">
                    <Text className="text-gray-400 mr-2 capitalize text-start text-sm font-medium">
                      {gameData.venue}
                    </Text>
                    <Text className="text-gray-400 capitalize text-start text-sm font-medium">
                      {gameData.timestamp}
                    </Text>
                  </View>
                </View>

                {/* <TouchableOpacity
                  onPress={() => navigation.navigate("HomeDashboard")}
                  className="bg-[#191A22] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto"
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={15}
                    color="#fff"
                    className="my-auto justify-center"
                  />
                </TouchableOpacity> */}
                {/* <TouchableOpacity className="bg-[#191A22] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto">
                  <FontAwesomeIcon
                    icon={faSliders}
                    size={15}
                    color="#fff"
                    className="my-auto justify-center"
                  />
                </TouchableOpacity> */}
              </View>
              {/* <View className="flex-row bg-red-500 items-center">
                <View className="text-center space-x-1 px-3 py-2 rounded-xl ">
                  <Text className="text-white text-center text-2xl font-semibold"></Text>
                </View>
              </View> */}
              <View className="flex-1   h-full flex-row space-x-2  items-center">
                <TouchableOpacity
                  onPress={() => navigation.navigate("HomeDashboard")}
                  className="bg-[#191A22]  h-auto text-center items-center p-3 rounded-md w-1/3 mx-auto  mr-1"
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={15}
                    color="#fff"
                    className="my-auto justify-center "
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowStatisticsModal(true)}
                  className="bg-[#191A22] h-auto text-center items-center p-3 rounded-md w-1/3 mx-auto"
                >
                  <FontAwesomeIcon
                    icon={faChartLine}
                    size={15}
                    color="#fff"
                    className="my-auto justify-center"
                  />
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#191A22] h-auto text-center items-center p-3 rounded-md w-1/3 mx-auto">
                  <FontAwesomeIcon
                    icon={faShare}
                    size={15}
                    color="#fff"
                    className="my-auto justify-center"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowGameDetailsMenu(true)}
                  className="bg-[#191A22] h-auto text-center items-center p-3 rounded-md w-1/3 mx-auto"
                >
                  <FontAwesomeIcon
                    icon={faInfo}
                    size={15}
                    color="#fff"
                    className="my-auto justify-center"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* <Hr></Hr> */}
          <View
            id="page2"
            className="w-[90%] mx-auto h-auto justify-center"
          ></View>
          <ScoresTimingsComponent />
          <View className="w-full h-auto">
            <GameDataDisplay
              filteredPositions={filteredPositions}
              filteredKickoutPositions={filteredKickoutPositions}
              filteredTurnoverPositions={filteredTurnoverPositions}
              filteredCustomPositions={filteredCustomPositions}
            />
          </View>
          <View className="   mx-auto w-full  rounded-md">
            <Text></Text>
            <Text></Text>
            <FlatList
              ref={flatListRef}
              data={ListDataTest}
              renderItem={renderItem}
              // keyExtractor={(item) => item.id}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
            />
          </View>

          {summaryShotsPositionsFiltered
            .map((summary) => ({
              ...summary,
              percentage: Math.round(
                (summary.scores / (summary.scores + summary.misses)) * 100
              ),
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .map((summary, index) => {
              const total = summary.scores + summary.misses;
              const getClassNameByPercentage = (percentage) => {
                if (percentage <= 25) {
                  return "bg-gray-800";
                } else if (percentage <= 50) {
                  return "bg-blue-300";
                } else if (percentage <= 75) {
                  return "bg-blue-400";
                } else {
                  return "bg-blue-700";
                }
              };
              const percentage = summary.percentage;
              const barClassName = getClassNameByPercentage(percentage);
            })}

          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
        </ScrollView>
        <View
          id="top-navigation"
          className="w-full  z-50 h-[8vh] relative justify-center items-center rounded-t-3xl"
          style={{ zIndex: 1, position: "absolute", bottom: 5 }}
        >
          <View className="flex-row bg-[#191a229f] rounded-3xl px-10 justify-center items-center">
            <TouchableOpacity
              className="p-4 flex"
              onPress={() => handlePress(0)}
            >
              <Text
                className={`${
                  currentIndex === 0 ? "text-white" : "text-zinc-400"
                }`}
              >
                Shots
              </Text>
              <View
                className={`${
                  currentIndex === 0
                    ? "w-1 h-1 rounded-full bg-[#0b63fb] mx-auto"
                    : "w-1 h-1 rounded-full bg-zinc-400 mx-auto"
                }`}
              ></View>
            </TouchableOpacity>
            <TouchableOpacity className="p-4" onPress={() => handlePress(1)}>
              <Text
                className={`${
                  currentIndex === 1 ? "text-white " : "text-zinc-400"
                }`}
              >
                Kickouts
              </Text>
              <View
                className={`${
                  currentIndex === 1
                    ? "w-1 h-1 rounded-full bg-[#0b63fb] mx-auto"
                    : "w-1 h-1 rounded-full bg-zinc-400 mx-auto"
                }`}
              ></View>
            </TouchableOpacity>
            <TouchableOpacity className="p-4" onPress={() => handlePress(2)}>
              <Text
                className={`${
                  currentIndex === 2 ? "text-white " : "text-zinc-400"
                }`}
              >
                Turnovers
              </Text>
              <View
                className={`${
                  currentIndex === 2
                    ? "w-2 h-2 rounded-full bg-[#0b63fb] mx-auto"
                    : "w-1 h-1 rounded-full bg-zinc-400 mx-auto"
                }`}
              ></View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  page: {
    width: Dimensions.get("window").width,
    justifyContent: "start",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  pitchContainer: {
    width: "100%",
    height: "52vh",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    position: "relative",
    alignSelf: "center",
    marginTop: 10,
  },
  pitch: {
    width: "100%",
    height: "100%",
    backgroundColor: "#191A22",
    borderRadius: 10,
    position: "relative",
  },
  pitchMarkings: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  line: {
    height: 1,
    width: "100%",

    backgroundColor: "gray",
    position: "absolute",
  },
  centerCircle: {
    position: "absolute",
    width: 56,
    height: 24,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 12,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -28 }],
  },
  curvedLine: {
    width: "20%",
    height: 100,
    position: "absolute",
    bottom: -25,
    left: "40%",
    borderRadius: 35,
    backgroundColor: "black",
    transform: [{ scaleX: 5 }, { scaleY: 1 }],
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
});
