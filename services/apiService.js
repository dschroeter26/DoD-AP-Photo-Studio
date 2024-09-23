import axios from "axios";

const API_BASE_URL = "http://localhost:5002/api/images"; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const uploadImage = async (imageData) => {
  try {
    console.log(`Calling ${API_BASE_URL}/upload with request body`, imageData);
    const response = await api.post("/upload", imageData);
    console.log("Response", response);
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const captionImage = async (photoMetaData, facesData) => {
  try {
    console.log("photoMetadata", photoMetaData);
    console.log("facesData", facesData);
    const subjects = facesData.map((face) => {
      return {
        serviceBranch: face.backendData.serviceBranch,
        rank: face.backendData.rank,
        firstName: face.backendData.firstName,
        lastName: face.backendData.lastName,
        unit: face.backendData.unit,
        dutyTitle: face.backendData.dutyTitle.toLowerCase(),
      };
    });
    const captionPhotoRequestBody = {
      subjects,
      action: photoMetaData.actionDescription,
      location: {
        base: photoMetaData.city,
        state: photoMetaData.state,
      },
      date: photoMetaData.date,
      photographer: {
        rank: photoMetaData.photographerRank,
        name: photoMetaData.photographerName,
      },
      exampleCaption:
        "Manny Piñeiro, guest speaker, Col. Michael Power, 377th Air Base Wing commander, Chief Master Sgt. Antonio Cooper, 377th Air Base Wing command chief master sergeant, pose for a photo at the Senior Noncommissioned Officer Recognition Ceremony at Isleta Resort and Casino, Albuquerque, N.M., Aug. 16. Piñeiro spoke to the new master sergeants about the importance of leadership and relationships as the Air Force evolves with a new generation of leadership. (U.S. Air Force photo by Airman 1st Class Donnell Schroeter)",
    };
    console.log(
      `Calling ${API_BASE_URL}/generate-caption`,
      captionPhotoRequestBody
    );
    // console.log(JSON.stringify(captionPhotoRequestBody));
    const response = await api.post(
      "/generate-caption",
      captionPhotoRequestBody,
      {
        headers: {
          "Content-Type": "application/json", // Set header to JSON
        },
      }
    );
    console.log("Response", response);
    return response.data.caption;
  } catch (error) {
    console.error("Error captioning image:", error);
    throw error;
  }
};

/**
 * {
  "subjects": [
    {
      "serviceBranch": "U.S. Air Force",
      "rank": "Col.",
      "firstName": "Michael",
      "lastName": "Power",
      "unit": "377th Air Base Wing",
      "dutyTitle": "commander"
    },
    {
      "serviceBranch": "U.S. Air Force",
      "rank": "Lt. Col.",
      "firstName": "Rachel",
      "lastName": "Heath",
      "unit": "377th Medical Group",
      "dutyTitle": "Commander"
    }
  ],
  "action": "Lt. Col. Heath accepts the guideon from Col. Power during the 377th Medical Group Change of Command ceremony",
  "location": {
    "base": "Kirtland Air Force Base",
    // "city": "Albuquerque",
    "state": "New Mexico"
  },
  "date": "Sept. 21, 2024",
  "photographer": {
    "rank": "Airman 1st Class",
    "name": "Donnell Schroeter"
  },
  "exampleCaption": "Manny Piñeiro, guest speaker, Col. Michael Power, 377th Air Base Wing commander, Chief Master Sgt. Antonio Cooper, 377th Air Base Wing command chief master sergeant, pose for a photo at the Senior Noncommissioned Officer Recognition Ceremony at Isleta Resort and Casino, Albuquerque, N.M., Aug. 16. Piñeiro spoke to the new master sergeants about the importance of leadership and relationships as the Air Force evolves with a new generation of leadership. (U.S. Air Force photo by Airman 1st Class Donnell Schroeter)"
}
 */
