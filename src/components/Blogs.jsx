import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";

const Blogs = () => {
    const [blogTitle, setBlogTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");
    const [keywords, setKeywords] = useState("");
    const [titleImageFile, setTitleImageFile] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [description, setDescription] = useState("");
    const [points, setPoints] = useState([{ title: "", text: "" }]);
    const [submitting, setSubmitting] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadBlogs = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await apiClient.get("/blogs");
            setBlogs(res.data || []);
        } catch (err) {
            console.error("Failed to load blogs", err);
            setError("Unable to load blogs. Please check the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBlogs();
    }, []);

    const handleAddPointRow = () => {
        setPoints((prev) => [...prev, { title: "", text: "" }]);
    };

    const handlePointChange = (index, field, value) => {
        setPoints((prev) =>
            prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
        );
    };

    const handleRemovePoint = (index) => {
        setPoints((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("blog_title", blogTitle);
            if (author) formData.append("author", author);
            if (category) formData.append("category", category);
            if (keywords) formData.append("blog_keywords", keywords);
            formData.append("blog_description", description);

            const normalizedPoints = points
                .filter((p) => p.title.trim() || p.text.trim())
                .map((p, idx) => ({
                    title: p.title || `Point ${idx + 1}`,
                    text: p.text,
                }));
            if (normalizedPoints.length) {
                formData.append("blog_points", JSON.stringify(normalizedPoints));
            }

            if (titleImageFile) {
                formData.append("title_image", titleImageFile);
            }
            imageFiles.forEach((file) => {
                formData.append("images", file);
            });

            await apiClient.post("/blogs", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setBlogTitle("");
            setAuthor("");
            setCategory("");
            setKeywords("");
            setTitleImageFile(null);
            setImageFiles([]);
            setDescription("");
            setPoints([{ title: "", text: "" }]);

            await loadBlogs();
        } catch (err) {
            console.error("Failed to create blog", err);
            setError("Unable to create blog. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
            <form className="bg-[#0a0a0a] rounded-lg border border-white/10 p-8" onSubmit={handleSubmit}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="text-lg font-semibold text-white">Create Blog</div>
                        <div className="text-sm text-[#a0a0a0] mt-2 leading-relaxed">
                            Add a new blog post that will appear on the public website.
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="text-[#e5e5e5] font-medium">Title *</span>
                        <input
                            className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white text-sm outline-none transition-all focus:border-white focus:bg-[#0a0a0a] placeholder:text-[#666666]"
                            value={blogTitle}
                            onChange={(e) => setBlogTitle(e.target.value)}
                            placeholder="AI Readiness: Are You Ready for Intelligent Automation?"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="text-[#e5e5e5] font-medium">Author</span>
                        <input
                            className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white text-sm outline-none transition-all focus:border-white focus:bg-[#0a0a0a] placeholder:text-[#666666]"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Phoenix Baker"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="text-[#e5e5e5] font-medium">Category</span>
                        <input
                            className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white text-sm outline-none transition-all focus:border-white focus:bg-[#0a0a0a] placeholder:text-[#666666]"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="AI & Automation, Digital Trends, Informatica…"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="text-[#e5e5e5] font-medium">Keywords / Tags</span>
                        <span className="text-xs text-[#808080]">
                            Comma separated — e.g. data, ai, integration, readiness
                        </span>
                        <input
                            className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white text-sm outline-none transition-all focus:border-white focus:bg-[#0a0a0a] placeholder:text-[#666666]"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="data, ai, integration, readiness"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="text-[#e5e5e5] font-medium">Title Image (upload from device)</span>
                        <span className="text-xs text-[#808080]">
                            This will be used as the hero / thumbnail on the public site.
                        </span>
                        <input
                            className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white text-sm outline-none transition-all focus:border-white focus:bg-[#0a0a0a] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-[#e5e5e5] file:cursor-pointer"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                setTitleImageFile(file || null);
                            }}
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="text-[#e5e5e5] font-medium">Additional Images (optional)</span>
                        <span className="text-xs text-[#808080]">
                            Select one or more extra images from your device.
                        </span>
                        <input
                            className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white text-sm outline-none transition-all focus:border-white focus:bg-[#0a0a0a] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-[#e5e5e5] file:cursor-pointer"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                setImageFiles(files);
                            }}
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="text-[#e5e5e5] font-medium">Short Description / Intro *</span>
                        <span className="text-xs text-[#808080]">
                            This appears as the description on listing cards and at the top of the blog visit page.
                        </span>
                        <textarea
                            className="w-full min-h-[120px] rounded-md border border-white/15 bg-black px-4 py-3 text-white text-sm outline-none transition-all focus:border-white focus:bg-[#0a0a0a] placeholder:text-[#666666] leading-relaxed resize-vertical"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A concise summary of what this article is about…"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="text-[#e5e5e5] font-medium">Structured Points</span>
                        <span className="text-xs text-[#808080]">
                            Create numbered sections like "1. Point title" and its supporting content. These feed into the key points on the blog detail page.
                        </span>
                        <div className="flex flex-col gap-4 mt-2">
                            {points.map((p, idx) => (
                                <div key={idx} className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr_auto] gap-3 items-start">
                                    <input
                                        className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white text-sm outline-none transition-all focus:border-white focus:bg-[#0a0a0a] placeholder:text-[#666666]"
                                        placeholder={`Point ${idx + 1} title`}
                                        value={p.title}
                                        onChange={(e) => handlePointChange(idx, "title", e.target.value)}
                                    />
                                    <textarea
                                        className="w-full min-h-[48px] rounded-md border border-white/15 bg-black px-4 py-3 text-white text-sm outline-none transition-all focus:border-white focus:bg-[#0a0a0a] placeholder:text-[#666666] leading-relaxed resize-vertical"
                                        placeholder="Content explaining this point…"
                                        value={p.text}
                                        onChange={(e) => handlePointChange(idx, "text", e.target.value)}
                                    />
                                    {points.length > 1 && (
                                        <button
                                            type="button"
                                            className="rounded-md border border-white/20 bg-transparent text-[#a0a0a0] px-4 py-3 text-sm cursor-pointer transition-all hover:border-[#ff4444] hover:text-[#ff4444] hover:bg-[#ff4444]/10 whitespace-nowrap"
                                            onClick={() => handleRemovePoint(idx)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="rounded-md border border-white/20 bg-transparent text-[#a0a0a0] px-5 py-2.5 text-sm cursor-pointer transition-all hover:border-white/40 hover:text-white hover:bg-[#111111] self-start"
                                onClick={handleAddPointRow}
                            >
                                + Add another point
                            </button>
                        </div>
                    </label>
                </div>

                {error && (
                    <p className="text-[#ff4444] text-sm mt-4">{error}</p>
                )}

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-white bg-white text-black px-6 py-3 text-sm font-medium cursor-pointer transition-all hover:bg-[#e5e5e5] hover:border-[#e5e5e5] disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={submitting}
                    >
                        {submitting ? "Saving…" : "Publish Blog"}
                    </button>
                    <button
                        type="button"
                        className="rounded-md border border-white/20 bg-transparent text-[#a0a0a0] px-5 py-2.5 text-sm cursor-pointer transition-all hover:border-white/40 hover:text-white hover:bg-[#111111]"
                        onClick={loadBlogs}
                        disabled={loading}
                    >
                        {loading ? "Refreshing…" : "Refresh list"}
                    </button>
                </div>
            </form>

            <div className="bg-[#0a0a0a] rounded-lg border border-white/10 p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="text-lg font-semibold text-white">Existing Blogs</div>
                        <div className="text-sm text-[#a0a0a0] mt-2 leading-relaxed">
                            These posts are fetched live from the same API used by the public site.
                        </div>
                    </div>
                    <span className="inline-flex items-center rounded px-3 py-1 text-xs bg-[#111111] text-[#a0a0a0] border border-white/10 font-medium">
                        {blogs?.length || 0} {blogs?.length === 1 ? "entry" : "entries"}
                    </span>
                </div>

                {loading && !blogs.length ? (
                    <p className="text-sm text-[#666666] p-8 text-center">Loading blogs…</p>
                ) : blogs.length === 0 ? (
                    <p className="text-sm text-[#666666] p-8 text-center">
                        No blogs yet. Create your first post using the form on the left.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4 mt-2">
                        {blogs.map((b) => (
                            <div
                                key={b.id}
                                className="rounded-md border border-white/10 bg-black px-6 py-5 flex flex-col gap-3 transition-all hover:border-white/20 hover:bg-[#0a0a0a]"
                            >
                                <div className="flex justify-between items-center gap-4">
                                    <div>
                                        <div className="text-base font-medium text-white">{b.title}</div>
                                        <div className="text-xs text-[#808080] mt-1">
                                            {b.author || "Inflecto"} · {b.category || "Uncategorised"}
                                        </div>
                                    </div>
                                </div>
                                {b.description && (
                                    <p className="text-sm text-[#a0a0a0] mt-1">{b.description}</p>
                                )}
                                {Array.isArray(b.tags) && b.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {b.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="rounded px-2.5 py-1 text-xs bg-[#111111] text-[#e5e5e5] border border-white/10"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
