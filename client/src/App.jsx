import "./css/App.css";

import React, { useState, useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";

import ImageUpload from "./components/ImageUpload";
import Toolbar from "./components/Toolbar";
import Message from "./components/Message";

import { saveDrawingApi, handleImageUploadApi } from "./api.js";

function App() {
  const [image, setImage] = useState();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [drawing, setDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState([]);
  const [shapes, setShapes] = useState([]);

  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  const showTemporaryMessage = (text, type = "success", duration = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), duration);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");

    const drawImage = (img) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      shapes.forEach((shape) => {
        context.beginPath();
        context.moveTo(shape[0].x, shape[0].y);
        shape.forEach((coord) => {
          context.lineTo(coord.x, coord.y);
        });
        context.stroke();
      });
    };

    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      drawImage(img);
    };

    const handleMouseDown = (e) => {
      if (drawing) {
        drawingRef.current = true;
        const x = e.clientX - canvas.getBoundingClientRect().left;
        const y = e.clientY - canvas.getBoundingClientRect().top;
        setCurrentShape((prevPoints) => [...prevPoints, { x, y }]);
      }
    };

    const handleMouseMove = (e) => {
      if (drawingRef.current) {
        draw(e);
      }
    };

    const handleMouseUp = () => {
      if (currentShape.length > 0) {
        setShapes((prevShapes) => [...prevShapes, [...currentShape]]);
        setCurrentShape([]);
      }
      drawingRef.current = false;
    };

    const draw = (e) => {
      const x = e.clientX - canvas.getBoundingClientRect().left;
      const y = e.clientY - canvas.getBoundingClientRect().top;

      context.lineWidth = 3;
      context.lineCap = "round";
      context.strokeStyle = "#000";

      context.beginPath();
      context.moveTo(currentShape[0].x, currentShape[0].y);

      setCurrentShape((prevPoints) => [...prevPoints, { x, y }]);

      currentShape.forEach((point) => {
        context.lineTo(point.x, point.y);
        context.stroke();
      });
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drawing, currentShape, image, shapes]);

  const togglePencil = () => {
    setDrawing(true);
  };

  const toggleEraser = () => {
    setDrawing(false);
    setShapes([]);
  };

  const saveDrawing = async () => {
    await saveDrawingApi(image, shapes, showTemporaryMessage);

    setShapes([]);
  };

  const handleImageUpload = async (acceptedFiles) => {
    await handleImageUploadApi(acceptedFiles, setImage, showTemporaryMessage);
  };

  return (
    <div className="App">
      <div className="mainHeadEle">
        <h2>Sketch Recognition Lab - Demo App</h2>
      </div>

      <Container>
        <Row>
          <ImageUpload onImageUpload={handleImageUpload} />
        </Row>

        <Row style={{ margin: "2% 29%" }}>
          <div
            style={{
              height: "360px",
              width: "640px",
              backgroundColor: "#d3d3d3",
              border: "3px solid #000",
            }}
          >
            {image && (
              <canvas
                ref={(ref) => (canvasRef.current = ref)}
                width="640"
                height="360"
              />
            )}
          </div>
        </Row>

        <Row>
          <Toolbar togglePencil={togglePencil} toggleEraser={toggleEraser} />
        </Row>

        <Row>
          <div
            style={{
              margin: "1% 20%",
              textAlign: "center",
            }}
          >
            <button className="save-btn" onClick={saveDrawing}>
              Save
            </button>
          </div>
        </Row>

        <Row>
          <Message text={message.text} type={message.type} />
        </Row>
      </Container>
    </div>
  );
}

export default App;
