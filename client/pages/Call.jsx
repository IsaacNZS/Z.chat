import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import { useContext } from "react";

const Call = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [alluser, setAlluser] = useState([]);
  const { onlineUsers, setOnlineUsers } = useContext(UserContext);

  const all = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/allusers`, {
        credentials: "include",
      });
      const data = await res.json();
      setAlluser(data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const userinfo = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();

        setUser(data.result);
      } else {
        navigate("/auth/register");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    userinfo();
    all();
  }, []);

  return (
    <>
      {alluser?.map((user) => (
        <div
          key={user._id}
          onClick={() => {
            navigate("/message");
          }}
          className={`
  flex px-3 py-2 border relative overflow-y-scroll mt-3 rounded-[20px] w-[93%]
  mx-3 border-red-400 gap-8
  transition-all duration-300
  hover:scale-[1.02]
 animate-[slideLeft_.4s_ease]
`}
        >
          <img
            src={
              !user?.profileimg || user?.profileimg === ""
                ? "/1.png"
                : user?.profileimg
            }
            alt="logo"
            style={{
              width: "69px",
              height: "69px",
            }}
            className="border-2 border-[#00aeff] rounded-full"
          />
          <i
            className={`fa-solid absolute text-[13px] left-15 bottom-2 border-3 border-white rounded-full ${
              onlineUsers.includes(user?._id)
                ? "text-[#00aeff]"
                : "text-gray-600"
            } fa-circle`}
          ></i>
          <div className="flex flex-col">
            {" "}
            <p className="text-[#00aeff]">
              <span className="text-3xl font-bold"> {user?.username}</span>
            </p>
            <p className="text-[#ffffff]">
              <i className="fa-solid text-red-500 fa-book"></i> Bio :{" "}
              {user?.bio ? user.bio : "❤️GOD BLESS YOU❤️"}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Call;
