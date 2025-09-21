import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  BookOpen,
  HeartHandshake,
  Users,
  Landmark,
  Download,
  Globe,
  HandHelping,
} from "lucide-react";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="about-page mt-16">
      {/* ✅ Helmet SEO */}
      <Helmet>
        <title>About Us | EUSDA Church Kenya</title>
        <meta
          name="description"
          content="Learn about the history, mission, and values of the Egerton University Seventh-day Adventist (EUSDA) Church. Discover our faith, beliefs, and community impact."
        />
        <meta
          name="keywords"
          content="About EUSDA, Egerton University SDA, SDA Church Kenya, Christian values, Seventh-day Adventist beliefs, Adventist Church Eldoret"
        />
        <meta name="author" content="EUSDA" />
        <link rel="canonical" href="https://eusda.co.ke/about" />

        {/* Open Graph (Facebook/LinkedIn) */}
        <meta property="og:title" content="About EUSDA Church" />
        <meta
          property="og:description"
          content="Discover our story, core values, and the mission of Egerton University SDA Church in Kenya."
        />
        <meta property="og:url" content="https://eusda.co.ke/about" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About EUSDA Church" />
        <meta
          name="twitter:description"
          content="Learn more about the Egerton University SDA Church — our story, beliefs, and vision."
        />
        <meta
          name="twitter:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About EUSDA Church",
            url: "https://eusda.co.ke/about",
            description:
              "EUSDA Church at Egerton University is a vibrant Seventh-day Adventist community rooted in faith, unity, and service. Discover our story, beliefs, and core values.",
            publisher: {
              "@type": "Organization",
              name: "EUSDA Church",
              url: "https://eusda.co.ke",
            },
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white py-32 px-6"
        style={{
          backgroundImage: `url('https://picsum.photos/1200/600?grayscale')`,
        }}
        data-aos="fade-down"
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-extrabold mb-4">About EUSDA Church</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Discover our story, mission, and the heart behind our ministry.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-16 px-6 text-center" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Our Story</h2>
        <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
          The Egerton University Seventh-day Adventist (EUSDA) Church began as a
          small prayer group and grew into a vibrant spiritual community.
          Through worship, mentorship, and outreach, we serve our campus and
          surrounding communities with Christ’s love.
        </p>
      </section>

      {/* Core Values with Icons */}
      <section className="bg-green-50 py-16 px-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-10">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div
            className="bg-white p-6 rounded-lg shadow-md text-center"
            data-aos="zoom-in"
          >
            <BookOpen className="text-green-700 mx-auto mb-4" size={32} />
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Faith in God
            </h3>
            <p className="text-gray-700">
              Christ is our foundation. Every gathering, outreach, and prayer
              begins with Him.
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md text-center"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <Users className="text-green-700 mx-auto mb-4" size={32} />
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Unity in Fellowship
            </h3>
            <p className="text-gray-700">
              A spiritual family bound by love, we encourage one another to grow
              in grace.
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md text-center"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <HandHelping className="text-green-700 mx-auto mb-4" size={32} />
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Service to Others
            </h3>
            <p className="text-gray-700">
              Living our faith through action—locally and globally.
            </p>
          </div>
        </div>
      </section>

      {/* Beliefs Section */}
      <section className="bg-white py-16 px-6 text-center" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-800 mb-6">
          What We Believe
        </h2>
        <Globe className="text-green-700 mx-auto mb-4" size={36} />
        <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
          We uphold the teachings of the global Seventh-day Adventist Church:
          the Bible as God’s Word, salvation through Jesus, Sabbath observance,
          and the hope of His soon return. Our faith shapes our
          lives—spiritually, socially, and academically.
        </p>
      </section>

      {/* Constitution Section */}
      <section className="bg-gray-50 px-6 py-16 text-center" data-aos="fade-up">
        <h2 className="text-4xl font-extrabold text-green-800 mb-6">
          EUSDA Constitution
        </h2>
        <Landmark className="text-green-700 mx-auto mb-4" size={36} />
        <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed text-justify">
          We, the Seventh-Day Adventist students of Egerton University, inspired
          by the gospel mission and united under God’s purpose, commit ourselves
          to spiritual service, evangelism, and fellowship. Guided by Biblical
          principles, we uphold the Great Commission as our lifelong call.
        </p>
        <div className="flex justify-center mt-10">
          <a
            href="/docs/EUSDA _CONSTITUTION.pdf"
            download
            className="flex items-center px-5 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-all duration-300"
          >
            <Download className="mr-2" size={20} />
            Download PDF
          </a>
        </div>
      </section>

      {/* Join Us Section */}
      <section
        className="bg-green-200 py-16 px-6 text-center mt-10"
        data-aos="zoom-in"
      >
        <HeartHandshake className="text-green-800 mx-auto mb-4" size={40} />
        <h2 className="text-3xl font-bold text-green-900 mb-4">
          You're Welcome Here!
        </h2>
        <p className="text-lg text-green-800 mb-6 max-w-xl mx-auto">
          Whether you're new to campus, seeking spiritual growth, or simply
          curious—there’s a place for you at EUSDA.
        </p>
        <a
          href="/contact"
          className="inline-block bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-full shadow-md transition duration-300"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default About;
