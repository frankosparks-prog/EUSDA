import React, { useState } from "react";
import axios from "axios";
import { Send, MessageCircle, Loader2, CheckCircle, XCircle } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Discussion() {
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setErrorMsg("Please enter a topic.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await axios.post(`${SERVER_URL}/api/discussions`, {
        name: name.trim(),
        topic: topic.trim(),
      });

      setSuccessMsg("Thank you! Your discussion topic has been submitted.");
      setTopic("");
      setName("");
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to submit your topic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 md:mt-20 mt-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        
        {/* Page Title */}
        <div className="text-center mb-8">
          <MessageCircle size={40} className="mx-auto text-green-700" />
          <h1 className="text-3xl font-bold text-green-800 mt-3">
            Sabbath Afternoon Discussion Suggestions
          </h1>
          <p className="text-gray-600 mt-2">
            Share a topic you’d love us to discuss during our Bible session.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Optional Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Your Name (optional)
            </label>
            <input
              type="text"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name (optional)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Topic Textarea */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Discussion Topic <span className="text-red-500">*</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => {
                if (e.target.value.length <= 200) setTopic(e.target.value);
              }}
              placeholder="Write your suggested topic..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:outline-none h-32 resize-none"
            ></textarea>

            {/* Character Counter */}
            <div className="text-right text-sm text-gray-500 mt-1">
              {topic.length} / 200 characters
            </div>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-3 rounded-lg">
              <CheckCircle size={18} />
              <p>{successMsg}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-red-700 bg-red-100 px-4 py-3 rounded-lg">
              <XCircle size={18} />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || topic.trim().length === 0}
            className={`w-full py-3 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition
              ${
                loading || topic.trim().length === 0
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Suggestion
              </>
            )}
          </button>

          {/* Note */}
          <p className="text-center text-xs text-gray-500 italic mt-2">
            Submission will be recorded for review.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Discussion;
