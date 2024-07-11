import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  BarChart,
  LineChart,
  StackedBarChart,
  ProgressChart,
} from "react-native-chart-kit";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import {
  faFutbol,
  faInfo,
  faShare,
  faChevronLeft,
  faSliders,
  faDownload,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
export default function App() {
  const navigation = useNavigation();
  //!usestates
  const [showShotData, setShowShotData] = useState(false);
  const [showTimingsData, setShowTimingsData] = useState(false);
  const route = useRoute();
  const { gameData } = route.params; // Access the passed parameters
  function Hr() {
    return (
      <>
        <View className="w-[90%] mx-auto h-[1px]  bg-zinc-800"></View>
      </>
    );
  }
  const actionStyles = {
    turnOverLoss: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        backgroundColor: "#101010",
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
        backgroundColor: "#101010",
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
        backgroundColor: "#FE4F3F",
      },
    },
    freeMiss: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#003459",
      },
    },
    freeScore: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
      },
    },
    markScore: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "green",
      },
    },
    markMiss: {
      style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "red",
      },
    },
    kickoutLoss: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#FD5F5F",
        backgroundColor: "#101010",
      },
    },
    point: {
      style: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: "#fff",
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
    kickoutCatch: {
      style: {
        width: 8,
        height: 8,
        backgroundColor: "#80ed99",
      },
    },
    kickoutBreakWon: {
      style: {
        width: 8,
        height: 8,
        backgroundColor: "#4ecdc4",
      },
    },
    kickoutOppBreak: {
      style: {
        width: 8,
        height: 8,
        backgroundColor: "#ffcb77",
      },
    },
    kickOppCatch: {
      style: {
        width: 8,
        height: 8,
        backgroundColor: "#FE4F3F",
      },
    },
    kickoutOut: {
      style: {
        width: 8,
        height: 8,
        backgroundColor: "#fff",
      },
    },
    goal: {
      style: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: "#00a8e8",
      },
    },
    kickoutWon: {
      style: {
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: "#FE4F3F",
        backgroundColor: "#101010",
      },
    },
  };
  //!this is for handling scroll to page events
  const scrollViewRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;
  const pageHeight = screenHeight * 0.85; // 85vh of the screen height

  // const handleScrollEnd = (event) => {
  //   const contentOffsetY = event.nativeEvent.contentOffset.y;
  //   const pageThreshold = 0.25; // Adjust this value to make scrolling less sensitive
  //   const index = Math.round(
  //     (contentOffsetY + pageHeight * pageThreshold) / pageHeight
  //   );
  //   const y = index * pageHeight;

  //   scrollViewRef.current.scrollTo({ y, animated: true });
  // };
  console.log("===========Boyaka==============");

  const filteredPositions = gameData.positions.filter(
    (position) => position.actionCategory === "shot"
  );
  const actionCounts = filteredPositions.reduce((acc, position) => {
    acc[position.action] = (acc[position.action] || 0) + 1;
    return acc;
  }, {});
  const shotTimes = filteredPositions.reduce((acc, position) => {
    if (["point", "goal", "freeScore"].includes(position.action)) {
      acc.push({ action: position.action, time: position.time });
    }
    return acc;
  }, []);
  console.log(gameData.gameName);
  console.log(filteredPositions);
  console.log("====================================");
  // Print out the totals of each action
  console.log(actionCounts);
  console.log("====================================");
  console.log(shotTimes);
  console.log("====================================");
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

  console.log(JSON.stringify(scoreTimingsData, null, 2));
  const actions = ["Free", "45", "Mark"];

  const totalAttempts =
    (actionCounts.freeScore || 0) +
    (actionCounts.goal || 0) +
    (actionCounts.point || 0) +
    (actionCounts.miss || 0) +
    (actionCounts.short || 0);

  const successfulAttempts =
    (actionCounts.freeScore || 0) +
    (actionCounts.goal || 0) +
    (actionCounts.point || 0);
  console.log("========total attempts=================");
  console.log(totalAttempts);
  console.log("========successfull====================");
  console.log(successfulAttempts);
  const shotPercentage = (successfulAttempts / totalAttempts) * 100;

  // Define the labels in the order you want them to appear
  const labels = ["Points", "Wides", "Goals", "Short", "Free"];
  // Create a mapping from action types to these labels
  const actionMap = {
    point: "Points",
    miss: "Wides",
    goal: "Goals",
    short: "Short",
    freeScore: "Free",
  };
  // Populate the data array in the order of labels
  const data = labels.map((label) => {
    // Find the action key that maps to the current label
    const actionKey = Object.keys(actionMap).find(
      (key) => actionMap[key] === label
    );
    return actionCounts[actionKey] || 0;
  });
  const shotsData = {
    labels: labels,
    datasets: [
      {
        data: data,
      },
    ],
  };

  const setPlayData1 = {
    labels: ["Free", "45", "Mark"],
    legend: ["Score", "Miss"],
    data: ["free", "45", "mark"].map((action) => {
      const scores = filteredPositions.filter(
        (position) =>
          position.action.toLowerCase() === `${action.toLowerCase()}score`
      ).length;
      const misses = filteredPositions.filter(
        (position) =>
          position.action.toLowerCase() === `${action.toLowerCase()}miss`
      ).length;
      return [scores, misses];
    }),
    barColors: ["#FE4F3F80", "#242424"],
  };
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

  // Log the setPlayData1 object for debugging
  console.log("=doc is pedo below===================");

  console.log(JSON.stringify(setPlayData1, null, 2));

  const setplayData = {
    labels: ["Free", "45", "Mark"],
    legend: ["Score", "Miss"],
    data: [
      [3, 2],
      [4, 7],
      [5, 3],
    ],
    barColors: ["#FE4F3F", "#242424"],
  };
  const barData = {
    labels: ["Blues", "Cooley", "Joes"], // optional
    data: [0.4, 0.6, 0.3],
  };
  const barChartConfig = {
    backgroundGradientFrom: "#000",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#000",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const setplayChartConfig = {
    backgroundColor: "#000",

    backgroundGradientFrom: "#000",
    backgroundGradientTo: "#000",

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
    backgroundColor: "#000",
    backgroundGradientFrom: "#000",
    backgroundGradientTo: "#000",

    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "0",
      strokeWidth: "0",
      stroke: "#000",
    },
    fillShadowGradient: "#ff6347", // Bar color
    fillShadowGradientOpacity: 1, // Ensure the gradient is solid
    fillShadowGradientTo: "#ff6347", // Make sure the gradient goes to the same color
    barRadius: 8,
  };
  const PitchComponent = ({ positions }) => {
    const mappedActions = useMemo(() => {
      return positions.map((position, index) => {
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
          return (
            <View
              key={index}
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
    }, [positions]);

    return (
      <View className="bg-[#101010] rounded-lg  h-[63vh]">
        <View className="h-full">
          {/* Pitch markings */}
          <View style={styles.pitchMarkings}>
            <View style={[styles.line, { top: "10%" }]}></View>
            {/* <View style={styles.centerCircle}></View> */}
            <View className="w-[30%] left-[35%] h-14 rounded-b-full  border border-zinc-600 top-[15.5%]"></View>
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
    );
  };

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
      <View className="bg-[#101010] rounded-md  w-full items-center ">
        {/* <TouchableOpacity
          onPress={() => setShowShotData(!showShotData)}
          className="w-64 bg-[#101010] items-center p-2 rounded-lg flex-row"
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
            className="mx-5 bg-[#101010] w-auto mx-auto  items-center  p-2 rounded-md flex-row"
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
            className="mx-5 bg-[#101010] w-auto mx-auto  items-center  p-2 rounded-md flex-row"
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
      <View className="bg-[#101010] rounded-md p-4 w-[90%] items-center mt-5">
        <TouchableOpacity
          onPress={() => setShowShotData(!showShotData)}
          className="w-64 bg-[#101010] items-center p-2 rounded-lg flex-row"
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
  const ShotChartComponent = () => {
    return (
      <View
        style={{
          width: "90%",
          backgroundColor: "#000",
          // paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",

          marginHorizontal: "auto",
          // marginTop: 20,

          borderRadius: 16,
        }}
        className="h-[25vh]"
      >
        {/* <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 18,
            marginTop: 7,
            marginBottom: 7,
            fontWeight: "bold",
          }}
        >
          Shots
        </Text> */}
        <BarChart
          style={{ marginVertical: 0, borderRadius: 16, marginRight: 0 }}
          data={shotsData}
          withInnerLines={false} // Add this line
          width={Dimensions.get("window").width * 0.9}
          height={200}
          yAxisLabel=""
          verticalLabelRotation={0}
          chartConfig={chartConfig}
          fromZero
        />
        {/* <ChartDataDropdown2 shotsData={shotsData} title="Shot Data" /> */}
      </View>
    );
  };
  function ShotPercentageComponent() {
    return (
      <View className="w-[90%] bg-[#000] p-4 rounded-lg  mx-auto h-auto ">
        <View className=" ">
          <View className="h-auto  justify-center">
            <Text className="text-white text-lg font-semibold text-center mb-2">
              Shot Percentage
            </Text>
            <View className="h-6 w-[70%] flex-row  mx-auto rounded-lg">
              <View
                style={{
                  width: `${Math.round(shotPercentage)}%`,
                  height: "100%",
                  backgroundColor: "#fe4f3f86",
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
        <View className="w-[90%] bg-[#000] mx-auto h-auto mt-5 rounded-t-xl">
          <Hr />
          <Text className="text-white mx-auto mt-5 text-lg font-semibold tracking-wider">
            Score Timings
          </Text>
        </View>
        <View className="bg-[#000] w-[90%] mx-auto">
          <LineChart
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
              backgroundColor: "#000",
              backgroundGradientFrom: "#000",
              backgroundGradientTo: "#000",
              fillShadowGradient: "rgba(254, 79, 63, 1)", // Color of the graph area
              fillShadowGradientTo: "rgba(246, 116, 76, 1)", // Bottom gradient color
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
        </View>
        {/* <View className="flex-row pb-2 bg-[#000]  rounded-b-lg w-[90%] justify-between items-center  space-x-2 mx-auto ">
          <TouchableOpacity
            onPress={() => setShowTimingsData(!showTimingsData)}
            className="mx-5 bg-[#000] w-auto mx-auto  items-center  p-2 rounded-md flex-row"
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
            className="mx-5 bg-[#000] w-auto mx-auto  items-center  p-2 rounded-md flex-row"
          >
            <Text className="text-white text-center mx-auto"></Text>
            <View className="p-2 rounded-md">
              <Text className="text-white text-center my-auto font-bold text-md">
                Pitch View
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}

        <View className=" w-[90%] bg-[#000] mx-auto">
          {showTimingsData && (
            <View className="mx-auto items-center justify-center my-auto w-[90%]">
              <View className="w-full bg-[#000] p-4 rounded-lg ">
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
        <Hr />
      </>
    );
  };

  function SetPlayChartComponent() {
    return (
      <View className=" w-[90%] h-[29vh] mt-2 mx-auto justify-center rounded-xl bg-[#000]  text-center items-center">
        {/* <Text className="text-white text-lg font-semibold mx-auto mt-2">
          Set Play Stats
        </Text> */}
        <StackedBarChart
          className="mx-auto "
          data={setPlayData1}
          width={Dimensions.get("window").width * 0.9}
          height={220}
          chartConfig={setplayChartConfig}
          style={{
            marginVertical: 0,
            borderRadius: 20,
          }}
        />
        {/* <ChartDropdown2 dropDownData={setPlayData1} title="Set Play Data" /> */}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
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
          {/* <View className="flex-row h-[5vh]  justify-start   space-x-7 mx-auto items-center w-[90%]">
            <View className="flex-1 h-full flex-row space-x-2 items-center">
              <TouchableOpacity className="bg-[#101010] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto">
                <FontAwesomeIcon
                  icon={faShare}
                  size={15}
                  color="#fff"
                  className="my-auto justify-center"
                />
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#101010] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto">
                <FontAwesomeIcon
                  icon={faSliders}
                  size={15}
                  color="#fff"
                  className="my-auto justify-center"
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center">
              <View className="text-center">
                <Text className="text-white text-center text-xl font-semibold">
                  {gameData.gameName}
                </Text>
              </View>
            </View>
            <View className="flex-1 h-full flex-row space-x-2 items-center">
              <TouchableOpacity className="bg-[#101010] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto">
                <FontAwesomeIcon
                  icon={faDownload}
                  size={15}
                  color="#fff"
                  className="my-auto justify-center"
                />
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#101010] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto">
                <FontAwesomeIcon
                  icon={faInfo}
                  size={15}
                  color="#fff"
                  className="my-auto justify-center"
                />
              </TouchableOpacity>
            </View>
          </View> */}
          <Text className="text-white text-lg text-center">
            Shots vs {gameData.gameName}
          </Text>
          <View className="legend h-[3vh] px-4  items-center w-full  flex-row">
            <View className="bg-white mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Score</Text>
            <View className="bg-red-400 mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Miss</Text>
            <View className="bg-yellow-200 mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Short</Text>
            <View className="bg-blue-200 mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Goal</Text>
            <View className="bg-purple-200 mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Free</Text>
          </View>
          <PitchComponent positions={filteredPositions || []} />
          <Text className="text-white mt-5 text-lg text-center">Breakdown</Text>
          <ShotChartComponent />
        </View>
        <View id="page2" className="w-[90%] mx-auto h-auto justify-center">
          <Text className="text-white mt-5 text-lg text-center">
            Set Plays Breakdown
          </Text>
          <View className="legend h-[3vh] px-4  items-center w-full  flex-row">
            <View className="bg-white mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Score</Text>
            <View className="bg-red-400 mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Miss</Text>
            <View className="bg-yellow-200 mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Short</Text>
            <View className="bg-blue-200 mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Goal</Text>
            <View className="bg-purple-200 mr-1 h-2 w-2 rounded-full"></View>
            <Text className="text-zinc-400 pr-5">Free</Text>
          </View>

          <PitchComponent positions={setPlayFilteredPositions || []} />

          <Text className="text-white mt-5 text-lg text-center">Breakdown</Text>
          <SetPlayChartComponent />
        </View>
        <ScoresTimingsComponent />
        <ShotPercentageComponent />
        <Hr />
        <View className="bg-[#000] rounded-lg w-[90%] mx-auto items-center">
          <Text className="text-white text-lg font-semibold text-center my-2 mt-5">
            Last 3 games %
          </Text>
          <ProgressChart
            className="mx-auto"
            data={barData}
            width={Dimensions.get("window").width - 50}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={barChartConfig}
            hideLegend={false}
          />
        </View>
      </ScrollView>
      <View
        id="top-navigation"
        className="w-full bg-[#101010b2] h-[8vh] relative justify-center items-center rounded-t-3xl"
        style={{ zIndex: 1, position: "absolute", bottom: 10 }}
      >
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("HomeDashboard")}
          className="bg-[#101010] p-2  justify-center rounded-lg absolute left-5 "
        >
          <FontAwesomeIcon icon={faChevronLeft} size={25} color="#FE4F3F" />
        </TouchableOpacity> */}
        <View className="flex-row ">
          <TouchableOpacity className="p-4 flex">
            <Text className="text-zinc-400">Kickouts</Text>
            <View className="w-1 h-1 rounded-full bg-zinc-400 mx-auto"></View>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 mt-2">
            <Text className="text-white text-lg">Shots</Text>
            <View className="w-2 h-2 rounded-full bg-[#FE4F3F] mx-auto"></View>
          </TouchableOpacity>
          <TouchableOpacity className="p-4">
            <Text className="text-zinc-400">Turnovers</Text>
            <View className="w-1 h-1 rounded-full bg-zinc-400 mx-auto"></View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
    backgroundColor: "#101010",
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
  xMarkerLoss: {
    color: "#FD5F5F",
    fontSize: 12,
    fontWeight: "bold",
  },
  xMarkerWon: {
    color: "#80ed99",
    fontSize: 12,
    fontWeight: "bold",
  },
});
