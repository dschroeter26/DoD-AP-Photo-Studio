import React, { useContext, useEffect } from "react";
import { View, TextInput, Text, Platform, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker for React Native
import { DataContext } from "../context/DataContext"; // Import DataContext
import DateTimePicker from "@react-native-community/datetimepicker"; // Import Date Picker for React Native

const FaceForm = ({
  faceData,
  onInputChange,
  index,
  photoDetails,
  onPhotoDetailsChange,
}) => {
  const { branches, ranksByBranch, loadRanksForBranch } =
    useContext(DataContext); // Use context

  useEffect(() => {
    const selectedBranch = faceData?.serviceBranch;
    if (selectedBranch) {
      loadRanksForBranch(selectedBranch); // Load ranks when a branch is selected
    }
  }, [faceData?.serviceBranch]);

  const selectedBranchRanks = faceData?.serviceBranch
    ? ranksByBranch[faceData.serviceBranch] || []
    : [];

  return (
    <View style={styles.formContainer}>
      <Text>Face {index + 1} Information:</Text>

      {/* Service Branch Select Box */}
      {Platform.OS === "web" ? (
        <select
          style={styles.selectBox}
          value={faceData?.serviceBranch || ""}
          onChange={(e) => {
            onInputChange("serviceBranch", e.target.value);
            onInputChange("rank", ""); // Reset rank when service branch changes
          }}
        >
          <option value="" disabled>
            Select Service Branch
          </option>
          {branches.map((branch, idx) => (
            <option key={idx} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      ) : (
        <Picker
          selectedValue={faceData?.serviceBranch || ""}
          onValueChange={(value) => {
            onInputChange("serviceBranch", value);
            onInputChange("rank", ""); // Reset rank when service branch changes
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select Service Branch" value="" />
          {branches.map((branch, idx) => (
            <Picker.Item key={idx} label={branch} value={branch} />
          ))}
        </Picker>
      )}

      {/* Rank Select Box */}
      {Platform.OS === "web" ? (
        <select
          style={styles.selectBox}
          value={faceData?.rank || ""}
          onChange={(e) => onInputChange("rank", e.target.value)}
          disabled={!faceData?.serviceBranch} // Disable until a service branch is chosen
        >
          <option value="" disabled>
            Select Rank
          </option>
          {selectedBranchRanks.map((rank, idx) => (
            <option key={idx} value={rank.value}>
              {rank.display}
            </option>
          ))}
        </select>
      ) : (
        <Picker
          selectedValue={faceData?.rank || ""}
          onValueChange={(value) => onInputChange("rank", value)}
          style={styles.picker}
          enabled={!!faceData?.serviceBranch} // Enable only if a service branch is chosen
        >
          <Picker.Item label="Select Rank" value="" />
          {selectedBranchRanks.map((rank, idx) => (
            <Picker.Item key={idx} label={rank.display} value={rank.value} />
          ))}
        </Picker>
      )}

      {/* Other Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={faceData?.firstName || ""}
        onChangeText={(value) => onInputChange("firstName", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={faceData?.lastName || ""}
        onChangeText={(value) => onInputChange("lastName", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Unit"
        value={faceData?.unit || ""}
        onChangeText={(value) => onInputChange("unit", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Duty Title"
        value={faceData?.dutyTitle || ""}
        onChangeText={(value) => onInputChange("dutyTitle", value)}
      />

      {/* Date Picker */}
      <Text>Date of the Photo:</Text>
      {Platform.OS === "web" ? (
        <input
          type="date"
          style={styles.input}
          value={photoDetails.date}
          onChange={(e) => onPhotoDetailsChange("date", e.target.value)}
        />
      ) : (
        <DateTimePicker
          value={photoDetails.date ? new Date(photoDetails.date) : new Date()}
          mode="date"
          display="default"
          onChange={(event, date) =>
            onPhotoDetailsChange(
              "date",
              date ? date.toISOString().split("T")[0] : ""
            )
          }
          style={styles.datePicker}
        />
      )}

      {/* City and State Inputs */}
      <TextInput
        style={styles.input}
        placeholder="City"
        value={photoDetails.city}
        onChangeText={(value) => onPhotoDetailsChange("city", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={photoDetails.state}
        onChangeText={(value) => onPhotoDetailsChange("state", value)}
      />

      {/* Action Description Text Area */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the action in the photo"
        value={photoDetails.actionDescription}
        onChangeText={(value) =>
          onPhotoDetailsChange("actionDescription", value)
        }
        multiline={true}
        rows={4}
      />

      {/* Context of the Photo Text Area */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Context of the photo"
        value={photoDetails.photoContext}
        onChangeText={(value) => onPhotoDetailsChange("photoContext", value)}
        multiline={true}
        rows={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "90%",
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  picker: {
    height: 40,
    marginBottom: 10,
  },
  datePicker: {
    marginBottom: 10,
    width: "100%",
  },
  textArea: {
    height: 80,
    verticalAlign: "top", // For multiline input
  },
  selectBox: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    width: "100%",
  },
});

export default FaceForm;
