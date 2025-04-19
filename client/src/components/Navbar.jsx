import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser, useAuth, SignInButton, UserButton } from "@clerk/clerk-react";
import { Menu, X, RefreshCw } from "lucide-react";
import { axiosInstance } from "../lib/axiosInstance";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const syncUserToDB = async () => {
      if (isSignedIn) {
        const token = await getToken();

        try {
          await axiosInstance.post(
            "/user/save",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (err) {
          console.error("User sync failed", err);
        }
      }
    };

    syncUserToDB();
  }, [isSignedIn]);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <Link to="/" className="flex items-center">
          <RefreshCw className="h-8 w-8 mr-2 text-teal-600" />
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            Skill<span className="text-teal-600">Swap</span>
          </span>
        </Link>

        <div className="flex items-center lg:order-2">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="text-gray-800 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2 lg:py-2.5 mr-2">
                  Log in
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="text-white bg-teal-600 hover:bg-teal-700 font-medium rounded-lg text-sm px-4 py-2 lg:py-2.5 mr-2 transition-colors duration-200">
                  Get started
                </button>
              </SignInButton>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="text-gray-800 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2 lg:py-2.5 mr-2"
              >
                Profile
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
              <Link
                to="/"
                className="block py-2 pr-4 pl-3 text-gray-700 hover:text-teal-600"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/matches"
                className="block py-2 pr-4 pl-3 text-gray-700 hover:text-teal-600"
              >
                Find Matches
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="block py-2 pr-4 pl-3 text-gray-700 hover:text-teal-600"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
