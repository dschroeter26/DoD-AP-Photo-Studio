import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  Image,
  Text,
  Platform,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as faceapi from "face-api.js";
import { uploadImage } from "../services/apiService";
import { toFormData } from "../utils/HttpUtils";
import {
  mergeFaceApiDetections,
  combineFaceApiAndBackendDetections,
} from "../utils/FacialRecognitionUtils";

const FaceDetectionComponent = ({
  onFacesDetected,
  onFaceClick,
  // addManualFace,
  facesIdentityData,
}) => {
  const [imageUri, setImageUri] = useState(null);
  const [facialRecognitionApiDetections, setFacialRecognitionApiDetections] =
    useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 300,
    height: 300,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false); // State to track if analysis is in progress
  const [selectedFaceIndex, setSelectedFaceIndex] = useState(0); // State to track selected face

  const [manualFaces, setManualFaces] = useState([]); // Store manually created faces
  const [largestFaceBox, setLargestFaceBox] = useState(null); // Store the size of the largest detected face

  useEffect(() => {
    const loadModels = async () => {
      try {
        // await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.mtcnn.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        await faceapi.nets.ageGenderNet.loadFromUri("/models");
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  const onUploadImageClick = async () => {
    try {
      const imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!imageResult.canceled) {
        const { uri, width, height } = imageResult.assets[0];
        setImageUri(uri); // Set image URI for display
        setImageDimensions({ width, height });
        setIsAnalyzing(true); // Start analyzing

        // Step 1: Detect faces with face-api and store result in local variable
        const faceApiResult = await detectFacesWithFaceApi(uri); // Use `uri` to detect faces

        // Step 2: Call the backend API and store result in local variable
        const backendFaceDetections = await callFacialRecognitionApi(
          imageResult
        ); // Get backend detections
        // setFacialRecognitionApiDetections(backendFaceDetections); // Update state

        // Step 3: Combine both results using local variables
        const combinedDetections = combineFaceApiAndBackendDetections(
          faceApiResult, // Use the local result instead of state
          backendFaceDetections // Use the local result instead of state
        );

        // Step 4: Pass the combined detections to the parent component
        console.log(
          "Combined FaceApi and Facial Recognition Detections",
          combinedDetections
        );
        onFacesDetected(combinedDetections);

        setIsAnalyzing(false); // End analyzing
      } else {
        console.log("ImagePicker was cancelled");
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      setIsAnalyzing(false); // End analyzing in case of error
    }
  };

  const detectFacesWithFaceApi = async (blobUrl) => {
    return new Promise((resolve, reject) => {
      try {
        if (!blobUrl) {
          throw new Error("Image Blob URL is undefined or null");
        }

        const img = new window.Image();
        img.src = blobUrl;

        img.onload = async () => {
          try {
            console.log("Image loaded for face detection.");

            const mtcnnOptions = new faceapi.MtcnnOptions({
              minFaceSize: 100,
              scaleFactor: 0.9,
              maxNumScales: 5,
            });
            const ssdMobilenetv1Options = new faceapi.SsdMobilenetv1Options({
              minConfidence: 0.3,
            });

            // Run MTCNN model
            const mtcnnDetections = await faceapi
              .detectAllFaces(img, mtcnnOptions)
              .withFaceLandmarks();
            console.log("mtcnnDetections", mtcnnDetections);

            // Run SsdMobilenetv1 model
            const ssdDetections = await faceapi
              .detectAllFaces(img, ssdMobilenetv1Options)
              .withFaceLandmarks();
            console.log("ssdDetections", ssdDetections);

            // Combine results
            const combinedFaceApiDetections = mergeFaceApiDetections(
              mtcnnDetections,
              ssdDetections
            );
            console.log(
              "Combined Face Api Detections:",
              combinedFaceApiDetections
            );

            // Find the largest face box for manual box creation
            if (combinedFaceApiDetections.length > 0) {
              const largestBox = combinedFaceApiDetections.reduce(
                (largest, detection) => {
                  const { width, height } = detection.detection.box;
                  return width * height > largest.width * largest.height
                    ? detection.detection.box
                    : largest;
                },
                combinedFaceApiDetections[0].detection.box
              );
              setLargestFaceBox(largestBox);
            }

            URL.revokeObjectURL(blobUrl);

            resolve(combinedFaceApiDetections); // Resolve with the combined detections
          } catch (error) {
            console.error("Error during face detection:", error);
            reject(error); // Reject the promise in case of an error
          }
        };

        img.onerror = (err) => {
          console.error("Error loading image for face detection:", err);
          setIsAnalyzing(false); // Stop analyzing in case of error
          reject(err); // Reject the promise in case of an error
        };
      } catch (error) {
        console.error("Error detecting faces:", error);
        setIsAnalyzing(false); // Stop analyzing in case of error
        reject(error); // Reject the promise in case of an error
      }
    });
  };

  const callFacialRecognitionApi = async (result) => {
    try {
      const { uri, mimeType, fileName } = result.assets[0];
      console.log("Creating FormData with", { uri, mimeType, fileName });

      const formData = toFormData({ uri, mimeType, fileName });
      console.log("FormData created:", formData);

      const backendFaceDetections = await uploadImage(formData); // Upload as FormData
      // setFacialRecognitionApiDetections(backendFaceDetections); //to display json on screen for development
      return backendFaceDetections;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Helper function to load image as a Promise
  const loadImage = (blobUrl) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = blobUrl;

      img.onload = () => resolve(img);
      img.onerror = (err) =>
        reject(new Error("Error loading image for face detection."));
    });
  };

  const handleTapToCreateBox = (event) => {
    if (!largestFaceBox) return; // Do nothing if no faces detected

    const img = event.target;
    const rect = img.getBoundingClientRect();
    const tapX =
      (event.clientX - rect.left) * (imageDimensions.width / rect.width); // Scale to original image dimensions
    const tapY =
      (event.clientY - rect.top) * (imageDimensions.height / rect.height); // Scale to original image dimensions

    // Create a manual face box centered at the tap location with the size of the largest detected face box
    const newManualFace = {
      x: tapX - largestFaceBox.width / 2,
      y: tapY - largestFaceBox.height / 2,
      width: largestFaceBox.width,
      height: largestFaceBox.height,
      // isComplete: false, // Initially set to incomplete
    };

    setManualFaces((prevFaces) => [...prevFaces, newManualFace]); // Add new manual face
    addManualFace(newManualFace); // Notify parent component about new face
  };

  const removeManualFace = (index) => {
    setManualFaces((prevFaces) => prevFaces.filter((_, i) => i !== index));
  };

  const aspectRatio = imageDimensions.width / imageDimensions.height;
  const windowWidth = Dimensions.get("window").width;
  const imageWidth = Math.min(windowWidth * 0.9, 400); // Max width of 90% of screen or 400px
  const imageHeight = imageWidth / aspectRatio; // Maintain aspect ratio

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={onUploadImageClick}
        disabled={isAnalyzing}
      >
        <Text style={styles.buttonText}>Upload Image</Text>
      </Pressable>
      {imageUri && (
        <View style={{ position: "relative" }}>
          {Platform.OS === "web" ? (
            <img
              src={imageUri}
              alt="uploaded"
              style={{
                width: imageWidth,
                height: imageHeight,
                objectFit: "contain",
                filter: isAnalyzing ? "grayscale(100%)" : "none", // Make the image grayscale during analysis
              }}
              // onClick={handleTapToCreateBox} // Uncomment to enable manual face addition.
            />
          ) : (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: imageWidth,
                height: imageHeight,
                resizeMode: "contain",
                tintColor: isAnalyzing ? "gray" : undefined, // Make image gray in React Native during analysis
              }}
            />
          )}
          {/* Spinner on top of the image when analyzing */}
          {isAnalyzing && (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
          {/* Render Recognized Faces */}
          {facesIdentityData.map((face, index) => {
            console.log(`Render face index for ${face.backendData.firstName}`, index);
            const { x, y, width, height } = face.detection.box;
            const scaleX = imageWidth / imageDimensions.width;
            const scaleY = imageHeight / imageDimensions.height;
            return (
              <View
                key={index}
                style={{
                  position: "absolute",
                  left: x * scaleX,
                  top: y * scaleY,
                  width: width * scaleX,
                  height: height * scaleY,
                  border:
                    selectedFaceIndex === index //If selected make it blue
                      ? "2px solid blue"
                      : facesIdentityData[index] &&
                        facesIdentityData[index].isComplete
                      ? "2px solid green" // Green when form data is complete
                      : "2px solid red", // Initially red until data is filled
                  cursor: "pointer",
                  backgroundColor:
                    selectedFaceIndex === index
                      ? "rgba(0, 0, 255, 0.2)"
                      : "transparent", // Background for selected face
                }}
                onClick={() => {
                  setSelectedFaceIndex(index); // Set selected face index
                  onFaceClick(index); // Trigger onFaceClick from parent component
                }}
              />
            );
          })}
          {/* Render Manually Drawn Faces */}
          {manualFaces.map((manualFace, index) => {
            console.log("Drawing manual face box", manualFace);
            const scaleX = imageWidth / imageDimensions.width;
            const scaleY = imageHeight / imageDimensions.height;
            return (
              <View
                key={`manual-${index}`}
                style={{
                  position: "absolute",
                  left: manualFace.x * scaleX,
                  top: manualFace.y * scaleY,
                  width: manualFace.width * scaleX,
                  height: manualFace.height * scaleY,
                  border:
                    selectedFaceIndex === facesIdentityData.length + index
                      ? "2px solid blue" // Highlight manual face when selected
                      : facesIdentityData[facesIdentityData.length + index]
                          .isComplete
                      ? "2px solid green" // Green when form data is complete
                      : "2px solid orange", // Initially orange until data is filled
                  cursor: "pointer",
                  // backgroundColor: facesIdentityData[faces.length + index].isComplete
                  //   ? "rgba(0, 255, 0, 0.2)" // Turn green when form data is complete
                  //   : "rgba(255, 165, 0, 0.2)", // Orange background when incomplete
                }}
                onClick={() => {
                  setSelectedFaceIndex(facesIdentityData.length + index); // Set selected face index for manual face
                  onFaceClick(facesIdentityData.length + index); // Trigger onFaceClick from parent component
                }}
              >
                {/* Delete Button for Manual Faces */}
                <Pressable
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    padding: "2px 5px",
                    zIndex: 1,
                  }}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevent triggering the face click handler
                    removeManualFace(index); // Remove the manual face
                  }}
                >
                  <Text>X</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
      <Text>
        {facesIdentityData.length + manualFaces.length
          ? `Faces detected: ${facesIdentityData.length + manualFaces.length}`
          : "No faces detected"}
      </Text>
      {/* {facesIdentityData && (
        <Text>{JSON.stringify(facesIdentityData)}</Text>
      )} */}
    </View>
  );
};

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
  spinnerContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 10,
  },
});

export default FaceDetectionComponent;
