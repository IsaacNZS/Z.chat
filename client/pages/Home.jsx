import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context";

const Home = () => {
  const items = [
    "live.mp4",
    "live5.mp4",
    "live2.mp4",
    "live3.mp4",
    "live4.mp4",
  ];
  const randomItem = items[Math.floor(Math.random() * items.length)];
  const [friend, setFriend] = useState();
  const [user, setUser] = useState(null);
  const [alluser, setAlluser] = useState([]);
  const [Fuser, setFuser] = useState([]);
  const navigate = useNavigate();
  const { onlineUsers } = useContext(UserContext);

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

  const friend1 = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/message/friends/${user?._id}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setFuser(data.result);
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
        navigate("/auth/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    userinfo();
  }, []);

  return (
    <>
      {" "}
      <div className="flex relative flex-col">
        <video width="600" playsInline loop autoPlay muted>
          <source src={randomItem} type="video/mp4" />
        </video>
        <div className="flex absolute gap-5 items-end bottom-8 left-5">
          {" "}
          <img
            src={
              !user?.profileimg || user?.profileimg === ""
                ? "/1.png"
                : user?.profileimg
            }
            alt="logo"
            style={{
              width: "110px",
              height: "110px",
            }}
            className="border-2 border-[#00aeff] rounded-full"
          />
          <i
            className="fa-solid absolute text-[20px] left-20 bottom-1 border-3 border-white rounded-full 
    text-[#00aeff]
             fa-circle"
          ></i>
          <div className="flex flex-col">
            {" "}
            <p className="text-[#00aeff]">
              <span className="text-5xl font-bold"> {user?.username}</span>
            </p>
            <p className="text-[#93ff8b]">
              <i className="fa-regular fa-calendar-days"></i>{" "}
              {new Date(user?.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex mt-15 ml-7 flex-col text-xl text-white">
          <p className="text-white">
            <i className="fa-solid text-red-500 fa-book"></i> Bio :{" "}
            {user?.bio ? user.bio : "❤️GOD BLESS YOU❤️"}
          </p>
        </div>
      </div>
      <div className="flex flex-col w-full mt-3 items-center justify-center">
        <div className="flex border-b w-full border-red-500 justify-between">
          <button
            onClick={() => {
              (friend1(), setFriend(true));
            }}
            className="text-2xl w-1/2 font-bold text-white px-4 py-2
    border-b-2 border-transparent
    transition-all duration-300 ease-in-out
    focus:scale-105
    focus:border-red-500
    focus:text-[#8cdbff]
"
          >
            <i className="fa-solid fa-user-group"></i> Friends
          </button>
          <button
            onClick={() => {
              (all(), setFriend(false));
            }}
            className="text-2xl w-1/2 font-bold text-white px-4 py-2
    border-b-2 border-transparent
    transition-all duration-300 ease-in-out
    focus:scale-105
    focus:border-red-500
    focus:text-[#8cdbff]
"
          >
            <i className="fa-solid fa-users"></i> All Users
          </button>
        </div>
      </div>
      {friend ? (
        Fuser?.length !== 0 ? (
          Fuser?.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                navigate(`/profile/${user._id}`);
              }}
              className={`
  flex px-3 py-2 border relative overflow-y-scroll mt-3 rounded-[20px]
  mx-3 border-red-400 gap-8
  transition-all duration-300
  hover:scale-[1.02]
  ${friend ? "animate-[slideRight_.4s_ease]" : "animate-[slideLeft_.4s_ease]"}
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
          ))
        ) : (
          <div className="flex flex-col items-center mt-10 gap-3">
            <img
              src="/crying.gif"
              style={{
                width: "200px",
                height: "170px",
              }}
              alt=""
            />

            <p className="text-gray-400 text-xl font-bold">No friends yet 🥺</p>

            <p className="text-cyan-300">
              Start chatting to make new friends 💬
            </p>
          </div>
        )
      ) : (
        alluser?.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              navigate(`/profile/${user._id}`);
            }}
            className={`
  flex px-3 py-2 border relative overflow-y-scroll mt-3 rounded-[20px]
  mx-3 border-red-400 gap-8
  transition-all duration-300
  hover:scale-[1.02]
  ${friend ? "animate-[slideRight_.4s_ease]" : "animate-[slideLeft_.4s_ease]"}
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
        ))
      )}
    </>
  );
};

export default Home;
