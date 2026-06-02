import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import { useContext } from "react";
import { socket } from "../socket";
import { toast } from "sonner";

const Call = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [alluser, setAlluser] = useState([]);
  const { onlineUsers, setOnlineUsers } = useContext(UserContext);
  const [callingUserId, setCallingUserId] = useState(null);
  const waitingSound = new Audio("/waiting.mp3");
  const ejectSound = new Audio("/eject.mp3");

  useEffect(() => {
    const handleCallJoined = ({ roomId }) => {
      waitingSound.pause();
      waitingSound.currentTime = 0;
      ejectSound.play();
      setCallingUserId(null);
      navigate(`/call/${roomId}`);
    };

    socket.on("call-joined", handleCallJoined);

    return () => {
      socket.off("call-joined", handleCallJoined);
    };
  }, [navigate]);

  useEffect(() => {
    const handleCallJoined = ({ roomId, receiver }) => {
      waitingSound.pause();
      waitingSound.currentTime = 0;
      ejectSound.play();
      setCallingUserId(null);
      toast.error(
        "OMG!😠 " +
          receiver.username +
          " rejected your call.😠 Send a message!",
        {
          richColors: true,
          position: "top-center",
          duration: 5000,
          action: {
            label: "Go Chat",
            onClick: () => navigate(`/message/${receiver._id}`),
          },
        },
      );
    };

    socket.on("call-rejected", handleCallJoined);

    return () => {
      socket.off("call-rejected", handleCallJoined);
    };
  }, [navigate]);

  const startCall = async (receiver) => {
    try {
      const roomId = [user._id, receiver._id].sort().join("-");
      setCallingUserId(receiver._id);

      socket.emit("call-user", {
        caller: user,
        receiver,
        roomId,
      });
    } catch (err) {
      console.log(err);
    }
  };

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

  const cancle = (data) => {
    setCallingUserId(null);
    toast.error("You cancelled calling to " + data.username, {
      richColors: true,
      position: "top-center",
      duration: 5000,
    });

    socket.emit("call-cancelled", data);
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
      <div className="overflow-y-auto fixed top-12 w-full mt-2 h-[87%]">
        {alluser?.map((user) => (
          <div
            key={user._id}
            className={`
  flex px-3 py-2 border relative mt-3 rounded-[20px] w-[93%]
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
            {callingUserId === user._id ? (
              <button
                onClick={() => {
                  (cancle(user),
                    waitingSound.pause(),
                    (waitingSound.currentTime = 0));
                }}
                className="text-[#00aeff] animate-pulse text-xl absolute right-5 top-1/2 -translate-y-1/2"
              >
                <i className="fa-solid fa-phone-volume"></i>
              </button>
            ) : (
              <button
                onClick={() => {
                  startCall(user);
                  waitingSound.play();
                  waitingSound.loop = true;
                }}
                className="text-[#00aeff] text-xl absolute right-5 top-1/2 -translate-y-1/2"
              >
                <i className="fa-solid fa-phone"></i>
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Call;
