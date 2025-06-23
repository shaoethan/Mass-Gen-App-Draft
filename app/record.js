import CheckBox from "expo-checkbox";
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import eventBus from "../eventbus";
import { db } from "../firebaseConfig";

let time = 0;
let allData = [];
let unsub = null;
let paused = true;

let skipReminderThisSession = false;

export default function RecordScreen() {
  const { subject, treatment, activity } = useLocalSearchParams();
  const router = useRouter();

  useKeepAwake();
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isRecording, setIsRecording] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const interval = 10;

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
    stop();
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
      eventBus.emit("activityReported", activity);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to report data.");
    }
  }

  function handleStartPress() {
    if (skipReminderThisSession) {
      start();
    } else {
      setShowReminder(true);
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
      <Text>Recording time: {(time / 1000).toFixed(1)}s</Text>

      <View style={styles.btnRow}>
        <Button
          title="Start Recording"
          onPress={handleStartPress}
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

      {/*{reportSent && (
        <View style={styles.btnRow}>
          <Button
            title="Continue to Graph"
            onPress={() => router.push("/graphmodel")}
            color="blue"
          />
        </View>
      )}*/}

      {/* Reminder Modal */}
      <Modal
        visible={showReminder}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReminder(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              📱 Please hold your phone in your right hand before starting the
              activity and make sure to record for at least 8 seconds.
            </Text>

            <View style={styles.checkboxContainer}>
              <CheckBox
                value={dontShowAgain}
                onValueChange={setDontShowAgain}
              />
              <Text style={styles.checkboxLabel}>Don't show this again</Text>
            </View>

            <Pressable
              style={styles.modalButton}
              onPress={() => {
                if (dontShowAgain) {
                  skipReminderThisSession = true;
                }
                setShowReminder(false);
                start();
              }}
            >
              <Text style={styles.modalButtonText}>
                Got it! Start Recording
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    justifyContent: "center",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
});
