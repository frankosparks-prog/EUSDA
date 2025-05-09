// import React, { useEffect } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import Footer from "./Footer";

// function Blog() {
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   const testimonials = [
//     {
//       name: "Grace Mwangi",
//       role: "Student Leader",
//       quote:
//         "EUSDA has been a spiritual home for me. I’ve grown in faith, found amazing friendships, and experienced true fellowship.",
//       image: "https://picsum.photos/400/250?random=4",
//     },
//     {
//       name: "Daniel Otieno",
//       role: "Youth Evangelist",
//       quote:
//         "Joining the EUSDA choir gave me a purpose on campus. It’s more than singing—it’s ministry.",
//       image: "https://picsum.photos/400/250?random=5",
//     },
//     {
//       name: "Lucy Wanjiku",
//       role: "Alumni & Mentor",
//       quote:
//         "Even after graduation, EUSDA remains close to my heart. The values I learned still guide me today.",
//       image: "https://picsum.photos/400/250?random=8",
//     },
//   ];

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 py-20 px-6 mt-20 mb-[-2rem]">
//         <h2
//           className="text-4xl font-bold text-center text-green-800 mb-12"
//           data-aos="fade-down"
//         >
//           What Our Members Say
//         </h2>

//         <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
//           {testimonials.map((t, index) => (
//             <div
//               key={index}
//               className="bg-white p-6 rounded-lg shadow-lg text-center"
//               data-aos="fade-up"
//               data-aos-delay={index * 100}
//             >
//               <img
//                 src={t.image}
//                 alt={t.name}
//                 className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
//               />
//               <p className="italic text-gray-700 mb-4">"{t.quote}"</p>
//               <h3 className="text-lg font-semibold text-green-700">{t.name}</h3>
//               <p className="text-sm text-gray-500">{t.role}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }

// export default Blog;


import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./Footer";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Fetch blog posts from backend
    fetch(`${SERVER_URL}/api/blog`) 
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Failed to fetch blogs", err));
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-20 px-6 mt-20 mb-[-2rem]">
        <h2
          className="text-4xl font-bold text-center text-green-800 mb-12"
          data-aos="fade-down"
        >
          Blog & Reflections
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {blogs.length === 0 ? (
            <p className="text-center col-span-3 text-gray-500 text-center text-gray-500 font-semibold text-lg bg-gray-100 p-4 rounded-lg shadow-md mt-6">No blog posts yet.</p>
          ) : (
            blogs.map((blog, index) => (
              <div
                key={blog._id}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={blog.image}
                  alt={blog.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-bold text-green-700 mb-2">{blog.name}</h3>
                <p className="text-gray-600 text-sm mb-4">By {blog.role}</p>
                <p className="text-gray-700 line-clamp-4">{blog.quote}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Blog;
