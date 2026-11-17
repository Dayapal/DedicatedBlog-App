import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import GlassButton from "./ui/GlassButton";

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
        const file = new File([blob], `cropped_${Date.now()}.jpg`, { type: "image/jpeg" });
        resolve(file);
      },
      "image/jpeg",
      0.92
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
  const [aspect, setAspect] = useState(16 / 9); // default editorial 16:9
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const ratios = [
    { label: "16:9 Editorial", value: 16 / 9 },
    { label: "4:3 Standard", value: 4 / 3 },
    { label: "1:1 Square", value: 1 },
    { label: "Free Form", value: null },
  ];

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      if (!croppedAreaPixels) {
        setLoading(false);
        return;
      }
      const file = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const previewUrl = URL.createObjectURL(file);
      await onCropDone(file, previewUrl);
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, rotation, onCropDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white/90 dark:bg-[#161726]/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl p-6 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 dark:border-white/10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Crop & Align Cover Image
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Drag to re-center. Zoom or rotate to fit your cover layout.
            </p>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Aspect Ratio Segmented Control */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Aspect Ratio:
          </span>
          <div className="flex items-center p-1 rounded-2xl bg-gray-100/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
            {ratios.map((r) => {
              const active = aspect === r.value;
              return (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setAspect(r.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-xl transition-all ${
                    active
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Crop Canvas */}
        <div className="relative w-full h-72 sm:h-80 bg-gray-900 rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-inner">
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

        {/* Fine Controls: Zoom & Rotate Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
              <span>Zoom</span>
              <span>{zoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
              <span>Rotation</span>
              <span>{rotation}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-gray-200/60 dark:border-white/10">
          <GlassButton
            type="button"
            variant="ghost"
            size="md"
            onClick={onCancel}
          >
            Cancel
          </GlassButton>
          <GlassButton
            type="button"
            variant="primary"
            size="md"
            onClick={handleSave}
            loading={loading}
          >
            Apply & Crop
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
