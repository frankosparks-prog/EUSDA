import React from "react";
import { Link } from "react-router-dom";
import {
  Cross,
  History,
  Target,
  ListChecks,
  ArrowLeft,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

function CalvaryMinisters() {
  return (
    <div className="p-8 max-w-6xl mx-auto py-20 px-6 md:mt-20 mt-8">
      {/* SEO */}
      <Helmet>
        {/* Basic SEO */}
        <title>Calvary Ministers | EUSDA</title>
        <meta
          name="description"
          content="Learn about Calvary Ministers at Egerton University Seventh-day Adventist Church — building strong spiritual leaders through fellowship, reformation, and gospel-centered service."
        />
        <meta
          name="keywords"
          content="Calvary Ministers, EUSDA, Egerton University SDA Church, Mission, Vision, Ministry, Fellowship, Gospel Outreach"
        />
        <meta name="author" content="Egerton University SDA Church" />
        <link rel="canonical" href="https://eusda.co.ke/ministries/calvary-ministers" />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content="Calvary Ministers | EUSDA" />
        <meta
          property="og:description"
          content="Discover Calvary Ministers: a supporting ministry at Egerton University SDA Church focused on reformation, Bible study, and gospel-centered service."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://eusda.co.ke/ministries/calvary-ministers"
        />
        <meta
          property="og:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calvary Ministers | EUSDA" />
        <meta
          name="twitter:description"
          content="Building strong spiritual leaders through fellowship, reformation, and gospel-centered service."
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
            name: "Calvary Ministers - Egerton University SDA Church",
            url: "https://eusda.co.ke/ministries/calvary-ministers",
            logo: "https://eusda.co.ke/eusda-logo.png",
            description:
              "Calvary Ministers builds strong spiritual leaders through fellowship, reformation, and gospel-centered service.",
            foundingDate: "2024",
            memberOf: {
              "@type": "Organization",
              name: "Egerton University SDA Church",
            },
            areaServed: "Kenya",
          })}
        </script>
      </Helmet>

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-yellow-700 mb-4">
          ✝️ Calvary Ministers
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Building strong spiritual leaders through fellowship, reformation, and
          gospel-centered service.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-10 bg-yellow-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <Target className="text-yellow-600" size={24} />
          <h2 className="text-2xl font-semibold text-yellow-700">
            Mission Statement
          </h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          To reproof, correct, and instruct in righteousness so that the
          children of God may be perfect and thoroughly furnished in all good
          works.
        </p>
      </section>

      {/* Vision */}
      <section className="mb-10 bg-yellow-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <Cross className="text-yellow-600" size={24} />
          <h2 className="text-2xl font-semibold text-yellow-700">
            Vision Statement
          </h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          To lead individuals into a profound relationship with God, inspiring
          them to wholeheartedly align their lives with His will, and thereby
          prepare for the eternal joy of heaven.
        </p>
      </section>

      {/* History */}
      <section className="mb-10 bg-yellow-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <History className="text-yellow-600" size={24} />
          <h2 className="text-2xl font-semibold text-yellow-700">History</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-3">
          Calvary Ministry is one of the supporting ministries in the Egerton
          University Seventh-day Adventist Church. It began in{" "}
          <strong>2024</strong> as a Bible study group and officially became a
          supporting ministry in <strong>2025</strong> with{" "}
          <strong>45 members</strong>.
        </p>
        <p className="text-gray-700 leading-relaxed mb-3">
          Founding leaders include <strong>Elder Henry Odondi</strong> (advisor)
          and <strong>Sister Lucy Ondimu</strong> (first chairperson). The
          ministry’s purpose is to spread the <em>Three Angels’ Message</em>,
          enhance fellowship, and strengthen fidelity to God.
        </p>
        <p className="text-gray-700 leading-relaxed">
          The ministry is committed to{" "}
          <strong>reformation, gospel outreach, and worldwide missions</strong>.
        </p>
      </section>

      {/* Core Programmes */}
      <section className="mb-12 bg-yellow-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <ListChecks className="text-yellow-600" size={24} />
          <h2 className="text-2xl font-semibold text-yellow-700">
            Core Programmes
          </h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>Medical Missionary Training</li>
          <li>Bible Study</li>
          <li>Voice of Prophecy Training</li>
          <li>Music Training</li>
        </ul>
      </section>

      {/* Back Button */}
      <div className="text-center">
        <Link
          to="/ministries"
          className="inline-flex items-center gap-2 px-6 py-3 
          bg-gradient-to-r from-yellow-500 to-yellow-600 
          text-white font-medium rounded-xl shadow-md 
          hover:scale-105 transform transition-all duration-300"
        >
          <ArrowLeft size={18} /> Back to Ministries
        </Link>
      </div>
    </div>
  );
}

export default CalvaryMinisters;
