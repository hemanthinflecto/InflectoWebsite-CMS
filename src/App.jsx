import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import apiClient from "./apiClient";

const Dashboard = () => {
  return (
    <div className="cms-card">
      <div className="cms-card-header">
        <div>
          <div className="cms-card-title">Overview</div>
          <div className="cms-card-subtitle">
            Lightweight CMS for Inflecto marketing content.
          </div>
        </div>
        <span className="cms-badge">Internal · CMS</span>
      </div>
      <p className="cms-card-subtitle">
        Use the navigation on the left to manage your blog content. New posts
        created here will automatically flow into the public{" "}
        <strong>Blog</strong> page on the main Inflecto website.
      </p>
    </div>
  );
};

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
    <div className="cms-grid">
      <form className="cms-card" onSubmit={handleSubmit}>
        <div className="cms-card-header">
          <div>
            <div className="cms-card-title">Create Blog</div>
            <div className="cms-card-subtitle">
              Add a new blog post that will appear on the public website.
            </div>
          </div>
        </div>

        <div>
          <label className="cms-label">
            <span>Title *</span>
            <input
              className="cms-input"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="AI Readiness: Are You Ready for Intelligent Automation?"
              required
            />
          </label>

          <label className="cms-label">
            <span>Author</span>
            <input
              className="cms-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Phoenix Baker"
            />
          </label>

          <label className="cms-label">
            <span>Category</span>
            <input
              className="cms-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="AI & Automation, Digital Trends, Informatica…"
            />
          </label>

          <label className="cms-label">
            <span>Keywords / Tags</span>
            <span className="cms-label-hint">
              Comma separated — e.g. data, ai, integration, readiness
            </span>
            <input
              className="cms-input"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="data, ai, integration, readiness"
            />
          </label>

          <label className="cms-label">
            <span>Title Image (upload from device)</span>
            <span className="cms-label-hint">
              This will be used as the hero / thumbnail on the public site.
            </span>
            <input
              className="cms-input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setTitleImageFile(file || null);
              }}
            />
          </label>

          <label className="cms-label">
            <span>Additional Images (optional)</span>
            <span className="cms-label-hint">
              Select one or more extra images from your device.
            </span>
            <input
              className="cms-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setImageFiles(files);
              }}
            />
          </label>

          <label className="cms-label">
            <span>Short Description / Intro *</span>
            <span className="cms-label-hint">
              This appears as the description on listing cards and at the top of
              the blog visit page.
            </span>
            <textarea
              className="cms-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A concise summary of what this article is about…"
              required
            />
          </label>

          <label className="cms-label">
            <span>Structured Points</span>
            <span className="cms-label-hint">
              Create numbered sections like &quot;1. Point title&quot; and its
              supporting content. These feed into the key points on the blog
              detail page.
            </span>
            <div className="cms-points-group">
              {points.map((p, idx) => (
                <div key={idx} className="cms-point-row">
                  <input
                    className="cms-input"
                    placeholder={`Point ${idx + 1} title`}
                    value={p.title}
                    onChange={(e) =>
                      handlePointChange(idx, "title", e.target.value)
                    }
                  />
                  <textarea
                    className="cms-textarea"
                    placeholder="Content explaining this point…"
                    value={p.text}
                    onChange={(e) =>
                      handlePointChange(idx, "text", e.target.value)
                    }
                  />
                  {points.length > 1 && (
                    <button
                      type="button"
                      className="cms-point-remove"
                      onClick={() => handleRemovePoint(idx)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="cms-btn-ghost"
                onClick={handleAddPointRow}
              >
                + Add another point
              </button>
            </div>
          </label>
        </div>

        {error && (
          <p style={{ color: "#f97373", fontSize: "0.8rem", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
          <button
            type="submit"
            className="cms-btn-primary"
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Publish Blog"}
          </button>
          <button
            type="button"
            className="cms-btn-ghost"
            onClick={loadBlogs}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh list"}
          </button>
        </div>
      </form>

      <div className="cms-card">
        <div className="cms-card-header">
          <div>
            <div className="cms-card-title">Existing Blogs</div>
            <div className="cms-card-subtitle">
              These posts are fetched live from the same API used by the public
              site.
            </div>
          </div>
          <span className="cms-badge">
            {blogs?.length || 0} {blogs?.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {loading && !blogs.length ? (
          <p className="cms-empty">Loading blogs…</p>
        ) : blogs.length === 0 ? (
          <p className="cms-empty">
            No blogs yet. Create your first post using the form on the left.
          </p>
        ) : (
          <div className="cms-list">
            {blogs.map((b) => (
              <div key={b.id} className="cms-list-item">
                <div className="cms-list-item-header">
                  <div>
                    <div className="cms-list-item-title">{b.title}</div>
                    <div className="cms-list-item-meta">
                      {b.author || "Inflecto"} ·{" "}
                      {b.category || "Uncategorised"}
                    </div>
                  </div>
                </div>
                {b.description && (
                  <p
                    className="cms-card-subtitle"
                    style={{ marginTop: "0.25rem" }}
                  >
                    {b.description}
                  </p>
                )}
                {Array.isArray(b.tags) && b.tags.length > 0 && (
                  <div className="cms-list-item-tags">
                    {b.tags.map((tag, i) => (
                      <span key={i} className="cms-tag">
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

const Careers = () => {
  return (
    <div className="cms-card">
      <div className="cms-card-header">
        <div>
          <div className="cms-card-title">Careers</div>
          <div className="cms-card-subtitle">
            Static explanation / placeholder for future job posting
            integration.
          </div>
        </div>
      </div>
      <p className="cms-card-subtitle">
        This section is reserved for a future integration with a careers / ATS
        system. For now you can treat it as a static page to keep your team
        aligned on how roles will be published and managed.
      </p>
    </div>
  );
};

const AppShell = () => {
  const location = useLocation();
  const title = useMemo(() => {
    if (location.pathname.startsWith("/blogs")) return "Blogs";
    if (location.pathname.startsWith("/careers")) return "Careers";
    return "Dashboard";
  }, [location.pathname]);

  const subtitle = useMemo(() => {
    if (location.pathname.startsWith("/blogs"))
      return "Create and manage content for the public blog.";
    if (location.pathname.startsWith("/careers"))
      return "Placeholder for upcoming careers & job posting tools.";
    return "Simple CMS to manage Inflecto marketing content.";
  }, [location.pathname]);

  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <div className="cms-logo">
          Inflecto <span className="cms-logo-accent">CMS</span>
        </div>
        <nav className="cms-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "cms-nav-link" + (isActive ? " active" : "")
            }
          >
            <span className="cms-dot" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              "cms-nav-link" + (isActive ? " active" : "")
            }
          >
            <span className="cms-dot" />
            <span>Blogs</span>
          </NavLink>
          <NavLink
            to="/careers"
            className={({ isActive }) =>
              "cms-nav-link" + (isActive ? " active" : "")
            }
          >
            <span className="cms-dot" />
            <span>Careers</span>
          </NavLink>
        </nav>
        <div className="cms-footer">
          Connected to: <code>/api/blogs</code>
        </div>
      </aside>

      <main className="cms-main">
        <header className="cms-main-header">
          <div>
            <div className="cms-main-title">{title}</div>
            <div className="cms-main-subtitle">{subtitle}</div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppShell;
