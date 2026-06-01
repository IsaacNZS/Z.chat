import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import Emoji from "./Emoji";

const MessageFooter = () => {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const [typing, setTyping] = useState();
  const [user, setUser] = useState(null);
  const typingTimeout = useRef(null);
  const [emoji, setEmoji] = useState(false);
  const typingSound = new Audio("/typing.mp3");
  typingSound.volume = 0.3;

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

  useEffect(() => {
    socket.on("show_typing", (data) => {
      if (data.senderId === id) {
        setTyping(true);
      }

      typingSound.play();
    });

    socket.on("hide_typing", (data) => {
      if (data.senderId === id) {
        setTyping(false);
      }
    });

    return () => {
      socket.off("show_typing");
      socket.off("hide_typing");
    };
  }, [id]);

  const add = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const msg = formData.get("msg");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/message/addmessage/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            msg,
          }),
        },
      );
      const data = await res.json();
      socket.emit("send_message", data.result);
      if (res.ok) setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [input]);

  return (
    <div className="w-full flex flex-col relative">
      <form onSubmit={add} className="px-4 py-2 flex items-end justify-between">
        <i
          onClick={() => setEmoji(!emoji)}
          className="fa-solid text-2xl text-[#00aeff] fa-plus"
        ></i>
        <div className="flex w-full items-center gap-1 justify-center flex-col">
          {typing && (
            <div className="flex w-full items-center">
              {" "}
              <img
                src="/bell.png"
                alt="logo"
                style={{
                  width: "27px",
                  height: "25px",
                }}
                className="animate-spin  rounded-full"
              />
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full bg-yellow-500"
                  style={{ animation: "typingDot 1.4s infinite" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-yellow-500"
                  style={{
                    animation: "typingDot 1.4s infinite",
                    animationDelay: "0.2s",
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-yellow-500"
                  style={{
                    animation: "typingDot 1.4s infinite",
                    animationDelay: "0.4s",
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-yellow-500"
                  style={{
                    animation: "typingDot 1.4s infinite",
                    animationDelay: "0.6s",
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-yellow-500"
                  style={{
                    animation: "typingDot 1.4s infinite",
                    animationDelay: "0.8s",
                  }}
                />
              </div>
            </div>
          )}
          <textarea
            ref={textareaRef}
            name="msg"
            placeholder="Send message..."
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);

              if (!user?._id) return;

              socket.emit("typing", {
                senderId: user._id,
                readerId: id,
              });

              clearTimeout(typingTimeout.current);

              typingTimeout.current = setTimeout(() => {
                socket.emit("stop_typing", {
                  senderId: user._id,
                  readerId: id,
                });
              }, 1000);
            }}
            className="
    text-lg
    bg-[#2F2F2F]
    w-[80%]
    outline-none
    px-4
    rounded-[20px]
    py-2
    text-white
    resize-none
    max-h-30
    overflow-y-hidden
  "
          />
        </div>
        <button type="submit">
          {" "}
          <i className="text-2xl text-[#00aeff] fa-solid fa-paper-plane"></i>
        </button>
      </form>
      {emoji && <Emoji setInput={setInput} />}
    </div>
  );
};

export default MessageFooter;
