import { useRouter } from "expo-router";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Accelerometer Data Collection</Text>
        <Text style={styles.subtitle}>
          Follow the steps to record and report accelerometer data.
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="Get Started" onPress={() => router.push("/subject")} />
        </View>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
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
  },
  buttonContainer: {
    width: "60%",
  },
});
