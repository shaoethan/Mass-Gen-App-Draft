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

  const OptionButton = ({ label, value, selected, onSelect }) => (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      style={[styles.optionButton, selected === value && styles.optionButtonSelected]}
    >
      <Text style={[styles.optionText, selected === value && styles.optionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Setup</Text>

      <Text style={styles.label}>Subject ID (5 digits)</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="e.g. 12345"
        maxLength={5}
        value={subject}
        onChangeText={(text) => setSubject(text.replace(/[^0-9]/g, ""))}
      />

      <Text style={styles.label}>Treatment</Text>
      <View style={styles.row}>
        <OptionButton label="Before" value="Before Treatment" selected={treatment} onSelect={setTreatment} />
        <OptionButton label="After" value="After Treatment" selected={treatment} onSelect={setTreatment} />
      </View>

      <Text style={styles.label}>Phone Placement</Text>
      <View style={styles.row}>
        <OptionButton label="Dominant Hand" value="Dominant Hand" selected={phoneLocation} onSelect={setPhoneLocation} />
        <OptionButton label="Same Pant Pocket" value="Same Pant Pocket" selected={phoneLocation} onSelect={setPhoneLocation} />
      </View>

      <Text style={styles.label}>Select an Activity to Record</Text>
      {activities.map((activity) => (
        <TouchableOpacity
          key={activity.value}
          style={[
            styles.activityButton,
            !(isSubjectValid && treatment && phoneLocation) && styles.disabled,
          ]}
          disabled={!(isSubjectValid && treatment && phoneLocation)}
          onPress={() => goToRecording(activity.value)}
        >
          <Text style={styles.activityButtonText}>
            {reportedActivities[activity.value] ? "✔ " : ""}
            {activity.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  optionText: {
    color: "#555",
    fontSize: 16,
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  activityButton: {
    marginTop: 10,
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  activityButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    backgroundColor: "#999",
  },
});
