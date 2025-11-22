import axios from "axios";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropUtils";


function CreateBlog() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [isFocused, setIsFocused] = useState({
    title: false,
    category: false,
    about: false,
    image: false
  });

  // ---------------------- CROP STATES ----------------------
  const [cropModal, setCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [aspectRatioKey, setAspectRatioKey] = useState("16:9");
  const aspectMap = {
    "1:1": 1 / 1,
    "4:5": 4 / 5,
    "16:9": 16 / 9,
    free: undefined,
  };
  const aspect = aspectMap[aspectRatioKey];

  // ----------- Select Image + Open Crop Modal -------------
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image!");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setSelectedImage(reader.result);
      setCropModal(true);
    };
  };

  // ----------- Crop completion handler ------------
  const onCropComplete = useCallback((_, croppedAreaPx) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  // ----------- Apply Crop Function ------------
  const applyCrop = async () => {
    try {
      if (!selectedImage || !croppedAreaPixels) {
        toast.error("No crop area selected!");
        return;
      }

      const croppedDataUrl = await getCroppedImg(
        selectedImage,
        croppedAreaPixels,
        rotation
      );

      setBlogImagePreview(croppedDataUrl);

      // convert to file
      const blob = await fetch(croppedDataUrl).then((r) => r.blob());
      const file = new File(
        [blob],
        `cropped_${Date.now()}.jpg`,
        { type: "image/jpeg" }
      );

      setBlogImage(file);

      // close modal & reset
      setCropModal(false);
      setSelectedImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    } catch (err) {
      console.error(err);
      toast.error("Crop failed, please try again.");
    }
  };

  // -------------- Submit New Blog --------------
  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!title || !category || !about || !blogImage) {
      toast.error("Fill all fields & select an image!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);
    formData.append("blogImage", blogImage);

    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.post(
        "https://dedicatedblog-app-1.onrender.com/api/blogs/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message || "Blog Published!");

      setTitle("");
      setCategory("");
      setAbout("");
      setBlogImage("");
      setBlogImagePreview("");

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">

        {/* -------- FORM START -------- */}
        <form onSubmit={handleCreateBlog} className="space-y-6">

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Category</option>
            <option value="Devotional">Devotional</option>
            <option value="Sports">Sports</option>
            <option value="Tourism">Tourism</option>
            <option value="Technology">Technology</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
          </select>

          {/* Title */}
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />

          {/* Image Preview */}
          <img
            src={blogImagePreview || "/imgPL.webp"}
            className="w-full h-56 object-cover rounded-xl border"
            alt=""
          />

          {/* Upload Button */}
          <input
            type="file"
            accept="image/*"
            onChange={changePhotoHandler}
            className="w-full p-3 border rounded-xl"
          />

          {/* About */}
          <textarea
            className="w-full p-3 border rounded-xl"
            rows="6"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write your story..."
          ></textarea>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded-xl"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </form>

        {/* -------- CROP MODAL -------- */}
        {cropModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-4 rounded-xl w-full max-w-3xl">

              {/* Header */}
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-bold">Crop Image</h3>

                <div className="flex gap-2">
                  {["1:1", "4:5", "16:9", "free"].map((ratio) => (
                    <button
                      key={ratio}
                      className={`px-3 py-1 rounded border ${
                        aspectRatioKey === ratio
                          ? "bg-blue-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      onClick={() => setAspectRatioKey(ratio)}
                    >
                      {ratio}
                    </button>
                  ))}

                  <button
                    onClick={() => setCropModal(false)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Crop Area */}
              <div className="relative w-full h-[400px] rounded bg-gray-100 overflow-hidden">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Controls */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm">Rotate</label>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-end justify-end">
                  <button
                    onClick={applyCrop}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CreateBlog;
