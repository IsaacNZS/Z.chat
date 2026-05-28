import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";

const MessageFooter = () => {
  const [allmsg, setAllmsg] = useState([]);
  const { id } = useParams();
  const [input, setInput] = useState("");

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

  return (
    <form
      onSubmit={add}
      className="absolute bottom-3 px-3 w-full flex items-center justify-between"
    >
      <i className="fa-solid text-3xl text-[#00aeff] fa-plus"></i>
      <input
        name="msg"
        placeholder="Send message..."
        minLength={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="text-2xl bg-[#2F2F2F] w-[77%] outline-none px-4 rounded-[20px] py-2 text-white font-bold"
        type="text"
      />
      <button type="submit">
        {" "}
        <i className="text-3xl text-[#00aeff] fa-solid fa-paper-plane"></i>
      </button>
    </form>
  );
};

export default MessageFooter;
