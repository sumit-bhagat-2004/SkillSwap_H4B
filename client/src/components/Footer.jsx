import React from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Github as GitHub, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 mr-2 text-teal-600" />
              <span className="self-center text-xl font-semibold whitespace-nowrap">
                Skill<span className="text-teal-600">Swap</span>
              </span>
            </div>
            <p className="max-w-xs mt-4 text-sm text-gray-600">
              Exchange skills, grow together. SkillSwap connects people who want
              to learn with those who want to teach.
            </p>
            <div className="flex mt-8 space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-teal-600 transition-colors duration-200"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-teal-600 transition-colors duration-200"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-teal-600 transition-colors duration-200"
              >
                <GitHub size={20} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            &copy; 2025 SkillSwap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
