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
      className="fixed bottom-3 px-4 w-full flex items-center justify-between"
    >
      <i className="fa-solid text-xl text-[#00aeff] fa-plus"></i>
      <textarea
        name="msg"
        placeholder="Send message..."
        minLength={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={1}
        className="
    text-xl
    bg-[#2F2F2F]
    w-[77%]
    outline-none
    px-4
    rounded-[20px]
    py-1
    text-white
    font-bold
    resize-none
    overflow-y-auto
    max-h-30
    wrap-break-word
  "
      />
      <button type="submit">
        {" "}
        <i className="text-xl text-[#00aeff] fa-solid fa-paper-plane"></i>
      </button>
    </form>
  );
};

export default MessageFooter;
