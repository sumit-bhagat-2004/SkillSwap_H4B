import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, RefreshCw, X, Menu } from "lucide-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axiosInstance";

const Navbar = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const toggleModal = () => setModalOpen(!modalOpen);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        const res = await axiosInstance.get("/request/get-requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(res.data.requests);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    };

    if (modalOpen) fetchRequests();
  }, [modalOpen]);

  useEffect(() => {
    const syncUserToDB = async () => {
      if (isSignedIn) {
        const token = await getToken();

        try {
          const res = await axiosInstance.post(
            "/user/save",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const isOnboarded = res.data.user?.isOnboarded;
          if (!isOnboarded) {
            navigate("/onboarding");
          }
        } catch (err) {
          console.error("User sync failed", err);
        }
      }
    };

    syncUserToDB();
  }, [isSignedIn]);

  const respondToRequest = async (requestId, action) => {
    try {
      const token = await getToken();
      await axiosInstance.put(
        `/request/respond/${requestId}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      alert(`Could not ${action} request`);
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <RefreshCw className="h-8 w-8 mr-2 text-teal-600" />
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              Skill<span className="text-teal-600">Swap</span>
            </span>
          </Link>

          <div className="flex items-center lg:order-2 space-x-4">
            <SignedIn>
              <button
                onClick={toggleModal}
                className="relative text-gray-600 hover:text-teal-600"
                title="View Requests"
              >
                <Bell size={22} />
                {requests.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                    {requests.length}
                  </span>
                )}
              </button>

              <Link
                to="/profile"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition"
              >
                Profile
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div
            className={`${
              isOpen ? "block" : "hidden"
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link to="/" className="text-gray-700 hover:text-teal-600">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/matches"
                  className="text-gray-700 hover:text-teal-600"
                >
                  Find Matches
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-teal-600"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-start pt-24 z-50">
          <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-6 relative">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Incoming Requests
            </h2>
            {requests.length === 0 ? (
              <p className="text-gray-500 text-sm">No requests received.</p>
            ) : (
              <ul className="space-y-4 max-h-[300px] overflow-y-auto">
                {requests.map((req, idx) => (
                  <li key={idx} className="p-3 border rounded-md bg-gray-50">
                    <p className="font-medium">{req.fromUser?.firstName}</p>
                    <p className="text-sm text-gray-600">
                      Wants to learn: {req.skillToLearn}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Requested at: {new Date(req.createdAt).toLocaleString()}
                    </p>

                    <div className="mt-3 flex space-x-2">
                      <button
                        className="px-3 py-1 text-sm text-white bg-teal-600 rounded hover:bg-teal-700"
                        onClick={() => respondToRequest(req._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100"
                        onClick={() => respondToRequest(req._id, "declined")}
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
