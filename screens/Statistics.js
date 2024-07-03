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
import { BarChart } from "react-native-chart-kit";
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
    labels: ["Points", "Wides", "Goals", "Short"],
    datasets: [
      {
        data: [8, 6, 2, 3],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#101010",
    backgroundGradientFrom: "#101010",
    backgroundGradientTo: "#101010",
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
      <View className="w-[90%] mx-auto mt-5 bg-[#101010] h-[55vh] rounded-xl "></View>
    );
  }

  function ShotChartComponent() {
    return (
      <View className="w-[90%] mx-auto mt-2 bg-[#101010] h-[25vh] mt-5 rounded-xl ">
        {/* <View className=" h-1/5">
          <Text className="text-white mx-auto mt-2 text-lg font-semibold tracking-wider">
            Shots
          </Text>
        </View> */}
        <View className="h-4/5 justify-start items-start">
          <BarChart
            className="items-start justify-start"
            data={shotsData}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            style={{ borderRadius: 16, width: "100%" }}
            fromZero
            width={Dimensions.get("window").width * 0.9} // Ensure it takes 100% of the parent View's width
          />
        </View>
      </View>
    );
  }
  function ShotPercentageComponent() {
    return (
      <View className="w-[90%] mx-auto mt-2 bg-[#101010] h-[16vh] mt-5 rounded-xl ">
        <View className=" h-1/5">
          <Text className="text-white mx-auto mt-2 text-lg font-semibold tracking-wider">
            Shot %
          </Text>
        </View>
        <View className="h-4/5 justify-center">
          <View className="h-6 w-[70%] flex-row bg-red-600 mx-auto rounded-lg">
            <View className="w-2/3 h-full bg-[#FE4F3F] rounded-l-lg"></View>
            <View className="w-1/3 h-full  bg-[#444444] rounded-r-lg"></View>
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
      <View className="w-[90%] mx-auto mt-2 bg-[#101010] h-[20vh] mt-5 rounded-xl ">
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
      <View className="w-[90%] mx-auto mt-2 bg-[#101010] h-[20vh] mt-5 rounded-xl ">
        <View className=" h-1/5">
          <Text className="text-white mx-auto mt-2 text-lg font-semibold tracking-wider">
            Timings
          </Text>
        </View>
        <View className="h-4/5"></View>
      </View>
    );
  }
  function SetPlayChartComponent() {
    return (
      <View className="w-[90%] mx-auto mt-2 mb-5  h-[20vh] mt-5 rounded-xl ">
        <View className=" h-1/5">
          <Text className="text-white mx-auto mt-2 text-lg font-semibold tracking-wider">
            Set Plays
          </Text>
        </View>
        <View className="h-4/5 mt-3 justify-center space-x-2 flex-row">
          <View className="w-[48%] bg-[#101010] h-full rounded-lg"></View>
          <View className="w-[48%] bg-[#101010] h-full rounded-lg"></View>
          {/* <View className="w-[30%] bg-[#101010] h-full rounded-lg"></View> */}
        </View>
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
        <PlayerScoresComponent />
        <ScoresTimingsComponent />
        <ShotPercentageComponent />
        <View className="bg-[#101010] w-[90%] mx-auto mt-5 rounded-lg">
          <Text className="text-white mx-auto text-lg font-semibold mt-2">
            Shot Chart
          </Text>
          <BarChart
            className="mx-auto mt-5"
            data={data}
            width={Dimensions.get("window").width - 50}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
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
