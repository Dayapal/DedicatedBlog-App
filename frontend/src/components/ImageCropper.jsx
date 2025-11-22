import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

/**
 * Utility to create a cropped File from an image source and crop area.
 * Supports rotation.
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // compute bounding box of the rotated image
  const rotRad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rotRad));
  const cos = Math.abs(Math.cos(rotRad));
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  // set canvas to bounding box size
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate and rotate canvas to draw rotated image
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // Extract the cropped area from the rotated image
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // create a temporary canvas to place the extracted area with cropping offsets
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = pixelCrop.width;
  tmpCanvas.height = pixelCrop.height;
  const tmpCtx = tmpCanvas.getContext("2d");

  // Put the rotated image data into tmp canvas shifted by pixelCrop coords
  tmpCtx.putImageData(
    data,
    -pixelCrop.x,
    -pixelCrop.y
  );

  // Convert to blob -> File
  return new Promise((resolve, reject) => {
    tmpCanvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(new Error("Canvas is empty"));
        }
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        resolve(file);
      },
      "image/jpeg",
      0.95
    );
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}

/**
 * ImageCropper Props:
 * - imageSrc: data URL or url of image to crop
 * - onCancel: () => void
 * - onCropDone: async (file, previewUrl) => void
 */
export default function ImageCropper({ imageSrc, onCancel, onCropDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(16 / 9); // default rectangle
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      if (!croppedAreaPixels) {
        alert("Please select a crop area.");
        setLoading(false);
        return;
      }
      const file = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const previewUrl = URL.createObjectURL(file);
      await onCropDone(file, previewUrl);
    } catch (err) {
      console.error("Crop failed:", err);
      alert("Failed to crop image. See console for details.");
    } finally {
      setLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, rotation, onCropDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Crop Image</h3>
          <div>
            <button
              onClick={onCancel}
              className="px-3 py-1 mr-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Crop"}
            </button>
          </div>
        </div>

        {/* Aspect mode buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setAspect(16 / 9)}
            className={`px-3 py-1 rounded ${aspect === 16 / 9 ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Rectangle (16:9)
          </button>
          <button
            onClick={() => setAspect(1)}
            className={`px-3 py-1 rounded ${aspect === 1 ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Square (1:1)
          </button>
          <button
            onClick={() => setAspect(null)}
            className={`px-3 py-1 rounded ${aspect === null ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Free
          </button>
          <div className="ml-auto text-sm text-gray-600">Rotate & Zoom</div>
        </div>

        {/* Crop area */}
        <div className="relative w-full h-64 bg-gray-200 overflow-hidden rounded">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect === null ? undefined : aspect}
            onCropChange={setCrop}
            onZoomChange={(z) => setZoom(Number(z))}
            onRotationChange={(r) => setRotation(r)}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3">
            <label className="min-w-[60px] text-sm">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
            <div className="w-16 text-right text-sm">{zoom.toFixed(2)}x</div>
          </div>

          <div className="flex items-center gap-3">
            <label className="min-w-[60px] text-sm">Rotate</label>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1"
            />
            <div className="w-16 text-right text-sm">{rotation}°</div>
          </div>
        </div>
      </div>
    </div>
  );
}
