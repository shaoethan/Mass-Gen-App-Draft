import CheckBox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import eventBus from "../eventbus";

export default function SubjectScreen() {
  const [subject, setSubject] = useState("");
  const [treatment, setTreatment] = useState("");
  const [phoneLocation, setPhoneLocation] = useState("");
  const [reportedActivities, setReportedActivities] = useState({});
  const router = useRouter();

  const isSubjectValid = /^\d{5}$/.test(subject);

  const activities = [
    { label: "Walk", value: "walk" },
    { label: "Sit", value: "sit" },
    { label: "Upstairs", value: "upstairs" },
    { label: "Downstairs", value: "downstairs" },
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
        phoneLocation,
      },
    });
  };

  const renderOption = (label, value, selectedValue, setValue) => (
    <TouchableOpacity
      onPress={() => setValue(value)}
      style={[
        styles.treatmentButton,
        selectedValue === value && styles.selectedTreatmentButton,
      ]}
    >
      <Text
        style={[
          styles.treatmentButtonText,
          selectedValue === value && styles.selectedTreatmentButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Subject Information</Text>

        <Text style={styles.label}>Subject ID:</Text>
        <TextInput
          placeholder="Enter 5-digit ID (e.g. 12345)"
          placeholderTextColor="#555"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={5}
          value={subject}
          onChangeText={(text) => setSubject(text.replace(/[^0-9]/g, ""))}
        />

        <Text style={styles.label}>Select Treatment:</Text>
        <View style={styles.row}>
          {renderOption("Before", "Before Treatment", treatment, setTreatment)}
          {renderOption("After", "After Treatment", treatment, setTreatment)}
        </View>

        <Text style={styles.label}>Select Phone Location:</Text>
        <View style={styles.row}>
          {renderOption(
            "Left Ankle",
            "Left Ankle",
            phoneLocation,
            setPhoneLocation
          )}
          {renderOption(
            "Right Wrist",
            "Right Wrist",
            phoneLocation,
            setPhoneLocation
          )}
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
                !(isSubjectValid && treatment && phoneLocation) &&
                  styles.disabledButton,
              ]}
              onPress={() => goToRecording(activity.value)}
              disabled={!(isSubjectValid && treatment && phoneLocation)}
            >
              <Text style={styles.buttonText}>
                {reportedActivities[activity.value]
                  ? "Record Again"
                  : "Record Activity"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  label: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 30,
    borderRadius: 5,
    borderColor: "#ccc",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    gap: 100,
    marginTop: 10,
    justifyContent: "center",
    marginBottom: 10,
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
    marginVertical: 12,
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
  treatmentButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  selectedTreatmentButton: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  treatmentButtonText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedTreatmentButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
