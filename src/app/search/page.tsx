"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import LeftMenu from "@/src/components/LeftMenu/leftMenu";
import { FaBars, FaTimes } from "react-icons/fa";

interface User {
  id: string;
  username: string;
  profileImageURL: string;
  followersCount: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/search?q=${query}`);
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 bg-gray-800 p-2 rounded-full shadow-lg z-50"
        onClick={() => setShowLeftMenu(!showLeftMenu)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar (Always visible on md screens) */}
      <div className="hidden md:block w-64">
        <LeftMenu showLeftMenu={true} setShowLeftMenu={() => {}} />
      </div>

      {/* Sidebar (Mobile - Toggleable) */}
      <AnimatePresence>
        {showLeftMenu && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-64 h-screen bg-gray-900 z-50 md:hidden"
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-white p-2 rounded-full"
                onClick={() => setShowLeftMenu(false)}
              >
                <FaTimes size={24} />
              </button>
              <LeftMenu showLeftMenu={true} setShowLeftMenu={setShowLeftMenu} />
            </motion.div>

            {/* Backdrop (Click to Close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowLeftMenu(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white md:pl-64">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl relative"
        >
          <input
            type="text"
            placeholder="Search for users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 pl-12 text-lg text-white bg-opacity-20 border border-gray-600 rounded-full backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-lg"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          />
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-300 text-xl">
            🔍
          </div>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {query && (
            <motion.div
              key="results-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl mt-5 bg-black bg-opacity-50 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl p-4"
            >
              <h2 className="text-xl font-semibold text-gray-300 mb-3">Results:</h2>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-gray-800 animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                      <div className="space-y-2">
                        <div className="w-40 h-4 bg-gray-700 rounded"></div>
                        <div className="w-24 h-3 bg-gray-600 rounded"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-4">
                  {results.map((user) => (
                    <motion.li
                      key={user.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-opacity-30 hover:bg-gray-800 transition-all cursor-pointer"
                      onClick={() => router.push(`/profile/${user.id}`)}
                    >
                      <img
                        src={user.profileImageURL || '/noAvatar.png'}
                        alt={user.username}
                        className="w-12 h-12 rounded-full border border-gray-500 shadow-md"
                      />
                      <div>
                        <p className="text-white font-semibold text-lg">{user.username}</p>
                        <p className="text-gray-400 text-sm">{user.followersCount} followers</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
