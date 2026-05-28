import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex absolute bottom-3 items-center gap-25 mx-15 mb-5">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-3xl font-bold transition-all duration-300 ease-in-out
          ${isActive ? "text-cyan-400 scale-125" : "text-white"}`
        }
      >
        <i className="fa-solid fa-house-user"></i>
      </NavLink>

      <NavLink
        to="/Chat"
        className={({ isActive }) =>
          `text-3xl font-bold transition-all duration-300 ease-in-out
          ${isActive ? "text-cyan-400 scale-125" : "text-white"}`
        }
      >
        <i className="fa-solid fa-message"></i>
      </NavLink>

      <NavLink
        to="/Call"
        className={({ isActive }) =>
          `text-3xl font-bold transition-all duration-300 ease-in-out
          ${isActive ? "text-cyan-400 scale-125" : "text-white"}`
        }
      >
        <i className="fa-solid fa-phone-volume"></i>
      </NavLink>
    </div>
  );
};

export default Footer;
