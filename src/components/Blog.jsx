import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet-async";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null); // 👈 for modal

  useEffect(() => {
    AOS.init({ duration: 1000 });

    fetch(`${SERVER_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Failed to fetch blogs", err))
      .finally(() => setLoading(false));
  }, []);

  // Generate structured data (JSON-LD) for SEO
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    headline: "EUSDA Blog & Reflections",
    description:
      "Read inspiring blog posts and reflections from EUSDA Church community.",
    url: "https://eusda.co.ke/blog",
    author: {
      "@type": "Organization",
      name: "EUSDA Church",
    },
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.name,
      image: blog.image,
      author: {
        "@type": "Person",
        name: blog.role || "Contributor",
      },
      datePublished: blog.createdAt || new Date().toISOString(),
      description: blog.quote,
      url: `https://eusda.co.ke/blog/${blog._id}`,
    })),
  };

  return (
    <>
      {/* SEO Meta Tags */}
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
        <script type="application/ld+json">
          {JSON.stringify(blogSchema)}
        </script>
      </Helmet>

      {/* Blog Page */}
      <div className="min-h-screen bg-gray-50 py-20 px-6 md:mt-20 mt-8">
        <h2
          className="text-4xl font-bold text-center text-green-800 mb-12"
          data-aos="fade-down"
        >
          Blog & Reflections
        </h2>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <CircularProgress color="success" size={60} />
          </div>
        )}

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {!loading && blogs.length === 0 ? (
            <p className="col-span-3 text-gray-500 font-semibold text-lg bg-gray-100 p-4 rounded-lg shadow-md text-center">
              No blog posts found yet.
            </p>
          ) : (
            blogs.map((blog, index) => (
              <div
                key={blog._id}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onClick={() => setSelectedBlog(blog)} // 👈 open modal
              >
                <img
                  src={blog.image}
                  alt={blog.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  {blog.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">By {blog.role}</p>
                <p className="text-gray-700 line-clamp-4">{blog.quote}</p>
                <p className="text-green-600 mt-2 font-medium">Read More →</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Blog Modal */}
      {selectedBlog && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBlog(null)} // 👈 close on outside click
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // 👈 stop bubbling so modal itself is clickable
          >
            {/* Close Button */}
            <button
              className="absolute top-1 right-1 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setSelectedBlog(null)}
            >
              &times;
            </button>

            <img
              src={selectedBlog.image}
              alt={selectedBlog.name}
              className="w-full max-h-96 object-contain rounded mb-4 bg-gray-100 rounded-3xl shadow-lg"
            />
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              {selectedBlog.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">By {selectedBlog.role}</p>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {selectedBlog.quote}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Blog;
