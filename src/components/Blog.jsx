import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./Footer";

function Blog() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const testimonials = [
    {
      name: "Grace Mwangi",
      role: "Student Leader",
      quote:
        "EUSDA has been a spiritual home for me. I’ve grown in faith, found amazing friendships, and experienced true fellowship.",
      image: "https://picsum.photos/400/250?random=4",
    },
    {
      name: "Daniel Otieno",
      role: "Youth Evangelist",
      quote:
        "Joining the EUSDA choir gave me a purpose on campus. It’s more than singing—it’s ministry.",
      image: "https://picsum.photos/400/250?random=5",
    },
    {
      name: "Lucy Wanjiku",
      role: "Alumni & Mentor",
      quote:
        "Even after graduation, EUSDA remains close to my heart. The values I learned still guide me today.",
      image: "https://picsum.photos/400/250?random=8",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-20 px-6 mt-20">
        <h2
          className="text-4xl font-bold text-center text-green-800 mb-12"
          data-aos="fade-down"
        >
          What Our Members Say
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
              />
              <p className="italic text-gray-700 mb-4">"{t.quote}"</p>
              <h3 className="text-lg font-semibold text-green-700">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Blog;

// import React, { useEffect } from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { Pagination } from 'swiper/modules';
// import Footer from './Footer';

// function Blog() {
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   const testimonials = [
//     {
//       name: 'Grace Mwangi',
//       role: 'Student Leader',
//       quote:
//         'EUSDA has been a spiritual home for me. I’ve grown in faith, found amazing friendships, and experienced true fellowship.',
//       image: 'https://picsum.photos/400/250?random=1',
//     },
//     {
//       name: 'Daniel Otieno',
//       role: 'Youth Evangelist',
//       quote:
//         'Joining the EUSDA choir gave me a purpose on campus. It’s more than singing—it’s ministry.',
//       image: 'https://picsum.photos/400/250?random=2',
//     },
//     {
//       name: 'Lucy Wanjiku',
//       role: 'Alumni & Mentor',
//       quote:
//         'Even after graduation, EUSDA remains close to my heart. The values I learned still guide me today.',
//       image: 'https://picsum.photos/400/250?random=3',
//     },
//     {
//       name: 'Peter Karanja',
//       role: 'Bible Study Member',
//       quote:
//         'The weekly bible studies changed my life. I now read the Word with understanding and joy.',
//       image: 'https://picsum.photos/400/250?random=4',
//     },
//   ];

//   return (
//     <>
//     <div className="min-h-screen bg-gray-50 py-20 px-6 mt-20">
//       <h2 className="text-4xl font-bold text-center text-green-800 mb-12" data-aos="fade-down">
//         What Our Members Say
//       </h2>

//       <Swiper
//         slidesPerView={1}
//         spaceBetween={30}
//         pagination={{ clickable: true }}
//         modules={[Pagination]}
//         className="max-w-3xl mx-auto"
//       >
//         {testimonials.map((t, index) => (
//           <SwiperSlide key={index}>
//             <div
//               className="bg-white p-8 rounded-xl shadow-xl text-center"
//               data-aos="zoom-in"
//             >
//               <img
//                 src={t.image}
//                 alt={t.name}
//                 className="w-24 h-24 mx-auto rounded-full mb-4 object-cover border-4 border-green-600"
//               />
//               <p className="italic text-gray-700 mb-4 text-lg">"{t.quote}"</p>
//               <h3 className="text-xl font-semibold text-green-700">{t.name}</h3>
//               <p className="text-sm text-gray-500">{t.role}</p>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//       <Footer />
//     </div>

//     </>
//   );
// }

// export default Blog;
