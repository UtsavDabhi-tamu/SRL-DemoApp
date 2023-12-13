import React from "react";
import Dropzone from "react-dropzone";

function ImageUpload({ onImageUpload }) {
  return (
    <Dropzone onDrop={onImageUpload}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          style={{
            margin: "1% 20%",
            border: "2px solid #000",
            textAlign: "center",
          }}
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop an image file here, or click to select one</p>
        </div>
      )}
    </Dropzone>
  );
}

export default ImageUpload;
