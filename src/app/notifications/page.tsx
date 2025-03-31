"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import LeftMenu from "@/src/components/LeftMenu/leftMenu";
import { FaBars, FaTimes } from "react-icons/fa";

interface FriendRequest {
  _id: string;
  sender: {
    _id: string;
    username: string;
    profileImageURL: string;
  };
}

const FollowRequests = () => {
  const [myId, setMyId] = useState<string | null>(null);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLeftMenu, setShowLeftMenu] = useState(false);

  useEffect(() => {
    const fetchMyId = async () => {
      try {
        const res = await axios.get(`/api/users/me`);
        setMyId(res.data.data._id);
      } catch (error) {
        console.log(error)
        setError("Error fetching user ID");
      }
    };

    fetchMyId();
  }, []);

  useEffect(() => {
    if (!myId) return;

    const fetchRequests = async () => {
      try {
        const res = await axios.get(`/api/friend-request/pending/${myId}`);
        setRequests(res.data.receivedRequests);
      } catch (error) {
        console.log(error)
        setError("Error fetching follow requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [myId]);

  const handleAction = async (requestId: string, action: "accept" | "decline") => {
    if (!myId) return;

    try {
      const url = `/api/friend-request/${action}`;
      const payload = { requestId, userId: myId };

      if (action === "accept") {
        await axios.patch(url, payload);
      } else {
        await axios.delete(url, { data: payload });
      }

      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error(`Error ${action}ing request:`, error || error);
    }
  };

  return (
    <div>
      <div>
        <button
          className="md:hidden fixed top-4 left-4 bg-gray-800 p-2 rounded-full shadow-lg z-50"
          onClick={() => setShowLeftMenu(true)}
        >
          <FaBars size={24} />
        </button>

        {/* Left Sidebar with Backdrop */}
        {showLeftMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowLeftMenu(false)}
          ></div>
        )}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-gray-900 z-50 transform transition-transform ${
            showLeftMenu ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:block`}
        >
          <button className="md:hidden absolute top-4 right-4" onClick={() => setShowLeftMenu(false)}>
            <FaTimes size={24} />
          </button>
          <LeftMenu showLeftMenu={showLeftMenu} setShowLeftMenu={setShowLeftMenu} />
        </div>
      </div>
    <div className="min-h-screen flex flex-col items-center p-10 text-white bg-black">
              
      <h1 className="text-3xl font-bold mb-6">Follow Requests</h1>

      {loading ? (
        <p className="text-lg font-semibold animate-pulse">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-400">No pending requests</p>
      ) : (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-lg">
          {requests.map((req) => (
            <div key={req._id} className="flex items-center justify-between mb-4 p-4 bg-gray-700 rounded-lg shadow-md">
              <div className="flex items-center gap-4">
                <img
                  src={req.sender.profileImageURL}
                  alt={req.sender.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <Link href={`/profile/${req.sender._id}`}>
                  <p className="text-lg font-medium hover:underline cursor-pointer">{req.sender.username}</p>
                </Link>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white"
                  onClick={() => handleAction(req._id, "accept")}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                  onClick={() => handleAction(req._id, "decline")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default FollowRequests;
