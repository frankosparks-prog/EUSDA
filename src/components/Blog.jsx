import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet-async";
import {
  Heart,
  MessageCircle,
  Send,
  User,
  PenTool,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // ✅ Submission State
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [newPost, setNewPost] = useState({
    name: "",
    role: "",
    quote: "",
    image: null,
  });

  // ✅ Comment State
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic" });
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    fetch(`${SERVER_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setBlogs(sorted);
      })
      .catch((err) => console.error("Failed to fetch blogs", err))
      .finally(() => setLoading(false));
  };

  // ✅ Handle Like
  const handleLike = async (e, blogId) => {
    e.stopPropagation();
    const storageKey = `liked_${blogId}`;
    if (localStorage.getItem(storageKey)) return;

    try {
      const res = await fetch(`${SERVER_URL}/api/blog/${blogId}/like`, {
        method: "PUT",
      });
      if (res.ok) {
        localStorage.setItem(storageKey, "true");
        // Optimistic UI Update
        setBlogs((prev) =>
          prev.map((b) =>
            b._id === blogId ? { ...b, likes: (b.likes || 0) + 1 } : b,
          ),
        );
        if (selectedBlog && selectedBlog._id === blogId) {
          setSelectedBlog((prev) => ({
            ...prev,
            likes: (prev.likes || 0) + 1,
          }));
        }
      }
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  // ✅ Handle Comment Submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    setCommenting(true);

    try {
      const res = await fetch(
        `${SERVER_URL}/api/blog/${selectedBlog._id}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: commentName, text: commentText }),
        },
      );

      const updatedBlog = await res.json();

      setSelectedBlog(updatedBlog);
      setBlogs((prev) =>
        prev.map((b) => (b._id === updatedBlog._id ? updatedBlog : b)),
      );

      setCommentName("");
      setCommentText("");
    } catch (err) {
      console.error("Error commenting", err);
    } finally {
      setCommenting(false);
    }
  };

  // ✅ Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };
  const handleFileChange = (e) => {
    setNewPost({ ...newPost, image: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", newPost.name);
    formData.append("role", newPost.role);
    formData.append("quote", newPost.quote);
    if (newPost.image) formData.append("image", newPost.image);

    try {
      const res = await fetch(`${SERVER_URL}/api/blog`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSubmitSuccess(
          "Your post has been submitted and is pending admin approval.",
        );
        setNewPost({ name: "", role: "", quote: "", image: null });
        setTimeout(() => {
          setShowForm(false);
          setSubmitSuccess("");
        }, 3000);
      } else {
        alert("Failed to submit blog. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getPostLabel = (dateString) => {
    const blogDate = new Date(dateString);
    const today = new Date();
    const diffTime = today - blogDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffDays < 1 && blogDate.getDate() === today.getDate()) return "Today";
    else if (diffDays < 2 && blogDate.getDate() === today.getDate() - 1)
      return "Yesterday";
    return null;
  };

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    headline: "EUSDA Blog & Reflections",
    description:
      "Read inspiring blog posts and reflections from EUSDA Church community.",
    url: "https://eusda.co.ke/blog",
    author: { "@type": "Organization", name: "EUSDA Church" },
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.name,
      image: blog.image,
      author: { "@type": "Person", name: blog.role || "Contributor" },
      datePublished: blog.createdAt || new Date().toISOString(),
      description: blog.quote,
      url: `https://eusda.co.ke/blog/${blog._id}`,
    })),
  };

  return (
    <>
      <Helmet>
        <title>EUSDA Blog & Reflections | Egerton University SDA Church</title>

        <meta
          name="description"
          content="Explore inspiring blogs, devotionals, and reflections from the EUSDA Church community."
        />

        <meta
          name="keywords"
          content="EUSDA blog, church reflections, SDA devotionals, Egerton University SDA"
        />

        <meta property="og:title" content="EUSDA Blog & Reflections" />

        <meta
          property="og:description"
          content="Discover powerful reflections, devotionals, and messages from our church community."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content="https://eusda.co.ke/blog" />

        <meta property="og:image" content="/eusda-logo.png" />

        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 relative mt-[-8rem] md:mt-[-4rem]">
        {/* Header Section */}
        <div className="text-center mb-12" data-aos="fade-down">
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">
            Testimonies & Thoughts
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-6">
            Community <span className="text-green-700">Reflections</span>
          </h2>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-green-500/30 transition-all hover:-translate-y-1"
          >
            <PenTool size={18} /> Share Your Story
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <CircularProgress color="success" size={50} />
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {!loading && currentBlogs.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">
                No posts yet. Be the first to share!
              </p>
            </div>
          ) : (
            currentBlogs.map((blog, index) => {
              const label = getPostLabel(blog.createdAt);
              const isLiked = localStorage.getItem(`liked_${blog._id}`);

              return (
                <div
                  key={blog._id}
                  className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onClick={() => setSelectedBlog(blog)}
                >
                  {/* Image Header */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                    {label && (
                      <span
                        className={`absolute top-4 right-4 z-20 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${label === "Today" ? "bg-green-500 text-white" : "bg-yellow-400 text-yellow-900"}`}
                      >
                        {label}
                      </span>
                    )}
                    <img
                      src={blog.image}
                      alt={blog.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
                          {blog.name}
                        </h3>
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                          {blog.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 italic">
                      "{blog.quote}"
                    </p>

                    {/* Interaction Bar */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-gray-500 text-sm">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => handleLike(e, blog._id)}
                          className={`flex items-center gap-1.5 transition-colors ${isLiked ? "text-red-500" : "hover:text-red-500"}`}
                        >
                          <Heart
                            size={18}
                            fill={isLiked ? "currentColor" : "none"}
                          />
                          <span>{blog.likes || 0}</span>
                        </button>
                        <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                          <MessageCircle size={18} />
                          <span>{blog.comments?.length || 0}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {blogs.length > blogsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-gray-300 hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-green-700 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-gray-300 hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowForm(false)}
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Share Your Testimony
            </h3>

            {submitSuccess ? (
              <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenTool className="text-green-600" size={32} />
                </div>
                <h4 className="text-xl font-bold text-green-700 mb-2">
                  Submitted Successfully!
                </h4>
                <p className="text-gray-600">{submitSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    onChange={handleInputChange}
                    value={newPost.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role (e.g. Member, Visitor)
                  </label>
                  <input
                    type="text"
                    name="role"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    onChange={handleInputChange}
                    value={newPost.role}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Reflection
                  </label>
                  <textarea
                    name="quote"
                    rows="4"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                    onChange={handleInputChange}
                    value={newPost.quote}
                  ></textarea>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer bg-gray-50">
                  <label className="cursor-pointer block w-full h-full">
                    <span className="text-gray-500 text-sm font-medium block">
                      {newPost.image
                        ? newPost.image.name
                        : "Click to upload a cover photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                >
                  {submitting ? "Sending..." : "Submit for Approval"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reading Modal */}
      {selectedBlog && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-64 shrink-0">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <button
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                onClick={() => setSelectedBlog(null)}
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-3xl font-bold mb-1">{selectedBlog.name}</h3>
                <p className="text-green-300 font-medium">
                  {selectedBlog.role} •{" "}
                  {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="prose prose-green max-w-none">
                <p className="text-gray-700 text-lg leading-loose whitespace-pre-line italic border-l-4 border-green-500 pl-6 bg-green-50/50 py-4 rounded-r-lg">
                  "{selectedBlog.quote}"
                </p>
              </div>

              <hr className="my-8 border-gray-100" />

              {/* Comments Section */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageCircle className="text-green-600" />
                  Comments{" "}
                  <span className="text-gray-400 text-base font-normal">
                    ({selectedBlog.comments?.length || 0})
                  </span>
                </h4>

                {/* Comments List */}
                <div className="space-y-4 mb-8">
                  {selectedBlog.comments && selectedBlog.comments.length > 0 ? (
                    selectedBlog.comments.map((comment, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-700">
                          <User size={16} />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-gray-900">
                              {comment.user}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-500 text-sm">
                        No comments yet. Start the conversation!
                      </p>
                    </div>
                  )}
                </div>

                {/* Add Comment */}
                <form
                  onSubmit={handleCommentSubmit}
                  className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all"
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-100 outline-none placeholder:font-normal"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                  />
                  <textarea
                    placeholder="Write a comment..."
                    rows="2"
                    className="w-full px-4 py-3 text-sm outline-none resize-none text-gray-700"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end p-2 bg-gray-50 rounded-b-lg">
                    <button
                      type="submit"
                      disabled={commenting}
                      className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {commenting ? (
                        "Posting..."
                      ) : (
                        <>
                          <Send size={14} /> Post
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Blog;
