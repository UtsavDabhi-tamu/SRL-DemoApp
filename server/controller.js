const path = require("path");
const fs = require("fs");

function handleImageUpload(req, res) {
  if (req.file && req.file.filename) {
    const imageUrl = `${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } else {
    res.status(500).json({ error: "Image upload failed" });
  }
}

function saveCoordinates(req, res) {
  const { imageName, coordinates } = req.body;

  if (!imageName || !coordinates || coordinates.length === 0) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const fileNameWithoutExtension = path.parse(imageName).name;
  const filePath = `./public/Images/${fileNameWithoutExtension}.txt`;

  const content = coordinates.map((coord, index) => ({
    index,
    coordinates: {
      topLeft: { x1: coord.x1, y1: coord.y1 },
      topRight: { x2: coord.x2, y2: coord.y2 },
      bottomRight: { x3: coord.x3, y3: coord.y3 },
      bottomLeft: { x4: coord.x4, y4: coord.y4 },

      width: coord.width,
      height: coord.height,
    },
  }));

  const finalData = {
    length: coordinates.length,
    rectangles: content,
  };

  const contentString = JSON.stringify(finalData, null, 2);

  fs.writeFile(filePath, contentString, (err) => {
    if (err) {
      console.error("Error saving coordinates:", err);
      return res.status(500).json({ error: "Error saving coordinates" });
    }

    res.status(200).json({ message: "Coordinates saved successfully" });
  });
}

module.exports = {
  handleImageUpload,
  saveCoordinates,
};
