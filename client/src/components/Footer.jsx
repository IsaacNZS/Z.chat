import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex fixed bottom-0 py-3 items-center w-full gap-25 justify-center">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-xl font-bold transition-all duration-300 ease-in-out
          ${isActive ? "text-cyan-400 scale-125" : "text-white"}`
        }
      >
        <i className="fa-solid fa-house-user"></i>
      </NavLink>

      <NavLink
        to="/Chat"
        className={({ isActive }) =>
          `text-xl font-bold transition-all duration-300 ease-in-out
          ${isActive ? "text-cyan-400 scale-125" : "text-white"}`
        }
      >
        <i className="fa-solid fa-message"></i>
      </NavLink>

      <NavLink
        to="/Call"
        className={({ isActive }) =>
          `text-xl font-bold transition-all duration-300 ease-in-out
          ${isActive ? "text-cyan-400 scale-125" : "text-white"}`
        }
      >
        <i className="fa-solid fa-phone-volume"></i>
      </NavLink>
    </div>
  );
};

export default Footer;
