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
  TouchableOpacity,
} from "react-native";
import eventBus from "../eventbus";
import { db } from "../firebaseConfig";

let time = 0;
let allData = [];
let unsub = null;
let paused = true;
let autoStopTimer = null;

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
  const [recordingDone, setRecordingDone] = useState(false); 
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
    
    autoStopTimer = setTimeout(() => {
      if (!paused) {
        stop();
        Alert.alert("Time Limit", "Recording automatically stopped after 10 seconds.");
      }
    }, 10000);
  }

  function stop() {
    if (autoStopTimer) {
      clearTimeout(autoStopTimer);
      autoStopTimer = null;
    }
    
    if (unsub) {
      unsub.remove();
      unsub = null;
    }
    paused = true;
    setIsRecording(false);
    setRecordingDone(true);
  }

  function clear() {
    stop();
    time = 0;
    allData = [];
    setData({ x: 0, y: 0, z: 0 });
    setHasData(false);
    setReportSent(false);
    setRecordingDone(false);
  }

  async function reportData() {
    if (allData.length === 0 || !subject) {
      Alert.alert("Error", "No data to report.");
      return;
    }

    const durationInSeconds = time / 1000;
    if (durationInSeconds < 7) {
    Alert.alert(
      "Too Short",
      "Recording must be at least 7 seconds long to report."
    );
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
      <Text style={styles.header}>Walk Recording Screen</Text>

      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>Instructions</Text>
        <Text style={styles.instructionsText}>
          • Walk in a straight line at a normal pace for at least 20 seconds.{"\n"}
          • Use a band to attach the phone securely to your chosen location.{"\n"}
          • Keep the phone stable while walking.
        </Text>
      </View>

      <View style={styles.vitalsBox}>
        <Text style={styles.vitalsText}>
          <Text style={styles.label}>Subject: </Text>{subject}
        </Text>
        <Text style={styles.vitalsText}>
          <Text style={styles.label}>Treatment: </Text>{treatment}
        </Text>
        <Text style={styles.vitalsText}>
           <Text style={styles.label}>Activity: </Text>{activity}
        </Text>
        <Text style={styles.vitalsText}>
          <Text style={styles.label}>x:</Text> {x.toFixed(2)}{"   "}
          <Text style={styles.label}>y:</Text> {y.toFixed(2)}{"   "}
          <Text style={styles.label}>z:</Text> {z.toFixed(2)}
        </Text>
        <Text style={styles.vitalsText}>
          <Text style={styles.label}>Recording time: </Text>{(time / 1000).toFixed(1)}s
        </Text>
      </View>


      <View style={styles.btnRow}>
        <TouchableOpacity
          onPress={handleStartPress}
          disabled={isRecording || recordingDone}
          style={[
            styles.customButton,
            styles.primaryButton,
            (isRecording || recordingDone) && styles.disabledButton,
        ]}
      >
          <Text style={styles.buttonText}>Start Recording</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={stop}
          disabled={!isRecording}
          style={[
            styles.customButton,
            styles.dangerButton,
            !isRecording && styles.disabledButton,
        ]}
      >
        <Text style={styles.buttonText}>Stop Recording</Text>
      </TouchableOpacity>
    </View>

    <View style={{ marginVertical: 10 }}>
      <TouchableOpacity
        onPress={clear}
        disabled={!hasData}
        style={[
          styles.customButton,
          styles.primaryButton,
          !hasData && styles.disabledButton,
        ]}
      >
        <Text style={styles.buttonText}>Clear Data</Text>
      </TouchableOpacity>
    </View>

    {hasData && (
      <View style={{ marginVertical: 10 }}>
        <TouchableOpacity
          onPress={reportData}
          disabled={reportSent || isRecording}
          style={[
            styles.customButton,
            styles.orangeButton,
            (reportSent || isRecording) && styles.disabledButton,
        ]}
      >
        <Text style={styles.buttonText}>Report to Firebase</Text>
      </TouchableOpacity>
  </View>
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
              📱 Please hold your phone in your right hand during the
              activity. Record for at least 7 seconds. The timer will automatically stop at 10 seconds.
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
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    MarginBottom: 16,
    color: "#1e1e1e",
    marginBottom: 24,
  },
  instructionsBox: {
    backgroundColor: "#f0f4ff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    marginTop: 12,
  },
  instructionsTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  vitalsBox: {
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  vitalsText: {
    fontSize: 15,
    marginBottom: 4,
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    color: "#1e1e1e",
  },
  acc: {
    fontSize: 16,
    marginVertical: 10,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 16,
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
  customButton: {
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  marginVertical: 8,
  alignItems: "center",
  justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#2563eb", 
  },
  dangerButton: {
    backgroundColor: "#ef4444", 
  },
  grayButton: {
    backgroundColor: "#d1d5db", 
  },
  orangeButton: {
    backgroundColor: "#f59e0b", 
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
