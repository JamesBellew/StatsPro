import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import { captureRef } from "react-native-view-shot";
import React, { useRef, useState } from "react";

// npx expo install react-native-view-shot

export default function App() {
  const viewToSnapshotRef = useRef();
  const [snapshotImg, setSnapshotImg] = useState(null);

  const snapshot = async () => {
    try {
      const result = await captureRef(viewToSnapshotRef, {
        result: "data-uri",
      });
      console.log(result); // This logs the Base64-encoded image string to the console
      setSnapshotImg(result); // Save the Base64 image string to state for rendering
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View ref={viewToSnapshotRef} style={styles.snapshot}>
        <Text>Contact Details boiiiiii</Text>
        <Text>Names: James Smith</Text>
        <Text>Phone: 555-5555</Text>
      </View>
      <Button title="Take Snapshot" onPress={snapshot} />
      {snapshotImg && <Text>Snapshot Preview:</Text>}
      {snapshotImg && (
        <Image
          resizeMode="contain"
          style={styles.snapshotImg}
          source={{ uri: snapshotImg }} // Display the captured screenshot
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  snapshot: {
    borderColor: "#000000",
    borderWidth: 2,
    backgroundColor: "#00ffff",
    margin: 16,
    padding: 16,
  },
  snapshotImg: {
    width: 400,
    height: 200,
    margin: 16,
  },
});
