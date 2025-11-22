// src/utils/cropUtils.js

export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const rotationRadians = (rotation * Math.PI) / 180;

  const sin = Math.abs(Math.sin(rotationRadians));
  const cos = Math.abs(Math.cos(rotationRadians));

  // Calculate bounding box of rotated image
  const newWidth = image.width * cos + image.height * sin;
  const newHeight = image.width * sin + image.height * cos;

  canvas.width = newWidth;
  canvas.height = newHeight;

  // Move to center to rotate
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(rotationRadians);

  // Draw the rotated image
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // Get rotated image data
  const data = ctx.getImageData(0, 0, newWidth, newHeight);

  // Create new canvas for cropped area
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = pixelCrop.width;
  cropCanvas.height = pixelCrop.height;
  const cropCtx = cropCanvas.getContext("2d");

  cropCtx.putImageData(
    data,
    -pixelCrop.x,
    -pixelCrop.y
  );

  return new Promise((resolve) => {
    cropCanvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
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
    img.onerror = reject;
  });
}
