import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Ministries() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const ministries = [
  {
    title: "Revelation of Love Ministry",
    short: "Uplifting Christ, loving one another, and proclaiming the everlasting Gospel.",
    full: "The Revelation of Love Ministers, originally Silent Ministers Ministry (founded in 2002), are dedicated to uplifting Christ, promoting reforms, and proclaiming the three angels’ message through evangelism, health reform, music ministry, and Bible study.",
    delay: 0,
    color: "green",
  },
  {
    title: "Heavenly Voyagers",
    short: "Spreading the Gospel through missions, discipleship, and service.",
    full: "Founded in 2014 and revived in 2015, Heavenly Voyagers has grown into Student and Associate chapters, carrying out evangelistic campaigns, medical missionary work, Bible study, choir training, and annual December missions across Kenya.",
    delay: 100,
    color: "purple",
  },
  {
    title: "Calvary Ministers",
    short: "Training faithful leaders through fellowship, reformation, and outreach.",
    full: "Calvary Ministers began in 2024 as a Bible study group and became a full supporting ministry in 2025. With programs in medical missionary training, Voice of Prophecy, and gospel outreach, they nurture dependable stewards of the Three Angels’ Message.",
    delay: 200,
    color: "yellow",
  },
];


  const getButtonClasses = (color) => {
    switch (color) {
      case "green":
        return "bg-green-600 hover:bg-green-700";
      case "purple":
        return "bg-purple-600 hover:bg-purple-700";
      case "yellow":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <section className="bg-white py-20 px-6 md:mt-20 mt-8" data-aos="fade-up">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-4xl font-bold text-center text-green-900 mb-12"
          data-aos="fade-down"
        >
          Explore Our Ministries
        </h1>
        <p
          className="text-center text-gray-600 max-w-2xl mx-auto mb-16"
          data-aos="fade-up"
        >
          Our ministries are the heartbeat of our community — each designed to
          serve, uplift, and draw people closer to God in unique ways.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {ministries.map((ministry, idx) => (
            <div
              key={idx}
              className="bg-green-50 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 flex flex-col justify-between"
              data-aos="zoom-in"
              data-aos-delay={ministry.delay}
            >
              <div>
                <h2 className="text-2xl font-semibold text-green-800 mb-3">
                  {ministry.title}
                </h2>
                <p className="text-gray-700 italic mb-2">"{ministry.short}"</p>
                <p className="text-gray-600 text-sm mb-4">{ministry.full}</p>
              </div>

              {/* Learn More Button */}
              <Link
                to={
                  ministry.title === "Revelation of Love Ministry"
                    ? "/ministries/revelation-of-love"
                    : ministry.title === "Heavenly Voyagers"
                    ? "/ministries/heavenly-voyagers"
                    : "/ministries/calvary-ministers"
                }
                className={`group inline-flex items-center justify-center gap-2 mt-4 px-5 py-2 
                  text-white font-semibold rounded-full 
                  shadow-md transition-all duration-300 ease-in-out ${getButtonClasses(
                    ministry.color
                  )}`}
              >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Join Button */}
              <div className="mt-auto text-center">
                <Link
                  to={`/ministries/join/${encodeURIComponent(ministry.title)}`}
                  className={`inline-block mt-4 px-5 py-2 text-white font-medium rounded-xl transition shadow ${getButtonClasses(
                    ministry.color
                  )}`}
                >
                  Join This Ministry
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Ministries;
