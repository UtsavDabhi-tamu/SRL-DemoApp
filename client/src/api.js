export const saveDrawingApi = async (image, shapes, showTemporaryMessage) => {
  if (shapes.length === 0) {
    return;
  }

  const boundingRectangles = shapes.map((shape) => {
    if (shape.length === 0) {
      return null;
    }

    let minX = shape[0].x;
    let minY = shape[0].y;
    let maxX = shape[0].x;
    let maxY = shape[0].y;

    shape.forEach((coord) => {
      minX = Math.min(minX, coord.x);
      minY = Math.min(minY, coord.y);
      maxX = Math.max(maxX, coord.x);
      maxY = Math.max(maxY, coord.y);
    });

    return {
      x1: minX,
      y1: minY,
      x2: maxX,
      y2: minY,
      x3: maxX,
      y3: maxY,
      x4: minX,
      y4: maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  });

  const filteredRectangles = boundingRectangles.filter((rect) => rect !== null);

  if (filteredRectangles.length > 0) {
    const imageName = image.split("/").pop();

    try {
      const response = await fetch("http://localhost:5000/saveCoordinates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName,
          coordinates: filteredRectangles,
        }),
      });

      if (response.ok) {
        showTemporaryMessage("Coordinates saved successfully", "success");
      } else {
        showTemporaryMessage("Failed to save coordinates", "error");
      }
    } catch (error) {
      showTemporaryMessage("Error saving coordinates", "error");
      console.error("Error saving coordinates:", error);
    }
  }

  return [];
};

export const handleImageUploadApi = async (
  acceptedFiles,
  setImage,
  showTemporaryMessage
) => {
  const formData = new FormData();
  formData.append("image", acceptedFiles[0]);

  try {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const { imageUrl } = await response.json();
      setImage(`http://localhost:5000/Images/${imageUrl}`);
      showTemporaryMessage("Image uploaded successfully", "success");
    } else {
      showTemporaryMessage("Image upload failed", "error");
    }
  } catch (error) {
    showTemporaryMessage("Error uploading image", "error");
    console.error("Error uploading image:", error);
  }
};
