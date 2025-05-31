import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SubjectScreen() {
  const [subject, setSubject] = useState("");
  const [treatment, setTreatment] = useState("");
  const [activity, setActivity] = useState("");
  const router = useRouter();

  const canContinue = subject && treatment && activity;

  const goToRecording = () => {
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
      <View style={styles.row}>
        {renderOption("Walk", "walk", activity, setActivity)}
        {renderOption("Sit", "sit", activity, setActivity)}
        {renderOption("Upstairs", "upstair", activity, setActivity)}
        {renderOption("Downstairs", "downstair", activity, setActivity)}
      </View>

      <TouchableOpacity
        onPress={goToRecording}
        disabled={!canContinue}
        style={[styles.continueButton, !canContinue && styles.disabledButton]}
      >
        <Text style={styles.continueText}>Continue to Recording</Text>
      </TouchableOpacity>
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
    flexWrap: "wrap",
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
  continueButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  continueText: {
    color: "white",
    fontWeight: "bold",
  },
});
