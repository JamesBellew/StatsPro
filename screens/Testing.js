import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

export default function App() {
  // Reference to the ScrollView that will be captured
  const scrollViewRef = useRef();

  const generatePdf = async () => {
    try {
      // Capture the entire content of the ScrollView
      const uri = await captureRef(scrollViewRef, {
        format: "png",
        quality: 1,
        // Set `result` to `data-uri` to handle larger content if needed
        snapshotContentContainer: true, // This ensures the full scrollable content is captured
      });

      // Convert the captured image into HTML content for the PDF
      const htmlContent = `
        <html>
          <body>
            <img src="${uri}" style="width: 100%; height: auto;" />
          </body>
        </html>
      `;

      // Generate PDF from the captured image
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      console.log("PDF generated at:", pdfUri);
      Alert.alert("PDF generated at:", pdfUri);

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ padding: 20 }}>
        <View
          className="h-80"
          style={{
            backgroundColor: "red",

            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "white" }}>This is a test</Text>
        </View>

        <View
          className="h-80"
          style={{ backgroundColor: "blue", padding: 20, marginBottom: 20 }}
        >
          <Text style={{ color: "yellow" }}>Another View</Text>
        </View>

        <View
          className="h-80"
          style={{ backgroundColor: "green", padding: 20, marginBottom: 20 }}
        >
          <Text style={{ color: "black" }}>Another View</Text>
        </View>

        <TouchableOpacity
          onPress={generatePdf}
          style={{ padding: 10, backgroundColor: "#007bff", borderRadius: 5 }}
        >
          <Text style={{ color: "#fff" }}>Generate PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
