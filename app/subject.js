import CheckBox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import eventBus from "../eventbus";

export default function SubjectScreen() {
  const [subject, setSubject] = useState("");
  const [treatment, setTreatment] = useState("");
  const [reportedActivities, setReportedActivities] = useState({});
  const router = useRouter();

  const activities = [
    { label: "Walk", value: "walk" },
    { label: "Sit", value: "sit" },
    { label: "Upstairs", value: "upstair" },
    { label: "Downstairs", value: "downstair" },
  ];

  useEffect(() => {
    const listener = (reportedActivity) => {
      setReportedActivities((prev) => ({
        ...prev,
        [reportedActivity]: true,
      }));
    };

    eventBus.on("activityReported", listener);
    return () => eventBus.off("activityReported", listener);
  }, []);

  const goToRecording = (activity) => {
    router.push({
      pathname: "/record",
      params: {
        subject,
        treatment,
        activity,
      },
    });
  };

  const renderOption = (label, value, selectedValue, setValue) => (
    <TouchableOpacity onPress={() => setValue(value)} style={styles.option}>
      <Text
        style={[
          styles.optionText,
          selectedValue === value && styles.selectedText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Subject Information</Text>

      <TextInput
        placeholder="Enter subject name"
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
      />

      <Text style={styles.label}>Select Treatment:</Text>
      <View style={styles.row}>
        {renderOption("Before", "beforeTreatment", treatment, setTreatment)}
        {renderOption("After", "afterTreatment", treatment, setTreatment)}
      </View>

      <Text style={styles.label}>Select Activity:</Text>
      {activities.map((activity) => (
        <View key={activity.value} style={styles.activityRow}>
          <View style={styles.checkboxContainer}>
            <CheckBox value={!!reportedActivities[activity.value]} />
            <Text style={styles.activityLabel}>{activity.label}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.recordButton,
              !(subject && treatment) && styles.disabledButton,
            ]}
            onPress={() => goToRecording(activity.value)}
            disabled={!(subject && treatment)}
          >
            <Text style={styles.buttonText}>
              {reportedActivities[activity.value]
                ? "Record Again"
                : "Record Activity"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
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
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 8,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
    justifyContent: "space-between",
  },
  option: {
    padding: 10,
  },
  optionText: {
    color: "gray",
    fontSize: 16,
  },
  selectedText: {
    color: "blue",
    fontWeight: "bold",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 10,
  },
  activityLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  recordButton: {
    backgroundColor: "blue",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
