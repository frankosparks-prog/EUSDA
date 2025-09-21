import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet-async";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
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
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Blog;
