// import React, { useEffect, useState } from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import Footer from './Footer';

// function Announcements() {
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   const announcements = [
//     {
//       title: 'Upcoming Revival Meeting',
//       date: 'May 12, 2025',
//       description:
//         'Join us for a powerful evening of worship, word, and revival. The service starts at 6:00 PM at the main sanctuary.',
//     },
//     {
//       title: 'Youth Conference 2025 Registration Now Open',
//       date: 'May 1, 2025',
//       description:
//         'Don’t miss out on this year’s youth conference! Register online or at the church office before June 5.',
//     },
//     {
//       title: 'Monthly Fasting & Prayer Week',
//       date: 'April 28 – May 4, 2025',
//       description:
//         'Let’s seek God together through fasting and prayer. Daily morning devotion will be held from 6:00 AM to 7:00 AM.',
//     },
//     {
//       title: 'Baptism Service - June 15',
//       date: 'June 15, 2025',
//       description:
//         'All those who want to be baptized are encouraged to attend the baptism class every Sunday after service.',
//     },
//     {
//       title: 'Men’s Fellowship Breakfast',
//       date: 'May 18, 2025',
//       description:
//         'All men are invited to a morning of brotherhood, word, and breakfast at the fellowship hall at 7:30 AM.',
//     },
//     {
//       title: 'Church Cleaning Day',
//       date: 'May 10, 2025',
//       description:
//         'Let’s come together to keep God’s house clean. Join us for a church-wide clean-up starting at 9:00 AM.',
//     },
//     {
//       title: 'New Members Orientation',
//       date: 'May 25, 2025',
//       description:
//         'Are you new to our church? Come learn about our values, ministries, and how to get involved.',
//     },
//     {
//       title: 'Night of Worship',
//       date: 'May 31, 2025',
//       description:
//         'A special night of extended praise and worship with guest worship leaders and our choir.',
//     },
//   ];

//   const filteredAnnouncements = announcements.filter(
//     (item) =>
//       item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//     <section className="bg-green-50 py-20 px-6 min-h-screen mt-20 mb-[-2rem]">
//       <div className="max-w-6xl mx-auto" data-aos="fade-up">
//         <h1 className="text-4xl font-bold text-green-900 mb-10 text-center">📢 Church Announcements</h1>

//         {/* Search Input */}
//         <div className="mb-10 max-w-md mx-auto">
//           <input
//             type="text"
//             placeholder="Search announcements..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//         </div>

//         {/* Announcements List */}
//         <div className="space-y-6">
//           {filteredAnnouncements.length > 0 ? (
//             filteredAnnouncements.map((announcement, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
//                 data-aos="fade-up"
//                 data-aos-delay={index * 100}
//               >
//                 <h2 className="text-2xl font-semibold text-green-800 mb-1">{announcement.title}</h2>
//                 <p className="text-sm text-gray-500 mb-3">{announcement.date}</p>
//                 <p className="text-gray-700">{announcement.description}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500">No announcements found.</p>
//           )}
//         </div>
//       </div>
//     </section>
//     <Footer />
//     </>
//   );
// }

// export default Announcements;

// import React, { useEffect, useState } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import CircularProgress from "@mui/material/CircularProgress"; // Importing Material-UI CircularProgress

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// function Announcements() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Initialize AOS for animation
//     AOS.init({ duration: 1000 });

//     // Fetch announcements data from backend
//     const fetchAnnouncements = async () => {
//       try {
//         const response = await fetch(
//           `${SERVER_URL}/api/announcements`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch announcements");
//         }
//         const data = await response.json();
//         setAnnouncements(data); // Set the fetched announcements to state
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false); // Turn off the loading spinner
//       }
//     };

//     fetchAnnouncements(); // Call the function to fetch data
//   }, []); // Empty dependency array means this runs only on mount

//   const filteredAnnouncements = announcements.filter(
//     (item) =>
//       item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//       <section className="bg-green-50 py-20 px-6 min-h-screen mt-20 mb-[-2rem]">
//         <div className="max-w-6xl mx-auto" data-aos="fade-up">
//           <h1 className="text-4xl font-bold text-green-900 mb-10 text-center">
//             📢 Church Announcements
//           </h1>

//           {/* Search Input */}
//           <div className="mb-10 max-w-md mx-auto">
//             <input
//               type="text"
//               placeholder="Search announcements..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           {/* Displaying Loading with CircularProgress */}
//           {loading && (
//             <div className="flex justify-center items-center py-10">
//               <CircularProgress color="success" size={60} />
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <p className="text-center text-red-600 font-semibold bg-red-100 p-4 rounded-lg shadow-md mt-6">
//               Error: {error}
//             </p>
//           )}

//           {/* Announcements List */}
//           <div className="space-y-6">
//             {filteredAnnouncements.length > 0 ? (
//               filteredAnnouncements.map((announcement, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
//                   data-aos="fade-up"
//                   data-aos-delay={index * 100}
//                 >
//                   <h2 className="text-2xl font-semibold text-green-800 mb-1">
//                     {announcement.title}
//                   </h2>
//                   <p className="text-sm text-gray-500 mb-3">
//                     {announcement.date}
//                   </p>
//                   <p className="text-gray-700">{announcement.description}</p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 font-semibold text-lg bg-gray-100 p-4 rounded-lg shadow-md mt-6">
//                 No announcements found.
//               </p>
//             )}
//           </div>
//         </div>
//       </section>
//       {/* <Footer /> */}
//     </>
//   );
// }

// export default Announcements;
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Download } from "lucide-react";
import jsPDF from "jspdf";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Announcements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/announcements`);
        if (!response.ok) throw new Error("Failed to fetch announcements");
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadAllPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 60; // ✅ extra space after heading
    const pageHeight = pdf.internal.pageSize.height;

    // === Logo ===
    const logoUrl = "/eusda-logo.png"; // place logo in /public/eusda-logo.png
    pdf.addImage(logoUrl, "PNG", 90, 10, 30, 30);

    // === Title ===
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text("EUSDA Announcements", 105, 50, { align: "center" });
    pdf.setDrawColor(0, 150, 0); // green underline
    pdf.line(60, 53, 150, 53); // underline under the title

    // === Announcements ===
    filteredAnnouncements.forEach((a, i) => {
      if (y > pageHeight - 50) {
        pdf.addPage();
        y = 20;
      }

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${i + 1}. ${a.title}`, 14, y);
      y += 7;

      // Date
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(11);
      pdf.setTextColor(60);
      pdf.text(`${new Date(a.date).toLocaleString()}`, 14, y);
      y += 6;

      // Description
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      const splitDesc = pdf.splitTextToSize(a.description, 180);
      pdf.text(splitDesc, 14, y);
      y += splitDesc.length * 6 + 6;

      // Divider
      pdf.setDrawColor(200);
      pdf.line(14, y, 196, y);
      y += 8;
    });

    // === Add Footer + Pagination AFTER all pages created ===
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // Green line above footer
      pdf.setDrawColor(0, 150, 0);
      pdf.setLineWidth(0.5);
      pdf.line(14, pageHeight - 20, 196, pageHeight - 20);

      // Footer text
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(10);
      pdf.setTextColor(120);
      pdf.text(
        `Generated by EUSDA Church System — ${new Date().toLocaleDateString()}`,
        105,
        pageHeight - 12,
        { align: "center" }
      );

      // Page numbers
      pdf.text(`Page ${i} of ${totalPages}`, 196, pageHeight - 12, {
        align: "right",
      });
    }

    pdf.save("church_announcements.pdf");
  };

  return (
    <section className="bg-green-50 py-20 px-6 min-h-screen md:mt-20 mt-8">
      <div className="max-w-6xl mx-auto" data-aos="fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-green-900 text-center w-full">
            📢 Church Announcements
          </h1>
        </div>

        {/* Search + Download All */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-2/3 px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {filteredAnnouncements.length > 0 && (
            <button
              onClick={handleDownloadAllPDF}
              className="w-1/2 sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow text-center"
            >
              <Download size={18} />
              Download All (PDF)
            </button>
          )}
        </div>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <CircularProgress color="success" size={60} />
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-600 font-semibold bg-red-100 p-4 rounded-lg shadow-md mt-6">
            Error: {error}
          </p>
        )}

        {/* Announcement Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-600"
              >
                <h2 className="text-xl font-bold text-green-800 mb-2">
                  {announcement.title}
                </h2>
                <p className="text-gray-500 text-sm mb-3">
                  {new Date(announcement.date).toLocaleString()}
                </p>
                <p className="text-gray-700 whitespace-pre-line">
                  {announcement.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 font-semibold text-lg bg-gray-100 p-4 rounded-lg shadow-md mt-6 flex items-center justify-center">
              No announcements found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Announcements;
