"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Posts from "@/src/components/home/posts";
import axios from "axios";
import LeftMenu from "@/src/components/LeftMenu/leftMenu";
import RightMenu from "@/src/components/RightMenu/rightMenu";
import { FaBars } from "react-icons/fa";

interface Post {
  _id: string;
  title: string;
  images: string[];
  caption: string;
  createdBy: {
    _id: string;
    username: string;
    email: string;
    profileImageURL: string;
  };
  likes: [];
  comments: [];
}

function UserPosts() {
  const params = useParams();
  const userId = params?.id;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("User");
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [showRightMenu, setShowRightMenu] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/userPosts/${userId}`);
        if (response.data.error) {
          setError(response.data.error);
        } else if (response.data.message) {
          setPosts([]);
        } else {
          setPosts(response.data);
          if (response.data.length > 0) {
            setUsername(response.data[0].createdBy.username);
          }
        }
      } catch (error) {
        console.log(error)
        setError("Failed to fetch user posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar - Always Visible on Large Screens */}
      <div className="hidden md:block fixed left-0 w-64 h-full">
        <LeftMenu showLeftMenu={true} setShowLeftMenu={setShowLeftMenu} />
      </div>

      {/* Right Sidebar - Always Visible on Large Screens */}
      <div className="hidden md:block fixed right-0 w-72 h-full">
        <RightMenu suggested={[]} showRightMenu={true} setShowRightMenu={setShowRightMenu} />
      </div>

      {/* Mobile Menu Toggle Buttons */}
      <button
        className="md:hidden fixed top-4 left-4 bg-gray-800 p-2 rounded-full shadow-lg z-50"
        onClick={() => setShowLeftMenu(true)}
      >
        <FaBars size={24} className="text-white" />
      </button>

      <button
        className="md:hidden fixed top-4 right-4 bg-gray-800 p-2 rounded-full shadow-lg z-50"
        onClick={() => setShowRightMenu(true)}
      >
        <FaBars size={24} className="text-white" />
      </button>

      {/* Mobile Sidebars */}
      {showLeftMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowLeftMenu(false)} />
      )}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 z-50 transform transition-transform ${
          showLeftMenu ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <LeftMenu showLeftMenu={showLeftMenu} setShowLeftMenu={setShowLeftMenu} />
      </div>

      {showRightMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowRightMenu(false)} />
      )}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-gray-900 z-50 transform transition-transform ${
          showRightMenu ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <RightMenu suggested={[]} showRightMenu={showRightMenu} setShowRightMenu={setShowRightMenu} />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-start md:ml-64 md:mr-72 p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{username}&apos;s Posts</h1>
        <div className="w-full max-w-3xl space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition transform hover:scale-[1.02]"
              >
                <Posts post={post} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">No posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPosts;
