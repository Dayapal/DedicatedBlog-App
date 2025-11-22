import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageCropper from "../components/ImageCropper";


function UpdateBlog() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState(""); // can be file or URL string
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [loading, setLoading] = useState(false); // disable button during request

  // cropper modal states
  const [openCrop, setOpenCrop] = useState(false);
  const [tempImage, setTempImage] = useState(""); // dataURL for cropping

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const { data } = await axios.get(
          `https://dedicatedblog-app-1.onrender.com/api/blogs/single-blog/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTitle(data?.title || "");
        setCategory(data?.category || "");
        setAbout(data?.about || "");
        setBlogImage(data?.blogImage?.url || "");
        setBlogImagePreview(data?.blogImage?.url || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog data. Try again later.");
      }
    };
    fetchBlog();
  }, [id]);

  // Handle Image Upload Preview (open crop modal)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setTempImage(reader.result);
      setOpenCrop(true);
    };
  };

  // callback from ImageCropper when user saves crop
  const handleCropDone = (file, previewUrl) => {
    // file is a File object ready to upload
    setBlogImage(file);
    setBlogImagePreview(previewUrl);
    setTempImage("");
    setOpenCrop(false);
  };

  // Handle Blog Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent multiple clicks
    setLoading(true);

    if (!title || !category || !about) {
      toast.error("Please fill all required fields!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);

    if (blogImage instanceof File) {
      formData.append("blogImage", blogImage);
    } else if (typeof blogImage === "string") {
      // If backend supports receiving URL instead of file:
      formData.append("blogImageURL", blogImage);
    }

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.put(
        `https://dedicatedblog-app-1.onrender.com/api/blogs/update/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Blog updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-9">
      {/* Crop modal */}
      {openCrop && tempImage && (
        <ImageCropper
          imageSrc={tempImage}
          onCancel={() => {
            setTempImage("");
            setOpenCrop(false);
          }}
          onCropDone={handleCropDone}
        />
      )}

      <section className="bg-white shadow-lg rounded-2xl max-w-2xl w-full p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-6">
          Update Blog
        </h1>

        <form className="space-y-5" onSubmit={handleUpdate}>
          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="">Select Category</option>
              <option value="Devotional">Devotional</option>
              <option value="Sports">Sports</option>
              <option value="Coding">Coding</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Business">Business</option>
              <option value="Tourism">Tourism</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
            </select>
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Blog Title</label>
            <input
              type="text"
              placeholder="Enter main title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Blog Image</label>
            <div className="mb-3">
              <img
                src={blogImagePreview || blogImage || "/imgPL.webp"}
                alt="Blog Preview"
                className="w-full h-56 object-cover rounded-xl border border-gray-200 shadow-sm"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <p className="text-sm text-gray-500 mt-2">
              After selecting file you'll get options to crop, zoom, rotate, and save.
            </p>
          </div>

          {/* About */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">About</label>
            <textarea
              rows="6"
              placeholder="Write something about your blog (at least 200 characters)"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            ></textarea>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl text-white font-semibold transition 
                        ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default UpdateBlog;
