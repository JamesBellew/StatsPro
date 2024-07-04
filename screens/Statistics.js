import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import { BarChart, LineChart, StackedBarChart } from "react-native-chart-kit";
export default function App() {
  const data = {
    labels: ["Scores", "Misses", "Short"],
    datasets: [
      {
        data: [8, 6, 3],
      },
    ],
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
      [3, 7],
      [5, 3],
    ],
    barColors: ["#FE4F3F", "#242424"],
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
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid lines instead of dashed
      stroke: "transparent", // effectively remove the lines
    },
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
      <View className="w-[90%] bg-[#000] items-center justify-center mx-auto mt-5  h-[25vh]  rounded-xl ">
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
            paddingLeft: 0,
            // marginLeft: -50,
          }}
          fromZero
          width={Dimensions.get("window").width * 0.9} // Ensure it takes 100% of the parent View's width
        />
      </View>
    );
  }
  function ShotPercentageComponent() {
    return (
      <View className="w-[90%] mx-auto mt-2 bg-[#000] h-[16vh] mt-5 rounded-xl ">
        <View className=" h-1/5">
          <Text className="text-white mx-auto mt-2 text-lg font-semibold tracking-wider">
            Shot %
          </Text>
        </View>
        <View className="h-4/5 justify-center">
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
        </View>
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
          width={Dimensions.get("window").width * 1} // from react-native
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
      <View className=" mx-auto">
        <Text className="text-white text-lg font-semibold mx-auto mt-5">
          Set Play Stats
        </Text>
        <StackedBarChart
          className
          data={setplayData}
          width={Dimensions.get("window").width * 0.8}
          height={220}
          chartConfig={setplayChartConfig}
          style={{
            marginVertical: 8,
            borderRadius: 16,
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
        <ShotPercentageComponent />
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
