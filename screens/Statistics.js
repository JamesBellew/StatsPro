import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { BarChart, LineChart, StackedBarChart } from "react-native-chart-kit";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import {
  faPeopleGroup,
  faEye,
  faStopwatch,
  faChevronLeft,
  faFloppyDisk,
  faUser,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
export default function App() {
  const navigation = useNavigation();
  //!usestates
  const [showShotData, setShowShotData] = useState(false);
  const [showTimingsData, setShowTimingsData] = useState(false);
  const route = useRoute();
  const { gameData } = route.params; // Access the passed parameters

  console.log("====================================");
  console.log(gameData.positions[0].action);
  console.log(gameData.filter((data) => data.positions.action === "point"));
  console.log("====================================");
  console.log("====================================");
  const data = {
    labels: ["Scores", "Misses", "Short"],
    datasets: [
      {
        data: [8, 6, 3],
      },
    ],
  };
  const shotsData = {
    labels: ["Points", "Wides", "Goals", "Short"],
    datasets: [
      {
        data: [8, 6, 2, 3],
      },
    ],
  };
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
    decimalPlaces: 0,
  };
  const chartConfig = {
    backgroundColor: "#101010",
    backgroundGradientFrom: "#000",
    backgroundGradientTo: "#000",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // color of axis and labels
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // color of bar labels
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid lines instead of dashed
      stroke: "transparent", // effectively remove the lines
    },
    fillShadowGradient: "#ff6347", // Bar color
    fillShadowGradientOpacity: 1, // Ensure the gradient is solid
    fillShadowGradientTo: "#ff6347", // Make sure the gradient goes to the same color
    barRadius: 8, // This property makes the bars rounded
    yLabelsOffset: 200, // Adjust to reduce space without hiding labels
  };
  function PitchComponent() {
    return (
      <View className="w-[90%] mx-auto mt-5 bg-[#101010] h-[50vh] rounded-xl "></View>
    );
  }
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
      <View className="bg-[#000] rounded-md p-4 w-[90%] items-center mt-5">
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
        {showShotData && (
          <View className="w-full mt-3">
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
        )}
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
      <View className="bg-[#000] rounded-md p-4 w-[90%] items-center mt-5">
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
  function ShotChartComponent() {
    return (
      <View className="w-[90%] bg-[#000000] py-4 items-center justify-center mx-auto mt-5  h-[auto]  rounded-xl ">
        <Text className="text-white text-center text-lg font-semibold">
          Shots
        </Text>
        <BarChart
          className="mx-auto items-center"
          data={shotsData}
          height={200}
          yAxisLabel=""
          chartConfig={chartConfig}
          style={{
            borderRadius: 16,
            width: "100%",
            marginRight: 20,
            paddingLeft: -30,
            // marginLeft: -50,
          }}
          fromZero
          width={Dimensions.get("window").width * 0.8} // Ensure it takes 100% of the parent View's width
        />
        <ChartDataDropdown2 shotsData={shotsData} title="Shot Data" />
      </View>
    );
  }
  function ShotPercentageComponent() {
    return (
      <View className="w-[90%]  mx-auto h-auto ">
        <View className=" ">
          <View className="h-auto my-5 justify-center">
            <Text className="text-white text-lg font-semibold text-center mb-2">
              Shot %
            </Text>
            <View className="h-6 w-[70%] flex-row  mx-auto rounded-lg">
              <View className="w-2/3 h-full bg-[#fe4f3f86] rounded-l-lg"></View>
              <View className="w-1/3 h-full  bg-[#242424] rounded-r-lg"></View>
            </View>
            <View className="w-[70%] mx-auto mt-2  justify-between flex-row">
              <Text className="text-zinc-400">Scores</Text>
              <Text className="mx-auto text-white text-lg font-semibold">
                55%
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
    const scoreTimingsData = {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          data: [3, 4, 2, 6], // dataset
        },
      ],
    };

    return (
      <>
        <View className="w-[90%] mx-auto h-auto mt-5 rounded-xl">
          <Text className="text-white mx-auto mt-2 text-lg font-semibold tracking-wider">
            Score Timings
          </Text>
        </View>
        <LineChart
          data={{
            labels: scoreTimingsData.labels,
            datasets: scoreTimingsData.datasets.concat([
              { data: [1] }, // min
              { data: [10] }, // max
            ]),
          }}
          width={Dimensions.get("window").width * 1.1} // from react-native
          height={220}
          chartConfig={{
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
            backgroundColor: "#101010",
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
        <TouchableOpacity
          onPress={() => setShowTimingsData(!showTimingsData)}
          className="mx-5 bg-[#101010] w-64 mx-auto  items-center  p-2 rounded-lg flex-row"
        >
          <Text className="text-white text-center mx-auto">Timings Data</Text>
          <View className="l-5  w-7 h-7 rounded-full">
            <Text className="text-white text-center my-auto font-bold text-md">
              {!showTimingsData ? "+" : "-"}
            </Text>
          </View>
        </TouchableOpacity>
        <View className=" w-[90%] mx-auto">
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
      </>
    );
  };

  function SetPlayChartComponent() {
    return (
      <View className=" mx-auto text-center items-center">
        <Text className="text-white text-lg font-semibold mx-auto mt-5">
          Set Play Stats
        </Text>
        <StackedBarChart
          className="mx-auto ml-12"
          data={setplayData}
          width={Dimensions.get("window").width * 0.9}
          height={220}
          chartConfig={setplayChartConfig}
          style={{
            marginVertical: 8,
            borderRadius: 20,
          }}
        />
        <ChartDropdown2 dropDownData={setplayData} title="Set Play Data" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
      <View
        id="top-navigation"
        className="w-full bg-[#000000] justify-center items-center rounded-b-3xl"
        style={{ zIndex: 1, position: "absolute", top: 30 }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeDashboard")}
          className="bg-[#101010] p-2  rounded-lg absolute left-5 top-5"
        >
          <FontAwesomeIcon icon={faChevronLeft} size={25} color="#FE4F3F" />
        </TouchableOpacity>
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
      <ScrollView style={{ marginTop: 50 }}>
        <Text className="text-white text-xl font-semibold mx-auto">
          Clans Away
        </Text>
        <Text className="text-zinc-400 text-md font-normal mx-auto">
          12/06/24
        </Text>
        <PitchComponent />
        <ShotChartComponent />
        <SetPlayChartComponent />
        <ScoresTimingsComponent />
        <ShotPercentageComponent />
      </ScrollView>
    </SafeAreaView>
  );
}
