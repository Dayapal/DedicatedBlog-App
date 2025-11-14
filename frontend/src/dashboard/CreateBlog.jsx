import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

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

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBlogImagePreview(reader.result);
      setBlogImage(file);
    };
    
    reader.onerror = () => {
      toast.error("Failed to load image. Please try another file.");
    };
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Enhanced validation
    if (!title.trim() || !category || !about.trim() || !blogImage) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", category);
    formData.append("about", about.trim());
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

      toast.success(data.message || "🎉 Blog published successfully!");
      
      // Reset form with smooth transition
      setTimeout(() => {
        setTitle("");
        setCategory("");
        setAbout("");
        setBlogImage("");
        setBlogImagePreview("");
      }, 300);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again. make user your blog should be more than 200 charchaters");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Story</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Craft your blog post with care. Your words have the power to inspire.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-all duration-300 hover:shadow-md">
          <form onSubmit={handleCreateBlog} className="space-y-8">
            {/* Category Field */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-gray-800 items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Category
                <span className="text-red-400 text-sm font-normal">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onFocus={() => handleFocus('category')}
                onBlur={() => handleBlur('category')}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none
                  ${isFocused.category ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                  ${!category ? 'text-gray-400' : 'text-gray-900'}`}
              >
                <option value="" disabled>Choose a category that fits your story</option>
                <option value="Devotional">🙏 Devotional</option>
                <option value="Sports">⚽ Sports</option>
                <option value="Tourism">🌍 Tourism</option>
                <option value="Technology">💻 Technology</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Health">💊 Health</option>
                <option value="Business">💼 Business</option>
              </select>
            </div>

            {/* Title Field */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-gray-800 items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Blog Title
                <span className="text-red-400 text-sm font-normal">*</span>
              </label>
              <input
                type="text"
                placeholder="Catchy title that captures attention..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => handleFocus('title')}
                onBlur={() => handleBlur('title')}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none placeholder-gray-400
                  ${isFocused.title ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                maxLength={100}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Make it engaging and descriptive</span>
                <span>{title.length}/100</span>
              </div>
            </div>

            {/* Image Upload Field */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-gray-800 items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Featured Image
                <span className="text-red-400 text-sm font-normal">*</span>
              </label>
              
              {/* Image Preview */}
              <div className="flex flex-col items-center space-y-4">
                <div className={`relative w-full max-w-md rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-300
                  ${blogImagePreview ? 'border-transparent' : isFocused.image ? 'border-blue-300 bg-blue-25' : 'border-gray-200 hover:border-gray-300'}`}>
                  <img
                    src={blogImagePreview || "/imgPL.webp"}
                    alt="Blog preview"
                    className={`w-full h-48 object-cover transition-all duration-500 ${blogImagePreview ? 'scale-100' : 'scale-105 opacity-60'}`}
                  />
                  {!blogImagePreview && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-center px-4">Click to upload a stunning featured image</p>
                    </div>
                  )}
                </div>

                <label className={`cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                  ${blogImagePreview ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {blogImagePreview ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changePhotoHandler}
                    onFocus={() => handleFocus('image')}
                    onBlur={() => handleBlur('image')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* About Field */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-gray-800 items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Your Story
                <span className="text-red-400 text-sm font-normal">*</span>
              </label>
              <textarea
                rows="6"
                placeholder="Share your thoughts, experiences, and insights... Let your creativity flow."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                onFocus={() => handleFocus('about')}
                onBlur={() => handleBlur('about')}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none resize-none placeholder-gray-400
                  ${isFocused.about ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                maxLength={2000}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Express yourself clearly and authentically</span>
                <span>{about.length}/2000</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                ${loading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl text-white'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Publishing Your Story...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Publish Your Blog
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need inspiration? Take a deep breath and share what matters to you. ✨
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;