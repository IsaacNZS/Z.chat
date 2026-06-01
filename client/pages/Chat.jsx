import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import { useContext } from "react";
import { socket } from "../socket";

const Chat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [alluser, setAlluser] = useState([]);
  const [search, setSearch] = useState("");
  const { onlineUsers } = useContext(UserContext);
  const [unread, setUnread] = useState([]);
  const notifySound = new Audio("/noti.mp3");
  const lastSoundTimeRef = useRef(0);

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

  const unreadmsg = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/message/unread/${user?._id}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setUnread(data.result);
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
    if (!user) return;
    socket.on("receive_message", () => {
      unreadmsg(); // refresh unread count
      const now = Date.now();

      if (now - lastSoundTimeRef.current > 1000) {
        notifySound.play();
        lastSoundTimeRef.current = now;
      }
    });

    return () => socket.off("receive_message");
  }, [user]);

  useEffect(() => {
    if (user) unreadmsg();
  }, [user]);

  useEffect(() => {
    userinfo();
    all();
  }, [search]);

  const filterUsers = alluser.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex w-full pt-17 h-full mt-3 flex-col items-center">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="px-6 py-1 mb-2 rounded-full outline-none text-xl font-bold active:border-none bg-blue-100 w-[90%]"
      />{" "}
      <div className="overflow-y-auto w-[96%] mt-2 h-[88%]">
        {filterUsers?.map((user) => {
          const count = unread.filter(
            (msg) => msg.senderId === user._id,
          )?.length;

          return (
            <div
              key={user._id}
              onClick={() => {
                navigate(`/message/${user?._id}`);
              }}
              className={`
  flex px-3 py-2 border items-center relative mt-3 rounded-[20px] w-[93%]
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
                  width: "55px",
                  height: "55px",
                }}
                className="border-2 border-[#00aeff] rounded-full"
              />
              <i
                className={`fa-solid absolute text-[10px] left-12 bottom-3 border-3 border-white rounded-full ${
                  onlineUsers.includes(user?._id)
                    ? "text-[#00aeff]"
                    : "text-gray-600"
                } fa-circle`}
              ></i>
              <div className="flex gap-1 flex-col">
                {" "}
                <p className="text-[#00aeff]">
                  <span className="text-xl font-bold"> {user?.username}</span>
                </p>
                <p className="text-[#ffffff] text-[11px]">
                  <i className="fa-solid text-red-500 fa-book"></i> Bio :{" "}
                  {user?.bio ? user.bio : "❤️GOD BLESS YOU❤️"}
                </p>
              </div>
              {count > 0 && (
                <p className="text-[16px] font-bold absolute top-5 right-2 px-2 bg-green-500 text-white border rounded-full">
                  {count}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
