import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import { toast } from "sonner";

const MessageBody = () => {
  const [allmsg, setAllmsg] = useState([]);
  const { id } = useParams();
  const bottomRef = useRef(null);
  const [user, setUser] = useState(null);
  const sendSound = new Audio("/msgsend.mp3");

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

  //message-seen
  useEffect(() => {
    socket.on("message_seen", (data) => {
      setAllmsg((prev) =>
        prev.map((msg) =>
          String(msg.senderId) === String(data.senderId) &&
          String(msg.readerId) === String(data.receiverId)
            ? { ...msg, seen: true }
            : msg,
        ),
      );
    });

    return () => {
      socket.off("message_seen");
    };
  }, []);

  //message-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [allmsg]);

  //seem-true
  useEffect(() => {
    if (!user?._id || !id) return;

    socket.emit("seen_message", {
      senderId: id,
      receiverId: user._id,
    });
  }, [id, user]);

  //message-show
  useEffect(() => {
    socket.on("receive_message", (data) => {
      const isCurrentChat =
        (String(data.senderId) === String(id) &&
          String(data.readerId) === String(user?._id)) ||
        (String(data.senderId) === String(user?._id) &&
          String(data.readerId) === String(id));

      if (isCurrentChat) {
        setAllmsg((prev) => [...prev, data]);
      }

      if (
        String(data.senderId) === String(id) &&
        String(data.readerId) === String(user?._id)
      ) {
        socket.emit("seen_message", {
          senderId: id,
          receiverId: user?._id,
        });
        return;
      }

      if (String(data.senderId) !== String(user?._id)) {
        toast.success(data.content, {
          richColors: true,
          position: "top-center",
          duration: 2000,
        });
      }
      sendSound.play();
    });

    socket.on("receive_delete_message", (data) => {
      setAllmsg((prev) => prev.filter((msg) => msg?._id !== data?._id));
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_delete_message");
    };
  }, [user, id]);

  const all = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/message/allmessage/${id}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setAllmsg(data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    all();
  }, [id]);

  const del = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/message/deletemessage/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await res.json();
      socket.emit("delete_message", data.result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 bg-[#1D1D1D] overflow-hidden w-full">
      {/* Background Layer */}
      <div
        className="absolute inset-0 opacity-50 z-0"
        style={{
          backgroundImage: `
          url('/sitting2.png'),
          url('/sitting.png'),
          url('/sitting1.png'),
          url('/heart.png'),
          url('/heart.png'),
          url('/heart.png')
        `,
          backgroundRepeat: "no-repeat",
          backgroundSize: `
          200px 200px,
          200px 200px,
          200px 200px,
          50px 50px,
          50px 50px,
          50px 50px
        `,
          backgroundPosition: `
          left 10px top 10px,
          right 10px center,
          left 10px bottom 10px,
          right 20px top 40px,
          left 20px center,
          right 20px bottom 20px
        `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto flex flex-col gap-3 px-3 py-2">
        <h1 className="text-5xl mb-7 mt-14 font-bold text-[#00aeff] text-center">
          <span className="text-white text-4xl">Welcome to </span>
          Z.chat
        </h1>
        {allmsg.length !== 0 ? (
          allmsg.map((msg, index) =>
            msg?.readerId !== id ? (
              /* Receiver */
              <div
                key={index}
                className="px-4 py-1 self-start flex flex-col items-start max-w-[85%] bg-[rgb(191,224,248)] rounded-t-[10px] rounded-br-[10px]"
              >
                <p className="text-black break-all whitespace-pre-wrap w-full text-xl font-medium">
                  {msg?.content}
                </p>

                <div className="flex mt-2 items-center gap-2">
                  <p className="text-black text-[10px]">
                    {new Date(msg?.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : (
              /* Sender */
              <div
                key={index}
                className="px-4 py-1 self-end flex flex-col text-left items-end max-w-[85%] bg-[#42c3ff] rounded-t-[10px] rounded-bl-[10px]"
              >
                <p className="text-black break-all whitespace-pre-wrap w-full text-xl font-medium">
                  {msg?.content}
                </p>

                <div className="flex items-center gap-5">
                  <button
                    onClick={() => {
                      del(msg._id);
                    }}
                  >
                    {" "}
                    <i className="fa-solid text-[10px] text-red-800 fa-trash"></i>
                  </button>
                  <div className="flex items-center mt-2 gap-2">
                    <p className="text-black text-[10px]">
                      {new Date(msg?.createdAt).toLocaleTimeString()}
                    </p>
                    {!msg?.seen ? (
                      <i className="text-blue-700 text-[12px] fa-solid fa-check"></i>
                    ) : (
                      <div className="flex">
                        {" "}
                        <i className="text-blue-700 text-[12px] fa-solid fa-check"></i>
                        <i className="text-blue-700 text-[12px] fa-solid fa-check"></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
          )
        ) : (
          <div className="flex flex-col justify-center items-center">
            {" "}
            <img
              src="/1.png"
              className="rounded-full"
              style={{
                width: "100px",
                height: "100px",
              }}
              alt=""
            />
            <p className="text-xl mt-3 text-white font-bold">
              🥳 Start A Chat 🎉🎉
            </p>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default MessageBody;
