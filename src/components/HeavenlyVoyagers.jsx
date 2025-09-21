import React from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Cross,
  History,
  Globe,
  ListChecks,
  ArrowLeft,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

function HeavenlyVoyagers() {
  return (
    <div className="p-8 max-w-6xl mx-auto py-20 px-6 md:mt-20 mt-8">
      {/* SEO */}
      <Helmet>
        {/* Basic SEO */}
        <title>Heavenly Voyagers Ministry | EUSDA</title>
        <meta
          name="description"
          content="Discover Heavenly Voyagers Ministry at Egerton University SDA Church — dedicated to gospel outreach, missions, Bible studies, and service through faith-driven programs."
        />
        <meta
          name="keywords"
          content="Heavenly Voyagers, EUSDA, Egerton University SDA Church, Missions, Ministry, Evangelism, Bible Study, Medical Missionary"
        />
        <meta name="author" content="Egerton University SDA Church" />
        <link
          rel="canonical"
          href="https://eusda.co.ke/ministries/heavenly-voyagers"
        />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content="Heavenly Voyagers Ministry | EUSDA" />
        <meta
          property="og:description"
          content="Heavenly Voyagers is a ministry at Egerton University SDA Church focused on spreading the gospel, missions, Bible study, and service to humanity."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://eusda.co.ke/ministries/heavenly-voyagers"
        />
        <meta
          property="og:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Heavenly Voyagers Ministry | EUSDA" />
        <meta
          name="twitter:description"
          content="A faith-driven ministry dedicated to missions, evangelism, Bible studies, and charity at Egerton University SDA Church."
        />
        <meta
          name="twitter:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />

        {/* Structured Data (Schema.org) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Heavenly Voyagers Ministry - Egerton University SDA Church",
            url: "https://eusda.co.ke/ministries/heavenly-voyagers",
            logo: "https://eusda.co.ke/eusda-logo.png",
            description:
              "Heavenly Voyagers Ministry is dedicated to spreading the gospel through evangelism, missions, Bible studies, music ministry, and medical missionary training.",
            foundingDate: "2014",
            areaServed: "Kenya",
            memberOf: {
              "@type": "Organization",
              name: "Egerton University SDA Church",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Heavenly Voyagers Programs",
              itemListElement: [
                { "@type": "Offer", name: "Bible Studies" },
                { "@type": "Offer", name: "Medical Missionary Training" },
                { "@type": "Offer", name: "Voice of Prophecy Sessions" },
                { "@type": "Offer", name: "Prayer Sessions" },
                { "@type": "Offer", name: "Choir & Music Ministry" },
                { "@type": "Offer", name: "Charity Visitations" },
                { "@type": "Offer", name: "Annual December Missions" },
              ],
            },
          })}
        </script>
      </Helmet>

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-purple-900 mb-4">
          ✨ Heavenly Voyagers Ministry
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          A fellowship-driven ministry dedicated to spreading the gospel, 
          building faith, and touching lives through missions and service.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-10 bg-purple-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <Target className="text-purple-700" size={24} />
          <h2 className="text-2xl font-semibold text-purple-800">
            Mission Statement
          </h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>
            To proclaim the three angels’ message according to Rev. 14:6-11 (the
            present truth).
          </li>
          <li>
            To fill societal gaps requiring professional attention such as
            medical missionary work.
          </li>
        </ul>
      </section>

      {/* Vision */}
      <section className="mb-10 bg-purple-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <Cross className="text-purple-700" size={24} />
          <h2 className="text-2xl font-semibold text-purple-800">
            Vision Statement
          </h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          To enhance spiritual growth and discipleship within and without
          through evangelistic campaigns and other Biblically centered
          activities.
        </p>
      </section>

      {/* History */}
      <section className="mb-10 bg-purple-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <History className="text-purple-700" size={24} />
          <h2 className="text-2xl font-semibold text-purple-800">History</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-3">
          Heavenly Voyagers began in <strong>2014</strong> under the Western
          Kenya Conference Students Association. After dormancy, it was revived
          in <strong>2015</strong> following a mission at Mwiruti Langas. In{" "}
          <strong>2016</strong>, it was renamed{" "}
          <em>Heavenly Voyagers Ministry</em> with the main objective of
          spreading the gospel.
        </p>
        <p className="text-gray-700 leading-relaxed mb-3">
          Since then, the ministry has grown into two chapters:{" "}
          <strong>Student Chapter</strong> and <strong>Associate Chapter</strong>,
          carrying out missions and outreach activities.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Despite the interruption of COVID-19 in 2020, the ministry resumed in
          2021 and continues to organize annual December missions.
        </p>
      </section>

      {/* Missions */}
      <section className="mb-10 bg-purple-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="text-purple-700" size={24} />
          <h2 className="text-2xl font-semibold text-purple-800">
            Past Missions
          </h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-1 leading-relaxed">
          <li>2016 – Bokoli Market</li>
          <li>2017 – Machakha (April), Khumailo (December)</li>
          <li>2018 – Kiminini (April), Kokwet Mosoriot (December)</li>
          <li>2019 – Matharu (April), Kabelyo Marakwet (December)</li>
          <li>2021 – Rurigi Buntforest</li>
          <li>2022 – Equator Kopsiro Mt Elgon (August)</li>
          <li>2023 – Kuresoi (December, Students & Associates)</li>
          <li>
            2024 – Bwayi (Associates), Kisumu Nyamasaria (Students), and
            upcoming missions at Kimwanga (Bungoma) & Masurura (Narok).
          </li>
        </ul>
      </section>

      {/* Programs */}
      <section className="mb-12 bg-purple-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <ListChecks className="text-purple-700" size={24} />
          <h2 className="text-2xl font-semibold text-purple-800">Programs</h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-1 leading-relaxed">
          <li>Bible studies</li>
          <li>Medical missionary training</li>
          <li>Voice of Prophecy sessions</li>
          <li>Prayer sessions</li>
          <li>Choir training and music ministry</li>
          <li>Charity visitations</li>
          <li>Annual December missions (as per EUSDA constitution)</li>
        </ul>
      </section>

      {/* Back Button */}
      <div className="text-center">
        <Link
          to="/ministries"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 
          text-white font-medium rounded-xl shadow-md hover:scale-105 transform transition-all duration-300"
        >
          <ArrowLeft size={18} /> Back to Ministries
        </Link>
      </div>
    </div>
  );
}

export default HeavenlyVoyagers;
