import React from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Cross,
  History,
  ListChecks,
  ArrowLeft,
} from "lucide-react";

function RevelationOfLove() {
  return (
    <div className="p-8 max-w-6xl mx-auto py-20 px-6 md:mt-20 mt-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-800 mb-4">
          🌿 Revelation of Love Ministry
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          A Christ-centered ministry dedicated to uplifting Jesus, loving one
          another, and proclaiming the everlasting Gospel to all nations.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-10 bg-green-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <Target className="text-green-700" size={24} />
          <h2 className="text-2xl font-semibold text-green-800">
            Mission Statement
          </h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          The mission of the Revelation of Love Ministers is to uplift Christ,
          love one another, and proclaim the Gospel to all nations.
        </p>
      </section>

      {/* Vision */}
      <section className="mb-10 bg-green-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <Cross className="text-green-700" size={24} />
          <h2 className="text-2xl font-semibold text-green-800">
            Vision Statement
          </h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          To proclaim the three angels’ message in line with{" "}
          <em>Matthew 28:19</em> and <em>Revelation 14:6</em>.
        </p>
      </section>

      {/* History */}
      <section className="mb-10 bg-green-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <History className="text-green-700" size={24} />
          <h2 className="text-2xl font-semibold text-green-800">History</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Revelation of Love Ministers, formerly known as{" "}
          <strong>Silent Ministers Ministry</strong>, began in{" "}
          <strong>2002</strong>. A few Eusdarians zealous for Christ met daily
          in the Lower Pavilion for prayer and Bible study. Christ impressed
          them to share the light revealed, leading to articles pinned weekly on
          Egerton University’s noticeboards and a Sabbath article at the church
          entrance in B1. These quiet efforts gave the ministry its original
          name — Silent Ministers Ministry.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          As the ministry expanded into evangelistic campaigns, school outreach,
          and other programs, the name was changed in{" "}
          <strong>2021</strong> to <strong>The Revelation of Love Ministers</strong>.
        </p>
        <p className="text-gray-700 leading-relaxed">
          God has used this ministry to promote reforms in EUSDA — including{" "}
          <strong>health reform (diet & dress), music ministry, and
          strengthening the prayer band</strong>.
        </p>
      </section>

      {/* Programmes */}
      <section className="mb-12 bg-green-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <ListChecks className="text-green-700" size={24} />
          <h2 className="text-2xl font-semibold text-green-800">
            Core Programmes
          </h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>Evangelism (missions) and training on effective evangelism</li>
          <li>Health webinars</li>
          <li>Voice of Prophecy</li>
          <li>Music school (choir)</li>
          <li>Bible study</li>
        </ul>
      </section>

      {/* Back Button */}
      <div className="text-center">
        <Link
          to="/ministries"
          className="inline-flex items-center gap-2 px-6 py-3 
          bg-gradient-to-r from-green-600 to-green-700 
          text-white font-medium rounded-xl shadow-md 
          hover:scale-105 transform transition-all duration-300"
        >
          <ArrowLeft size={18} /> Back to Ministries
        </Link>
      </div>
    </div>
  );
}

export default RevelationOfLove;
