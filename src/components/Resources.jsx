import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import { BookOpen, Search, Loader2, Book, ExternalLink, ChevronRight, Copy, Check } from "lucide-react";

// Move static data outside component to prevent re-creation on render
const BIBLE_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", 
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", 
  "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", 
  "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", 
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", 
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const EGW_BOOKS = [
  { title: "Steps to Christ", url: "https://m.egwwritings.org/en/book/108/toc", color: "bg-blue-50 hover:bg-blue-100 text-blue-800" },
  { title: "The Great Controversy", url: "https://m.egwwritings.org/en/book/132/toc", color: "bg-red-50 hover:bg-red-100 text-red-800" },
  { title: "Desire of Ages", url: "https://m.egwwritings.org/en/book/130/toc", color: "bg-green-50 hover:bg-green-100 text-green-800" },
  { title: "Patriarchs and Prophets", url: "https://m.egwwritings.org/en/book/84/toc", color: "bg-amber-50 hover:bg-amber-100 text-amber-800" },
  { title: "Prophets and Kings", url: "https://m.egwwritings.org/en/book/88/toc", color: "bg-purple-50 hover:bg-purple-100 text-purple-800" },
  { title: "Ministry of Healing", url: "https://m.egwwritings.org/en/book/135/toc", color: "bg-teal-50 hover:bg-teal-100 text-teal-800" },
  { title: "Acts of the Apostles", url: "https://m.egwwritings.org/en/book/127/toc", color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-800" },
  { title: "Christ's Object Lessons", url: "https://m.egwwritings.org/en/book/15/toc", color: "bg-orange-50 hover:bg-orange-100 text-orange-800" },
];

function Resources() {
  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState("3");
  const [verse, setVerse] = useState(""); 
  const [bibleText, setBibleText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState("kjv"); 
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
  }, []);

  const fetchBibleText = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setBibleText(null);
    setCopied(false);

    let query = `${book}+${chapter}`;
    if (verse.trim()) query += `:${verse.trim()}`;

    try {
      const res = await fetch(`https://bible-api.com/${query}?translation=${version}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBibleText(data);
    } catch (error) {
      console.error("Error fetching bible text:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchBibleText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleCopy = () => {
    if (!bibleText) return;
    const textToCopy = `${bibleText.reference} (${version.toUpperCase()})\n\n` + 
      (bibleText.verses ? bibleText.verses.map(v => `${v.verse} ${v.text}`).join("\n") : bibleText.text);
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-6 font-sans mt-[-8rem] md:mt-[-4rem] overflow-x-hidden">
      <Helmet>
        <title>Library & Resources | EUSDA</title>
        <meta name="description" content="Access Bible study tools, Spirit of Prophecy books, and spiritual resources." />
      </Helmet>

      {/* Header Section */}
      <div className="text-center mb-12" data-aos="fade-down">
        <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Grow in Faith</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4 flex items-center justify-center gap-3">
           Library & <span className="text-green-700">Resources</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          "Thy word is a lamp unto my feet, and a light unto my path." — Psalm 119:105
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: BIBLE READER (8 cols) */}
        <div className="lg:col-span-8 space-y-6" data-aos="fade-right">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            
            {/* Toolbar Header */}
            <div className="bg-green-900 p-4 md:p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Book className="text-green-300" size={24} /> Scripture Reader
                </h2>
                <div className="flex items-center gap-2 bg-green-800 rounded-lg p-1">
                  {["kjv", "web"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setVersion(v)}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-colors ${
                        version === v ? "bg-white text-green-900 shadow" : "text-green-200 hover:text-white"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Controls */}
              <form onSubmit={fetchBibleText} className="grid grid-cols-12 gap-2 md:gap-4 bg-green-800/50 p-3 rounded-xl border border-green-700/50">
                <div className="col-span-12 md:col-span-5">
                  <select 
                    value={book} 
                    onChange={(e) => setBook(e.target.value)} 
                    className="w-full bg-white text-gray-800 p-2.5 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-green-400 outline-none"
                  >
                    {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input 
                    type="number" 
                    value={chapter} 
                    onChange={(e) => setChapter(e.target.value)} 
                    placeholder="Ch"
                    className="w-full bg-white text-gray-800 p-2.5 rounded-lg text-sm font-semibold text-center focus:ring-2 focus:ring-green-400 outline-none"
                    min="1"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input 
                    type="text" 
                    value={verse} 
                    onChange={(e) => setVerse(e.target.value)} 
                    placeholder="Ver"
                    className="w-full bg-white text-gray-800 p-2.5 rounded-lg text-sm font-semibold text-center focus:ring-2 focus:ring-green-400 outline-none" 
                  />
                </div>
                <div className="col-span-4 md:col-span-3">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-400 text-green-900 p-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Search size={18} /> Read</>}
                  </button>
                </div>
              </form>
            </div>

            {/* Reading Area */}
            <div className="min-h-[400px] bg-[#fdfbf7] p-6 md:p-10 relative">
              {/* Paper Texture Overlay (Optional subtle noise) */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`}}></div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Loader2 className="animate-spin mb-3 text-green-600" size={40} />
                  <p className="font-medium animate-pulse">Turning pages...</p>
                </div>
              ) : bibleText ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                  <div className="flex justify-between items-start border-b-2 border-stone-200 pb-4 mb-6">
                    <div>
                      <h3 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
                        {bibleText.reference}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">
                        {bibleText.translation_name}
                      </p>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="text-gray-400 hover:text-green-700 transition-colors p-2 hover:bg-stone-200 rounded-full"
                      title="Copy text"
                    >
                      {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                    </button>
                  </div>
                  
                  <div className="prose prose-lg prose-stone max-w-none font-serif text-gray-800 leading-loose">
                    {bibleText.verses ? (
                      <p>
                        {bibleText.verses.map((v, i) => (
                          <span key={i} className="group hover:bg-yellow-100/50 transition-colors rounded px-0.5">
                            <sup className="text-[0.65rem] text-green-700 font-bold mr-1 select-none opacity-60 group-hover:opacity-100">{v.verse}</sup>
                            {v.text}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p>{bibleText.text}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-20">
                  <BookOpen size={64} className="mx-auto mb-4 text-stone-300" />
                  <p className="text-lg font-medium text-stone-500">Ready to study? Select a passage above.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-8" data-aos="fade-left" data-aos-delay="100">
          
          {/* EGW Library Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-900/95 p-5 text-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <h2 className="text-xl font-bold">Spirit of Prophecy</h2>
              <p className="text-sm text-blue-200 mt-1">Essential readings by Ellen G. White</p>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {EGW_BOOKS.map((book, index) => (
                  <a 
                    key={index} 
                    href={book.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 group ${book.color}`}
                  >
                    <span className="font-semibold text-sm">{book.title}</span>
                    <ExternalLink size={16} className="opacity-50 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
              <a 
                href="https://m.egwwritings.org/" 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 w-full py-3 border-2 border-dashed border-blue-200 text-blue-700 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                Open Full EGW Library <ChevronRight size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span> 
              External Resources
            </h3>
            <ul className="space-y-1">
              {[
                { title: "Sabbath School Lessons", url: "https://ssnet.org/", icon: "📖" },
                { title: "Adventist.org", url: "https://www.adventist.org/", icon: "🌍" },
                { title: "Hope Channel Live", url: "https://www.hopetv.org/", icon: "📺" },
                { title: "Adventist World", url: "https://www.adventistworld.org/", icon: "📰" }
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-800 transition-colors group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span className="font-medium text-sm">{link.title}</span>
                    <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Resources;