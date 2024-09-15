import React, { useState, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
} from "react-native";
import FaceDetectionComponent from "./components/FaceDetectionComponent";
import FaceForm from "./components/FaceForm"; // Import FaceForm
import { DataProvider } from "./context/DataContext"; // Import DataContext

const App = () => {
  const [selectedFaceIndex, setSelectedFaceIndex] = useState(null);
  const [facesData, setFacesData] = useState([]);
  const [photoDetails, setPhotoDetails] = useState({
    date: "", // Date of the photo
    city: "", // City location
    state: "", // State location
    actionDescription: "", // Description of the action in the photo
    photoContext: "", // Context of the photo
  });
  const [caption, setCaption] = useState(""); // State to store the generated caption

  const handleFacesDetected = (detections) => {
    // Initialize form data for each detected face
    setFacesData(
      detections.map(() => ({
        serviceBranch: "",
        rank: "",
        firstName: "",
        lastName: "",
        unit: "",
        dutyTitle: "",
      }))
    );
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
    setSelectedFaceIndex(index); // Set the selected face index
  };

  const handleInputChange = (field, value) => {
    // Update form data for the selected face only
    setFacesData((prevFacesData) => {
      const updatedFacesData = [...prevFacesData];
      updatedFacesData[selectedFaceIndex] = {
        ...updatedFacesData[selectedFaceIndex],
        [field]: value, // Allow spaces
      };
      return updatedFacesData;
    });
  };

  const handlePhotoDetailsChange = (field, value) => {
    // Update photo details
    setPhotoDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const generateCaption = () => {
    // Function to generate AP style photo caption
    const formattedDate = new Date(photoDetails.date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const facesDescriptions = facesData
      .map((face) => {
        const rank = face.rank ? `${face.rank} ` : "";
        const name = `${face.firstName} ${face.lastName}`;
        const unit = face.unit ? `, assigned to the ${face.unit}` : "";
        return `${rank}${name}${unit}`;
      })
      .join("; ");

    const caption = `${facesDescriptions} ${
      photoDetails.actionDescription
        ? `, ${photoDetails.actionDescription}`
        : ""
    } at ${photoDetails.city}, ${photoDetails.state}, on ${formattedDate}. ${
      photoDetails.photoContext ? photoDetails.photoContext : ""
    }`;

    setCaption(caption); // Set the generated caption to state
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FaceDetectionComponent
        onFacesDetected={handleFacesDetected}
        onFaceClick={onFaceClick} // Pass the onFaceClick function as a prop
        facesData={facesData} // Pass facesData to FaceDetectionComponent
        addManualFace={addManualFace} // Pass addManualFace function to handle manual faces
      />
      {selectedFaceIndex !== null && (
        <FaceForm
          faceData={facesData[selectedFaceIndex]} // Pass individual face data
          onInputChange={(field, value) => handleInputChange(field, value)} // Pass input change handler
          index={selectedFaceIndex} // Pass index
          photoDetails={photoDetails} // Pass photo details
          onPhotoDetailsChange={handlePhotoDetailsChange} // Pass handler for photo details change
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
