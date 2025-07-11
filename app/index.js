import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/images/redlogo.jpg")}
          style={styles.logo}
        />
        <Text style={styles.title}>ActiPain Tracker</Text>
        <Text style={styles.subtitle}>
          This app helps patients record movement data before and after
          treatment using their phone's sensors.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push("/subject")}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.instructionsLink}
            onPress={() => router.push("/instructions")}
          >
            <Text style={styles.instructionsText}>View Instructions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Bottom Privacy Link */}
      <View style={styles.privacyContainer}>
        <TouchableOpacity onPress={() => router.push("/privacy")}>
          <Text style={styles.privacyText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e1e1e",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    maxWidth: 350,
    alignSelf: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 30,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  buttonContainer: {
    width: "60%",
  },
  getStartedButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  getStartedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionsLink: {
    marginTop: 16,
    alignItems: "center",
  },
  instructionsText: {
    color: "#4f46e5",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  privacyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  privacyText: {
    color: "#4f46e5",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
