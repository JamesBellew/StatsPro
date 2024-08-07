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
import {
  faFutbol,
  faInfo,
  faShare,
  faChevronDown,
  faChevronLeft,
  faSliders,
  faDownload,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
export default function App() {
  const navigation = useNavigation();
  //!usestates
  const [showShotData, setShowShotData] = useState(false);
  const [showTimingsData, setShowTimingsData] = useState(false);
  const [showGameDetailsMenu, setShowGameDetailsMenu] = useState(false);
  const route = useRoute();
  const { gameData } = route.params; // Access the passed parameters
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
  };
  //!this is for handling scroll to page events
  const scrollViewRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;
  const pageHeight = screenHeight * 0.85; // 85vh of the screen height

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
    barColors: ["#0b63fb80", "#242424"],
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
      <View className=" w-full h-[35vh] border-gray-400 border-1 rounded-2xl overflow-hidden">
        <View className="bg-[#191A22]  rounded-3xl  h-[63vh]">
          <View className="h-full">
            {/* Pitch markings */}
            <View style={styles.pitchMarkings}>
              <View className="w-[15%] absolute left-[42.5%] h-6 border border-b-zinc-600 border-l-zinc-600 border-r-zinc-600"></View>
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
  const ShotChartComponent = () => {
    return (
      <View
        style={{
          width: "90%",
          backgroundColor: "#12131A",
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
          <Text className="text-white  text-center mt-5 text-xl font-semibold tracking-wider">
            Score Timings
          </Text>
        </View>
        <View className="bg-[#12131A] w-[90%] mx-auto">
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

  function SetPlayChartComponent() {
    return (
      <View className=" w-[90%] h-[29vh] mt-2 mx-auto justify-center rounded-xl bg-[#12131A]  text-center items-center">
        {/* <Text className="text-white text-lg font-semibold mx-auto mt-2">
          Set Play Stats
        </Text> */}
        <StackedBarChart
          className="mx-auto "
          data={setPlayData1}
          width={Dimensions.get("window").width * 0.9}
          height={220}
          renderBarLabel={renderBarLabel}
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
    <>
      {showGameDetailsMenu && (
        <View className="h-full absolute w-full  z-40">
          <TouchableOpacity
            onPress={() => setShowGameDetailsMenu(false)}
            className="flex-1  w-full z-40 "
          ></TouchableOpacity>
          <View className="bg-gray-300 items-center justify-center w-full h-auto z-50 rounded-3xl">
            {/* <TouchableOpacity
              onPress={() => setShowGameDetailsMenu(false)}
              className="bg-[#191A22]  absolute top-20  w-10 h-10 justify-center items-center rounded-lg  left-10"
            >
              <FontAwesomeIcon icon={faChevronLeft} size={25} color="#fff" />
            </TouchableOpacity> */}
            <View className=" justify-center mx-auto w-[95%] mx-10 relative">
              <View className=" w-[95%] mx-auto flex-row h-auto">
                <View className="w-1/2 h-full ">
                  <Text className="text-xl mx-10 mt-10 font-bold text-gray-800 ">
                    Game Details
                  </Text>
                  <Text className="text-xl mx-10  capitalize  text-gray-500 ">
                    {gameData.timestamp}
                  </Text>
                  <Text className="text-3xl mx-10 font-bold capitalize mt-3 text-[#191A22] ">
                    {gameData.gameName} {gameData.venue}
                  </Text>
                </View>
                <View className="w-1/2 h-full items-end ">
                  <Text className="text-xl mx-10 mt-10 font-bold text-gray-800 ">
                    Score
                  </Text>
                  <Text className="text-xl mx-10    text-gray-500 ">FT</Text>
                  {/* <Text className="text-md mx-10 font-semibold capitalize mt-3 text-[#191A22] ">
                {gameData.timestamp}
              </Text> */}
                  <Text className="text-3xl mx-10 font-bold capitalize mt-3 text-[#348364] ">
                    2:10 - 3:09
                  </Text>
                </View>
              </View>

              <View className="justify-center mx-auto w-full  items-center">
                <TouchableOpacity className="p-4 bg-[#050F01] w-[90%] items-center  rounded-3xl mt-16">
                  <Text className="font-bold text-white text-md px-4">
                    Share to WhatsApp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4 mb-10 bg-gray-300 w-[90%] items-center  rounded-lg mt-4">
                  <Text className="font-bold text-md px-4">Download Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      <SafeAreaView className="flex-1 bg-[#12131A]">
        <ScrollView
          ref={scrollViewRef}
          style={{ marginBottom: 60 }}
          // onScrollEndDrag={handleScrollEnd}
          scrollEventThrottle={16}
          // className="bg-red-600"
        >
          <View
            id="page1"
            className="h-auto w-[90%] mx-auto  justify-center my-auto "
          >
            <View className="flex-row h-[5vh] my-5  justify-start   space-x-7 mx-auto items-center w-[90%]">
              <View className="flex-1 h-full flex-row space-x-2 items-center">
                <TouchableOpacity
                  onPress={() => navigation.navigate("HomeDashboard")}
                  className="bg-[#191A22] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto"
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={15}
                    color="#fff"
                    className="my-auto justify-center"
                  />
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#191A22] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto">
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
                  <Text className="text-white text-center text-2xl font-semibold">
                    {gameData.gameName}
                  </Text>
                </View>
              </View>
              <View className="flex-1 h-full flex-row space-x-2 items-center">
                <TouchableOpacity
                  onPress={createPDF}
                  className="bg-[#191A22] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto"
                >
                  <FontAwesomeIcon
                    icon={faDownload}
                    size={15}
                    color="#fff"
                    className="my-auto justify-center"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowGameDetailsMenu(true)}
                  className="bg-[#191A22] h-auto text-center items-center p-3 rounded-xl w-2/5 mx-auto"
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
            {/* <Text className="text-xl text-white text-center mb-5 mt-2">
            Stats for game vs {gameData.gameName}
          </Text> */}
            <Text className="text-white text-2xl font-bold  ml-3">
              We in the Testing
            </Text>
            <View className="legend h-[3vh] mb-4 px-4  items-center w-full  flex-row">
              <View className="bg-[#0b63fb] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 pr-2 text-lg">Score</Text>
              <View className="bg-[#ef233c] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 pr-2 text-lg">Miss</Text>
              {/* <View className="bg-[#fb8500] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 text-lg pr-2">Short</Text>
              <View className="bg-[#4361ee] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 text-lg pr-2">Goal</Text>
              <View className="bg-[#52b788] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 text-lg pr-2">Free</Text> */}
            </View>
            <PitchComponent positions={filteredPositions || []} />
            {/* <Text className="text-white mt-5 text-lg ml-3">Breakdown</Text> */}
            <ShotChartComponent />
          </View>
          <Hr></Hr>
          <View id="page2" className="w-[90%] mx-auto h-auto justify-center">
            <Text className="text-white mt-5 text-2xl font-bold ml-3 ">
              Set Plays Breakdown
            </Text>
            <View className="legend h-[3vh] mb-4 px-4  items-center w-full  flex-row">
              <View className="bg-[#52b788] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 pr-2 text-lg">Score</Text>
              <View className="bg-[#ef233c] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 pr-2 text-lg">Miss</Text>
              <View className="bg-[#ef233c] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 pr-2 text-lg">Short</Text>
              <View className="bg-[#52b788] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 pr-2 text-lg">Goal</Text>
              <View className="bg-[#52b788] mr-1 h-2 w-2 rounded-full"></View>
              <Text className="text-zinc-400 pr-2 text-lg">Free</Text>
            </View>

            <PitchComponent positions={setPlayFilteredPositions || []} />

            {/* <Text className="text-white mt-5 text-lg ml-3">Breakdown</Text> */}
            <SetPlayChartComponent />
          </View>
          <ScoresTimingsComponent />
          <ShotPercentageComponent />
          {/* <Hr /> */}
          <View className="bg-[#12131A] my-5  rounded-lg w-[90%] mx-auto items-center">
            <Text className="text-white text-xl font-semibold text-center my-2 mt-5">
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
          {/* <TouchableOpacity
          onPress={() => navigation.navigate("HomeDashboard")}
          className="bg-[#191A22] p-2  justify-center rounded-lg absolute left-5 "
        >
          <FontAwesomeIcon icon={faChevronLeft} size={25} color="#0b63fb" />
        </TouchableOpacity> */}
          <View className="flex-row ">
            <TouchableOpacity className="p-4 flex">
              <Text className="text-zinc-400">Kickouts</Text>
              <View className="w-1 h-1 rounded-full bg-zinc-400 mx-auto"></View>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 mt-2">
              <Text className="text-white text-lg">Shots</Text>
              <View className="w-2 h-2 rounded-full bg-[#0b63fb] mx-auto"></View>
            </TouchableOpacity>
            <TouchableOpacity className="p-4">
              <Text className="text-zinc-400">Turnovers</Text>
              <View className="w-1 h-1 rounded-full bg-zinc-400 mx-auto"></View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
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
