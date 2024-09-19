import { base64ToBlob } from "./ImageUtils";

export const toFormData = (image) => {
    const formData = new FormData();
    const blob = base64ToBlob(image.uri, image.mimeType); // Ensure correct usage here
    formData.append("image", blob, image.fileName);
    return formData;
  };