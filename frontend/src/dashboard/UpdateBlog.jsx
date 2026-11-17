import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import ImageCropper from "../components/ImageCropper";
import GlassCard from "../components/ui/GlassCard";
import GlassButton from "../components/ui/GlassButton";
import GlassBadge from "../components/ui/GlassBadge";
import SafeImage from "../components/ui/SafeImage";

const CATEGORIES = [
  "Technology",
  "Devotional",
  "Sports",
  "Tourism",
  "Entertainment",
  "Health",
  "Business",
  "Coding",
];

function UpdateBlog() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState(""); // file or URL string
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("write"); // 'write' | 'preview'

  // Cropper states
  const [openCrop, setOpenCrop] = useState(false);
  const [tempImage, setTempImage] = useState("");

  // Computed metrics
  const wordCount = about.trim() ? about.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem("jwt");
        const { data } = await axios.get(`/api/blogs/single-blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTitle(data?.title || "");
        setCategory(data?.category || "Technology");
        setAbout(data?.about || "");
        setBlogImage(data?.blogImage?.url || "");
        setBlogImagePreview(data?.blogImage?.url || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog data. Try again later.");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  // Handle Image Upload Preview (open crop modal)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image (JPEG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setTempImage(reader.result);
      setOpenCrop(true);
    };
  };

  // Crop done callback
  const handleCropDone = (file, previewUrl) => {
    setBlogImage(file);
    setBlogImagePreview(previewUrl);
    setTempImage("");
    setOpenCrop(false);
    toast.success("New cover image cropped & ready!");
  };

  // Quick formatting insertion
  const insertFormatting = (prefix, suffix = "") => {
    const textarea = document.getElementById("update-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = about.substring(start, end) || "text";
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newAbout =
      about.substring(0, start) + replacement + about.substring(end);
    setAbout(newAbout);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  // Handle Blog Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!title.trim() || !category || !about.trim()) {
      toast.error("Please fill all required fields!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", category);
    formData.append("about", about.trim());

    if (blogImage instanceof File) {
      formData.append("blogImage", blogImage);
    } else if (typeof blogImage === "string") {
      formData.append("blogImageURL", blogImage);
    }

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.put(`/api/blogs/update/${id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(data.message || "Story updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#332FD0] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading story for editing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
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

      {/* Navigation / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#332FD0] dark:text-[#B4B2FF] hover:text-[#FB2576] hover:underline mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Update Article
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Refine your story, update the cover imagery, or adjust the category.
          </p>
        </div>

        {/* View Switcher: Write vs Preview */}
        <div className="flex items-center p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/60 dark:border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === "write"
                ? "bg-gradient-to-r from-[#FB2576] to-[#3F0071] text-white shadow-sm shadow-[#FB2576]/30"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            ✏️ Edit Mode
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === "preview"
                ? "bg-gradient-to-r from-[#FB2576] to-[#3F0071] text-white shadow-sm shadow-[#FB2576]/30"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleUpdate}>
        {activeTab === "write" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Title, Cover Image, Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <GlassCard elevation="md" className="p-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="Enter title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-bold bg-transparent border-0 border-b border-gray-200 dark:border-white/10 pb-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#332FD0] transition"
                />
              </GlassCard>

              {/* Cover Image */}
              <GlassCard elevation="md" className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Cover Image
                  </label>
                  <label className="text-xs text-[#332FD0] dark:text-[#B4B2FF] font-semibold hover:text-[#FB2576] hover:underline cursor-pointer">
                    Replace Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative group rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-md">
                  <SafeImage
                    src={blogImagePreview || blogImage}
                    alt="Cover Preview"
                    type="cover"
                    fallbackSrc="/imgPL.webp"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/90 text-gray-900 text-xs font-semibold hover:bg-white shadow-lg transition">
                      Choose New Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </GlassCard>

              {/* Content & Markdown Toolbar */}
              <GlassCard elevation="md" className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-200/60 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Story Content
                  </span>

                  {/* Formatting tools */}
                  <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                    <button
                      type="button"
                      title="Bold"
                      onClick={() => insertFormatting("**", "**")}
                      className="p-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      title="Italic"
                      onClick={() => insertFormatting("*", "*")}
                      className="p-1.5 rounded-lg text-xs italic text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      title="Heading"
                      onClick={() => insertFormatting("\n### ", "\n")}
                      className="p-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      title="Quote"
                      onClick={() => insertFormatting("\n> ", "\n")}
                      className="p-1.5 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition"
                    >
                      ❝
                    </button>
                    <button
                      type="button"
                      title="Bullet list"
                      onClick={() => insertFormatting("\n- ", "\n")}
                      className="p-1.5 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      title="Code block"
                      onClick={() => insertFormatting("\n```\n", "\n```\n")}
                      className="p-1.5 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition"
                    >
                      &lt;/&gt;
                    </button>
                  </div>
                </div>

                <textarea
                  id="update-textarea"
                  rows={14}
                  placeholder="Update your story..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full bg-transparent border-0 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-base leading-relaxed resize-y"
                />

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200/60 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{about.length} characters</span>
                  </div>
                  <span>~{readingTime} min read</span>
                </div>
              </GlassCard>
            </div>

            {/* Right Col: Category & Save */}
            <div className="space-y-6">
              {/* Category */}
              <GlassCard elevation="md" className="p-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  Topic Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl text-left transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-[#3F0071] to-[#332FD0] text-white shadow-md shadow-[#332FD0]/25"
                            : "bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Action summary */}
              <GlassCard elevation="md" className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Update Actions
                </h3>

                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/50 dark:border-white/5">
                    <span>Status</span>
                    <GlassBadge variant="emerald" size="sm">
                      Published
                    </GlassBadge>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/50 dark:border-white/5">
                    <span>Target ID</span>
                    <span className="font-mono text-[10px] text-gray-500">
                      {id?.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span>Est. Reading Time</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {readingTime} min
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full justify-center shadow-lg shadow-[#332FD0]/25"
                    loading={loading}
                  >
                    💾 Save Changes
                  </GlassButton>
                  <GlassButton
                    type="button"
                    variant="ghost"
                    size="md"
                    className="w-full justify-center"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </GlassButton>
                </div>
              </GlassCard>
            </div>
          </div>
        ) : (
          /* Live Preview Mode */
          <GlassCard elevation="lg" className="p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <GlassBadge variant="indigo" size="md">
                {category || "Uncategorized"}
              </GlassBadge>
              <span className="text-xs text-gray-500">
                {readingTime} min read • Updated Preview
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {title || "Untitled Article Title"}
            </h1>

            {/* Cover image preview */}
            {(blogImagePreview || blogImage) && (
              <div className="rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-lg">
                <SafeImage
                  src={blogImagePreview || blogImage}
                  alt="Cover"
                  type="cover"
                  fallbackSrc="/imgPL.webp"
                  className="w-full h-80 object-cover"
                />
              </div>
            )}

            {/* Article body */}
            <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-base pt-4">
              {about || "No story content drafted yet."}
            </div>

            <div className="pt-6 border-t border-gray-200/60 dark:border-white/10 flex justify-end gap-3">
              <GlassButton
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setActiveTab("write")}
              >
                Back to Edit
              </GlassButton>
              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
              >
                Save Changes
              </GlassButton>
            </div>
          </GlassCard>
        )}
      </form>
    </div>
  );
}

export default UpdateBlog;
