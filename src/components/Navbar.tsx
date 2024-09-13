import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import { DarkThemeToggle } from "flowbite-react";

/**
 * A responsive navigation bar with a hamburger menu that toggles the main menu on mobile devices.
 *
 * @returns {JSX.Element} The navigation bar component.
 */
const Navbar = () => {
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggle the main menu's visibility.
   *
   * @returns {void} No return value.
   */
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Set the main menu's visibility to false when the window's width is larger than 768px.
   *
   * @returns {void} No return value.
   */
  useEffect(() => {
    if (width > 768) {
      setIsOpen(false);
    }
  }, [width]);

  return (
    <nav className="sticky top-0 z-10 border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative ">
        <a
          href="/TokenHolders/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src={logo}
            className="h-8 rounded-[50%]"
            alt="MariusToken Logo"
          />
          <span className="mb-2 self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Marius Token
          </span>
        </a>
        <div className="flex items-center">
          <DarkThemeToggle className="my-auto mr-4" />
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-expanded={isOpen}
            onClick={toggleNavbar}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden absolute left-0 right-0 bg-gray-50 dark:bg-gray-800 ${
              isOpen
                ? "top-full opacity-100 max-h-64"
                : "top-0 opacity-0 max-h-0"
            } md:relative md:top-0 md:max-h-full md:opacity-100 md:block md:w-auto`}
            id="navbar-default"
            style={{ zIndex: 100 }}
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <NavLink
                  to="/TokenHolders/"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/TokenHolders/holderWallets"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Token Holders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/TokenHolders/balanceCheck"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Balance Check
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
