export const base64ToBlob = (dataURI, contentType = "image/png") => {
    const base64String = dataURI.split(",")[1]; // Ensure base64String is correctly extracted
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };