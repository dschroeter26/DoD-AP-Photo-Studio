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

const FaceDetectionComponent = ({
  onFacesDetected,
  onFaceClick,
  addManualFace,
  facesIdentityData,
}) => {
  const [imageUri, setImageUri] = useState(null);
  const [faces, setFaces] = useState([]);
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

  const base64ToBlobUrl = (base64Data) => {
    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    return URL.createObjectURL(blob);
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const { uri, width, height } = result.assets[0];
      const base64Data = uri;

      if (base64Data) {
        const blobUrl = base64ToBlobUrl(base64Data);
        setImageUri(blobUrl);
        setImageDimensions({ width, height });
        await detectFaces(blobUrl);
      } else {
        console.error("Image URI is undefined or null");
      }
    } else {
      console.log("ImagePicker was cancelled");
    }
  };

  const detectFaces = async (blobUrl) => {
    setIsAnalyzing(true); // Start analyzing
    try {
      if (!blobUrl) {
        throw new Error("Image Blob URL is undefined or null");
      }

      const img = new window.Image();
      img.src = blobUrl;

      img.onload = async () => {
        try {
          console.log("Image loaded for face detection.");
          // const options = new faceapi.TinyFaceDetectorOptions({
          //   inputSize: 1024,
          //   scoreThreshold: 0.4,
          // });
          const mtcnnOptions = new faceapi.MtcnnOptions({
            // minFaceSize: 20,
            // scaleFactor: 0.8,
            // maxNumScales: 10,
            minFaceSize: 100, // Increase for better performance
            scaleFactor: 0.9, // Higher values improve speed but reduce accuracy
            maxNumScales: 5, // Limit scales to control memory usage
          });
          const ssdMobilenetv1Options = new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.3, // Adjust this value as needed
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

          // const detections = await faceapi
          //   .detectAllFaces(img, mtcnnOptions)
          //   .detectAllFaces(img, ssdMobilenetv1Options)
          //   // .detectAllFaces(img)
          //   .withFaceLandmarks();

          // Combine results
          const combinedDetections = mergeDetections(
            mtcnnDetections,
            ssdDetections
          );
          console.log("Detections:", combinedDetections);
          setFaces(combinedDetections);
          onFacesDetected(combinedDetections); // Pass detected faces to the parent component

          // Find the largest face box
          if (combinedDetections.length > 0) {
            const largestBox = combinedDetections.reduce(
              (largest, detection) => {
                const { width, height } = detection.detection.box;
                return width * height > largest.width * largest.height
                  ? detection.detection.box
                  : largest;
              },
              combinedDetections[0].detection.box
            );
            setLargestFaceBox(largestBox);
          }

          URL.revokeObjectURL(blobUrl);
        } catch (error) {
          console.error("Error during face detection:", error);
        } finally {
          setIsAnalyzing(false); // Stop analyzing
        }
      };

      // Helper function to merge detections, avoiding duplicates
      // function mergeDetections(mtcnnDetections, ssdDetections) {
      //   const iouThreshold = 0.5; // Define IoU threshold to consider two boxes as the same
      //   const combinedDetections = [...mtcnnDetections];

      //   for (const detection of ssdDetections) {
      //     if (
      //       !combinedDetections.some(
      //         (d) =>
      //           faceapi.euclideanDistance(
      //             d.detection.box,
      //             detection.detection.box
      //           ) < iouThreshold
      //       )
      //     ) {
      //       combinedDetections.push(detection);
      //     }
      //   }
      //   return combinedDetections;
      // }

      function mergeDetections(detections1, detections2, iouThreshold = 0.5) {
        const mergedDetections = [...detections1];
      
        for (const det2 of detections2) {
          const isMerged = mergedDetections.some((det1) => {
            const iou = calculateIoU(det1.detection.box, det2.detection.box);
            if (iou > iouThreshold) {
              // Merge or skip, depending on your strategy
              return true;
            }
            return false;
          });
      
          if (!isMerged) {
            mergedDetections.push(det2);
          }
        }
      
        return mergedDetections;
      }

      function calculateIoU(boxA, boxB) {
        const xA = Math.max(boxA.x, boxB.x);
        const yA = Math.max(boxA.y, boxB.y);
        const xB = Math.min(boxA.x + boxA.width, boxB.x + boxB.width);
        const yB = Math.min(boxA.y + boxA.height, boxB.y + boxB.height);
      
        // Compute the area of intersection
        const intersectionArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
      
        // Compute the area of both the prediction and ground-truth rectangles
        const boxAArea = boxA.width * boxA.height;
        const boxBArea = boxB.width * boxB.height;
      
        // Compute the IoU
        const iou = intersectionArea / (boxAArea + boxBArea - intersectionArea);
      
        return iou;
      }

      img.onerror = (err) => {
        console.error("Error loading image for face detection:", err);
        setIsAnalyzing(false); // Stop analyzing in case of error
      };
    } catch (error) {
      console.error("Error detecting faces:", error);
      setIsAnalyzing(false); // Stop analyzing in case of error
    }
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
        onPress={handleImageUpload}
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
              onClick={handleTapToCreateBox} // Use click to create a manual box
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
          {faces.map((face, index) => {
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
                      : facesIdentityData[index].isComplete
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
                    selectedFaceIndex === faces.length + index
                      ? "2px solid blue" // Highlight manual face when selected
                      : facesIdentityData[faces.length + index].isComplete
                      ? "2px solid green" // Green when form data is complete
                      : "2px solid orange", // Initially orange until data is filled
                  cursor: "pointer",
                  // backgroundColor: facesIdentityData[faces.length + index].isComplete
                  //   ? "rgba(0, 255, 0, 0.2)" // Turn green when form data is complete
                  //   : "rgba(255, 165, 0, 0.2)", // Orange background when incomplete
                }}
                onClick={() => {
                  setSelectedFaceIndex(faces.length + index); // Set selected face index for manual face
                  onFaceClick(faces.length + index); // Trigger onFaceClick from parent component
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
        {faces.length + manualFaces.length
          ? `Faces detected: ${faces.length + manualFaces.length}`
          : "No faces detected"}
      </Text>
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
