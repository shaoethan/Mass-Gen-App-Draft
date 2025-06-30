import LottieView from "lottie-react-native";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Instructions() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>How to Use ActiPain Tracker</Text>

        <Text style={styles.instruction}>
          <Text style={styles.boldNumber}>1. </Text>
          Press “Get Started” to begin data collection.
        </Text>
        <Text style={styles.instruction}>
          <Text style={styles.boldNumber}>2. </Text>
          Fill in the subject information: Your 5-digit ID, Before or After
          Treatment, Left Ankle or Right Wrist phone location, and select your activity.
        </Text>
        <Text style={styles.instruction}>
          <Text style={styles.boldNumber}>3. </Text>
          Secure your phone at your chosen location, then tap “Start Recording”.
        </Text>
        <Text style={styles.instruction}>
          <Text style={styles.boldNumber}>4. </Text>
          Perform the selected activity for at least 20 seconds. The timer will automatically stop at 30 seconds at which point you will hear a “ding!” sound.
        </Text>
        <Text style={styles.instruction}>
          <Text style={styles.boldNumber}>5. </Text>
          After completing the recording, tap "Report to Firebase" to securely
          store your data.
        </Text>

        <LottieView
          source={require("../assets/animations/walking.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250, alignSelf: "center", marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingTop: 60,
    maxWidth: 360,
    alignSelf: "center",
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  instruction: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: "left",
  },
  boldNumber: {
    fontWeight: "bold",
  },
});
