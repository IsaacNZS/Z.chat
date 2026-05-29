import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const [menu, setMenu] = useState(false);

  const navigate = useNavigate();
  const logout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      navigate("/auth/login");
    } catch (err) {
      console.log(err);
    }
  };

  const del = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const res1 = await fetch(
          `${import.meta.env.VITE_API_URL}/user/deleteuser/${data.result._id}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );
        navigate("/auth/register");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed top-0 z-50 w-full">
      {" "}
      <div className="flex bg-gray-900 items-center justify-between px-4 py-2">
        {" "}
        <p className="text-[#3190d8] text-4xl font-bold m-1">
          Z.chat <i className="fa-regular fa-comment-dots"></i>
        </p>
        <i
          onClick={() => setMenu(!menu)}
          className="fa-solid text-2xl font-bold text-[#3190d8] fa-bars"
        ></i>
      </div>
      {menu && (
        <div className="flex flex-col">
          <button
            onClick={() => navigate(`/edit`)}
            className="px-3 py-2 absolute z-50 right-7 top-12  rounded-tl-xl text-[#3190d8] bg-white/90 font-bold w-[30%]"
          >
            <i className="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button
            onClick={() => logout()}
            className="px-3 py-2 absolute z-50 right-7 top-22 text-yellow-600 bg-white/90 font-bold w-[30%]"
          >
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
          <button
            onClick={() => del()}
            className="px-3 py-2 absolute z-50 right-7 top-32 text-red-500 bg-white/90 rounded-b-xl font-bold w-[30%]"
          >
            <i className="fa-solid fa-right-from-bracket"></i> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Nav;
