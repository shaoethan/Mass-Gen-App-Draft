import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { db } from "../firebaseConfig";

let time = 0;
let allData = [];
let unsub = null;
let paused = true;

export default function RecordScreen() {
  const { subject, treatment, activity } = useLocalSearchParams();
  const router = useRouter();

  useKeepAwake();
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isRecording, setIsRecording] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const interval = 10;

  // Clear/reset all data and state on screen load
  useEffect(() => {
    time = 0;
    allData = [];
    paused = true;
    setData({ x: 0, y: 0, z: 0 });
    setHasData(false);
    setReportSent(false);
    setIsRecording(false);

    if (unsub) {
      unsub.remove();
      unsub = null;
    }
  }, []);

  function start() {
    if (!paused) return;
    paused = false;
    setIsRecording(true);
    Accelerometer.setUpdateInterval(interval);
    unsub = Accelerometer.addListener((data) => {
      setData(data);
      data["time"] = time;
      allData.push(data);
      time += interval;
      if (allData.length === 1) setHasData(true);
    });
  }

  function stop() {
    if (unsub) {
      unsub.remove();
      unsub = null;
    }
    paused = true;
    setIsRecording(false);
  }

  function clear() {
    time = 0;
    allData = [];
    setData({ x: 0, y: 0, z: 0 });
    setHasData(false);
    setReportSent(false);
  }

  async function reportData() {
    if (allData.length === 0 || !subject) {
      Alert.alert("Error", "No data to report.");
      return;
    }

    const now = new Date();
    const docName = now.toString();

    try {
      const path = `${treatment}/${subject}/${activity}/${docName}`;
      const targetDoc = doc(db, path);
      await setDoc(targetDoc, {
        activity,
        acceleration: allData,
        timestamp: serverTimestamp(),
      });

      Alert.alert("Success", "Data reported to Firebase.");
      setReportSent(true);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to report data.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recording Screen</Text>
      <Text>Subject: {subject}</Text>
      <Text>Treatment: {treatment}</Text>
      <Text>Activity: {activity}</Text>

      <Text style={styles.acc}>
        x: {x.toFixed(2)} | y: {y.toFixed(2)} | z: {z.toFixed(2)}
      </Text>
      <Text>Recording time: {time}ms</Text>

      <View style={styles.btnRow}>
        <Button
          title="Start Recording"
          onPress={start}
          color={isRecording ? "#ccc" : "blue"}
          disabled={isRecording}
        />
        <Button
          title="Stop Recording"
          onPress={stop}
          color={isRecording ? "red" : "#ccc"}
          disabled={!isRecording}
        />
      </View>

      <Button
        title="Clear Data"
        onPress={clear}
        color={hasData ? "blue" : "#ccc"}
        disabled={!hasData}
      />

      {hasData && (
        <Button
          title="Report to Firebase"
          onPress={reportData}
          color={reportSent ? "#ccc" : "orange"}
          disabled={reportSent || isRecording}
        />
      )}

      {reportSent && (
        <View style={styles.btnRow}>
          <Button
            title="Continue to Graph"
            onPress={() => router.push("/graphmodel")}
            color="blue"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  acc: {
    fontSize: 16,
    marginVertical: 10,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});
