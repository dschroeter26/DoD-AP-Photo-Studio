export const calculateIoUUsingBoxCorners = (boxA, boxB) => {
  const xA = Math.max(boxA.left, boxB.left);
  const yA = Math.max(boxA.top, boxB.top);
  const xB = Math.min(boxA.left + boxA.width, boxB.left + boxB.width);
  const yB = Math.min(boxA.top + boxA.height, boxB.top + boxB.height);

  const intersectionArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
  const boxAArea = boxA.width * boxA.height;
  const boxBArea = boxB.width * boxB.height;

  const iou = intersectionArea / (boxAArea + boxBArea - intersectionArea);
  return iou;
};

export const calculateIoUUsingXYCoordinates = (boxA, boxB) => {
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
};

export const mergeFaceApiDetections = (
  detections1,
  detections2,
  iouThreshold = 0.5
) => {
  const mergedDetections = [...detections1];

  for (const det2 of detections2) {
    const isMerged = mergedDetections.some((det1) => {
      const iou = calculateIoUUsingXYCoordinates(
        det1.detection.box,
        det2.detection.box
      );
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
};

export const mergeDetections = (
  //  this is to merge facial-recognition-api and face-api.js detections
  frontendDetections,
  backendDetections,
  iouThreshold = 0.5
) => {
  const mergedDetections = [];

  frontendDetections.forEach((frontendFace) => {
    const frontendBox = {
      left: frontendFace.detection.box.x,
      top: frontendFace.detection.box.y,
      width: frontendFace.detection.box.width,
      height: frontendFace.detection.box.height,
    };

    let matchedBackendFace = null;

    // Check for overlaps with backend detections
    backendDetections.forEach((backendFace) => {
      const backendBox = backendFace.box;

      const iou = calculateIoUUsingBoxCorners(frontendBox, backendBox);
      if (iou > iouThreshold) {
        matchedBackendFace = backendFace;
      }
    });

    if (matchedBackendFace) {
      mergedDetections.push(matchedBackendFace); // Use backend recognition details if there's a match
    } else {
      mergedDetections.push({
        firstName: "Unknown",
        middleName: null,
        lastName: null,
        rank: null,
        unit: null,
        dutyTitle: null,
        serviceBranch: null,
        box: frontendBox, // Use frontend box if no backend match
      });
    }
  });

  return mergedDetections;
};

export const convertBackendBox = (box) => {
  const width = box.right - box.left;
  const height = box.bottom - box.top;
  const x = box.left;
  const y = box.top;
  return { x, y, width, height };
};

export const combineFaceApiAndBackendDetections = (
  faceApiDetections,
  backendDetections
) => {
  const combinedDetections = [];

  // Step 1: Iterate over backend detections first
  backendDetections.forEach((backendFace) => {
    const { bottom, top, left, right, isRecognized } = backendFace.box;

    // Convert backend's bounding box to frontend's format (x, y, width, height)
    const backendBox = {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    };

    // Try to find a corresponding face in faceApiDetections
    const matchedFace = faceApiDetections.find((apiFace) => {
      const { x, y, width, height } = apiFace.detection.box;

      // Simple overlap detection based on bounding box coordinates
      return (
        x < backendBox.x + backendBox.width &&
        x + width > backendBox.x &&
        y < backendBox.y + backendBox.height &&
        y + height > backendBox.y
      );
    });

    // If there's a match, combine the backend data with the frontend detection
    if (matchedFace) {
      combinedDetections.push({
        ...matchedFace,
        isRecognized,
        backendData: backendFace, // Add backend data for recognized face
      });
    } else {
      // If no matching frontend detection is found, add backend detection as a new face
      combinedDetections.push({
        detection: { box: backendBox },
        isRecognized,
        backendData: backendFace, // Add backend data
      });
    }
  });

  // Step 2: Add any remaining frontend detections that were not matched to backend faces
  faceApiDetections.forEach((apiFace) => {
    const { x, y, width, height } = apiFace.detection.box;

    // Check if this face was already added via backend matching
    const alreadyAdded = combinedDetections.some((combinedFace) => {
      const backendBox = combinedFace.detection.box;
      return (
        x === backendBox.x &&
        y === backendBox.y &&
        width === backendBox.width &&
        height === backendBox.height
      );
    });

    if (!alreadyAdded) {
      combinedDetections.push(apiFace); // Add unmatched frontend face
    }
  });

  return combinedDetections;
};
