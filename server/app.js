require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const controller = require("./controller");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, callBackFn) => {
    callBackFn(null, "./public/Images");
  },
  filename: (req, file, callBackFn) => {
    callBackFn(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), controller.handleImageUpload);
app.post("/saveCoordinates", controller.saveCoordinates);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port} ...`);
});
