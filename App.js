import React, { useState, useContext } from "react";
import { StyleSheet, ScrollView, Text, Pressable } from "react-native";
import FaceDetectionComponent from "./components/FaceDetectionComponent";
import FaceForm from "./components/FaceForm"; // Import FaceForm
import { DataProvider } from "./context/DataContext"; // Import DataContext

const App = () => {
  const [selectedFaceIndex, setSelectedFaceIndex] = useState(null);
  const [facesData, setFacesData] = useState([]);
  const [photoDetails, setPhotoDetails] = useState({
    date: "",
    city: "",
    state: "",
    actionDescription: "",
    photoContext: "",
    photographerBranch: "",
    photographerRank: "",
    photographerName: "",
  });
  const [caption, setCaption] = useState(""); // State to store the generated caption

  const handleFacesDetected = (detections) => {
    // Initialize form data for each detected face
    console.log("Set FacesData", detections);
    setFacesData(detections);
  };

  const addManualFace = (manualFace) => {
    // Add a new manual face to facesData
    setFacesData((prevFacesData) => [
      ...prevFacesData,
      {
        serviceBranch: "",
        rank: "",
        firstName: "",
        lastName: "",
        unit: "",
        dutyTitle: "",
      },
    ]);
  };

  const onFaceClick = (index) => {
    // console.log("on face click index", index);
    setSelectedFaceIndex(index);
    console.log("Current clicked face", facesData[index]);
  };

  const handleInputChange = (field, value) => {
    // Update form data for the selected face only
    setFacesData((prevFacesData) => {
      const updatedFacesData = [...prevFacesData];
      const faceToUpdate = updatedFacesData[selectedFaceIndex];
      faceToUpdate["backendData"][field] = value;

      // updatedFacesData[selectedFaceIndex] = {
      //   ...updatedFacesData[selectedFaceIndex],
      //   [field]: value, // Allow spaces
      // };

      updatedFacesData[selectedFaceIndex] = {
        ...faceToUpdate,
      };

      const isComplete = Object.values(
        updatedFacesData[selectedFaceIndex]["backendData"]
      ).every((field) => field !== "" || field !== null);
      updatedFacesData[selectedFaceIndex] = {
        ...updatedFacesData[selectedFaceIndex],
        isComplete: isComplete, // Allow spaces
      };

      console.log(
        `Updating Face ${selectedFaceIndex + 1}`,
        updatedFacesData[selectedFaceIndex]
      );
      return updatedFacesData;
    });
  };

  const handlePhotoDetailsChange = (field, value) => {
    // Update photo details
    console.log("Updating Photo Details", field, value);
    setPhotoDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const generateCaption = () => {
    // Function to generate AP style photo caption
    
    setCaption(caption); // Set the generated caption to state
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FaceDetectionComponent
        onFacesDetected={handleFacesDetected}
        onFaceClick={onFaceClick} // Pass the onFaceClick function as a prop
        addManualFace={addManualFace} // Pass addManualFace function to handle manual faces
        facesIdentityData={facesData}
      />
      {selectedFaceIndex !== null && (
        <FaceForm
          faceData={facesData[selectedFaceIndex].backendData} // Pass individual face data
          onInputChange={(field, value) => handleInputChange(field, value)} // Pass input change handler
          index={selectedFaceIndex} // Pass index
          photoDetails={photoDetails} // Pass photo details
          onPhotoDetailsChange={handlePhotoDetailsChange}
        />
      )}
      <Pressable style={styles.button} onPress={generateCaption}>
        <Text style={styles.buttonText}>Generate Caption</Text>
      </Pressable>
      {caption ? <Text style={styles.captionText}>{caption}</Text> : null}
    </ScrollView>
  );
};

// Wrap App with DataProvider
const AppWithProvider = () => (
  <DataProvider>
    <App />
  </DataProvider>
);

export default AppWithProvider;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  captionText: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    textAlign: "center",
  },
});
