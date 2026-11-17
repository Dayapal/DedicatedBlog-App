import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ImageCropper from "../components/ImageCropper";
import GlassCard from "../components/ui/GlassCard";
import GlassButton from "../components/ui/GlassButton";
import GlassBadge from "../components/ui/GlassBadge";
import SafeImage from "../components/ui/SafeImage";
import { useAuth } from "../context/AuthProvider";

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

function CreateBlog() {
  const { profile } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("write"); // 'write' | 'preview'

  // Cropper states
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  // Computed metrics
  const wordCount = about.trim() ? about.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Handle file select
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image (JPEG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setTempImageSrc(reader.result);
      setIsCropOpen(true);
    };
  };

  // Handle crop finish
  const handleCropComplete = (croppedFile, previewUrl) => {
    setBlogImage(croppedFile);
    setBlogImagePreview(previewUrl);
    setTempImageSrc(null);
    setIsCropOpen(false);
    toast.success("Cover image cropped & attached!");
  };

  // Quick formatting toolbar insertion
  const insertFormatting = (prefix, suffix = "") => {
    const textarea = document.getElementById("story-textarea");
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

  // Submit handler
  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!title.trim()) {
      toast.error("Please provide an article title.");
      return;
    }
    if (!category) {
      toast.error("Please select a topic category.");
      return;
    }
    if (!about.trim()) {
      toast.error("Please write the story content.");
      return;
    }
    if (!blogImage) {
      toast.error("Please upload a cover image for your article.");
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

      const { data } = await axios.post("/api/blogs/create", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message || "Story published successfully! 🎉");

      // Reset form
      setTitle("");
      setCategory("Technology");
      setAbout("");
      setBlogImage(null);
      setBlogImagePreview("");
      setActiveTab("write");
    } catch (error) {
      console.error("Create blog error:", error);
      toast.error(
        error.response?.data?.message || "Failed to publish article. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Cropper Modal */}
      {isCropOpen && tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onCancel={() => {
            setIsCropOpen(false);
            setTempImageSrc(null);
          }}
          onCropDone={handleCropComplete}
        />
      )}

      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FB2576] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#332FD0] dark:text-[#B4B2FF]">
              Editorial Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Draft a New Story
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Share your technical insights, tutorials, or perspectives with the community.
          </p>
        </div>

        {/* Segmented View Switcher: Write vs Preview */}
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
            ✏️ Write
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

      {/* Main Workspace */}
      <form onSubmit={handleCreateBlog}>
        {activeTab === "write" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Title, Cover Image, Story Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Story Title */}
              <GlassCard elevation="md" className="p-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Architecting Scalable Glassmorphism Interfaces with Tailwind CSS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-bold bg-transparent border-0 border-b border-gray-200 dark:border-white/10 pb-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#332FD0] transition"
                />
              </GlassCard>

              {/* Cover Image Upload Area */}
              <GlassCard elevation="md" className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Cover Image
                  </label>
                  {blogImagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setBlogImage(null);
                        setBlogImagePreview("");
                      }}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Remove Cover
                    </button>
                  )}
                </div>

                {blogImagePreview ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-md">
                    <img
                      src={blogImagePreview}
                      alt="Cover Preview"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/90 text-gray-900 text-xs font-semibold hover:bg-white shadow-lg transition">
                        Replace Cover
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-white/15 rounded-2xl cursor-pointer hover:border-[#332FD0] bg-black/[0.02] dark:bg-white/[0.02] transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#332FD0]/10 text-[#332FD0] flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Click to upload high-res cover
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG or WebP (interactive crop enabled)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </GlassCard>

              {/* Story Content & Markdown Toolbar */}
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
                  id="story-textarea"
                  rows={12}
                  placeholder="Tell your story... You can use paragraphs, lists, and markdown formatting to structure your thoughts."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full bg-transparent border-0 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-base leading-relaxed resize-y"
                />

                {/* Footer Metrics */}
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

            {/* Right Col: Category, Metadata, Publishing Panel */}
            <div className="space-y-6">
              {/* Category Card */}
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

              {/* Editorial Summary Card */}
              <GlassCard elevation="md" className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Publishing Overview
                </h3>

                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/50 dark:border-white/5">
                    <span>Author</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {profile?.user?.name || "You"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/50 dark:border-white/5">
                    <span>Status</span>
                    <GlassBadge variant="indigo" size="sm">
                      Ready to Publish
                    </GlassBadge>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/50 dark:border-white/5">
                    <span>Visibility</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Public (Explore feed)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span>Est. Reading Time</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {readingTime} min
                    </span>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full justify-center shadow-lg shadow-[#332FD0]/25"
                    loading={loading}
                  >
                    🚀 Publish Story Now
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
                {readingTime} min read • Preview Mode
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {title || "Untitled Article Title"}
            </h1>

            {/* Author bar */}
            <div className="flex items-center gap-3 pt-2">
              <SafeImage
                src={profile?.photo?.url || profile?.user?.photo?.url}
                alt={profile?.name || profile?.user?.name || "Author"}
                type="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#332FD0]/40"
              />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {profile?.name || profile?.user?.name || "Author Name"}
                </p>
                <p className="text-xs text-gray-500">
                  Published Today • Just now
                </p>
              </div>
            </div>

            {/* Cover image preview */}
            {blogImagePreview && (
              <div className="rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-lg">
                <img
                  src={blogImagePreview}
                  alt="Cover"
                  className="w-full h-80 object-cover"
                />
              </div>
            )}

            {/* Article body */}
            <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-base pt-4">
              {about || "No story content drafted yet. Switch back to 'Write' to start authoring!"}
            </div>

            <div className="pt-6 border-t border-gray-200/60 dark:border-white/10 flex justify-end">
              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
              >
                Publish This Story
              </GlassButton>
            </div>
          </GlassCard>
        )}
      </form>
    </div>
  );
}

export default CreateBlog;
