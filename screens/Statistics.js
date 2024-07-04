import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { WebView } from "react-native-webview";
import { faHeart, faEye, faCloud } from "@fortawesome/free-solid-svg-icons";
import {
  BarChart,
  LineChart,
  StackedBarChart,
  ProgressChart,
} from "react-native-chart-kit";
export default function App() {
  //!usestates
  const [showShotData, setShowShotData] = useState(false);
  const testData = [
    {
      id: "1",
      col1: "point",
      col2: "8",
      col3: "15",
      // col4: "",
    },
    {
      id: "2",
      col1: "point",
      col2: "8",
      col3: "15",
      // col4: "",
    },
  ];
  const navigation = useNavigation();
  const data = {
    labels: ["Scores", "Misses", "Short"],
    datasets: [
      {
        data: [8, 6, 3],
      },
    ],
  };
  const barData = {
    labels: ["Blues", "Cooley", "Joes"], // optional
    data: [0.4, 0.6, 0.3],
  };
  const shotsData = {
    labels: ["Points", "Wides", "Goals", "Short", "dwlknd"],
    datasets: [
      {
        data: [8, 6, 2, 3, 4],
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
  const timingsChartConfig = {
    backgroundColor: "#101010",
    backgroundGradientFrom: "#101010",
    backgroundGradientTo: "#101010",
    fillShadowGradientTo: "#ff6347",
    fillShadowGradientOpacity: 1,
    fillShadowGradient: "#ff6347", // Bar color
    fillShadowGradientOpacity: 1, // Ensure the gradient is solid
    fillShadowGradientTo: "#ff6347", // Make sure the gradient goes to the same color
    barRadius: 8, // This property makes the bars rounded
    yLabelsOffset: 200, // Adjust to reduce space without hiding labels
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(16, 16, 16, ${opacity})`, // color of axis and labels
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
    yAxisMin: 1, // set minimum y-axis value
    yAxisMax: 5, // set maximum y-axis value
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
        <View className="bg-[#000] rounded-md p-4 w-[90%] items-center mt-5">
          <View className="w-full bg-[#101010] items-center p-2 rounded-lg flex-row">
            <Text className="text-white text-center mx-auto">Shot Data</Text>
            <TouchableOpacity
              onPress={() => setShowShotData(!showShotData)}
              className="l-5 bg-white/10 w-7 h-7 rounded-full"
            >
              <Text className="text-white text-center my-auto font-bold text-md">
                {!showShotData ? "+" : "-"}
              </Text>
            </TouchableOpacity>
          </View>
          {showShotData && (
            <View className="w-full mt-3">
              <View className="flex flex-row px-2 justify-between border-b border-gray-700 pb-2">
                <Text className="text-white w-1/4">Shot</Text>
                <Text className="text-white w-1/4">Player</Text>
                <Text className="text-white w-1/4">Mins</Text>
                {/* <Text className="text-white w-1/4">Header 4</Text> */}
              </View>
              {testData.map((item, index) => (
                <View
                  key={item.id}
                  className={`flex flex-row justify-between rounded-lg px-2 py-1 ${
                    index % 2 === 1 ? "bg-[#1011010]" : ""
                  }`}
                >
                  <Text className="text-white w-1/4">{item.col1}</Text>
                  <Text className="text-white w-1/4">{item.col2}</Text>
                  <Text className="text-white w-1/4">{item.col3}</Text>
                  {/* <Text className="text-white w-1/4">{item.col4}</Text> */}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }
  function ShotPercentageComponent() {
    return (
      <View className="w-[90%] mx-auto mt-2 bg-[#000] h-auto mt-5 rounded-xl ">
        <View className=" h-1/5">
          <Text className="text-white mx-auto mt-2 text-lg font-semibold tracking-wider">
            Shot %
          </Text>
        </View>
        {/* <View className="h-4/5 justify-center">
          <View className="h-6 w-[70%] flex-row bg-red-600 mx-auto rounded-lg">
            <View className="w-2/3 h-full bg-[#FE4F3F] rounded-l-lg"></View>
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
        </View> */}
      </View>
    );
  }
  function PlayerScoresComponent() {
    return (
      <View className="w-[90%] mx-auto mt-2 bg-[#000] h-[20vh] mt-5 rounded-xl ">
        <View className=" h-1/5">
          <Text className="text-white mx-auto mt-2 text-lg font-semibold tracking-wider">
            Top Scorers
          </Text>
        </View>
        <View className="h-4/5"></View>
      </View>
    );
  }
  function ScoresTimingsComponent() {
    return (
      <>
        <View className="w-[90%] mx-auto  h-auto mt-5  rounded-xl ">
          <Text className="text-white mx-auto mt-2 text-lg font-semibold tracking-wider">
            Score Timings
          </Text>
        </View>
        {/* <PlayerScoresComponent /> */}
        <LineChart
          data={{
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [
              {
                data: [3, 4, 2, 6], // dataset
              },
              {
                data: [1], // min
              },
              {
                data: [10], // max
              },
            ],
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
      </>
    );
  }
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
        <View className="flex-row">
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
        {/* <ShotPercentageComponent /> */}
        <View>
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
        <View className=" items-center">
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
