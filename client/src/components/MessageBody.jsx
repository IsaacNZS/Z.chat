import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";

const MessageBody = () => {
  const [allmsg, setAllmsg] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setAllmsg((prev) => [...prev, data]);
    });

    socket.on("receive_delete_message", (data) => {
      setAllmsg((prev) => prev.filter((msg) => msg._id !== data._id));
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

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
  }, []);

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
    <div className="w-full relative h-192 overflow-y-auto bg-[#1D1D1D]">
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
      <div className="relative z-10 flex flex-col gap-3 px-3 py-2">
        <h1 className="text-5xl mb-7 font-bold text-[#00aeff] text-center">
          <span className="text-white text-4xl">Welcome to </span>
          Z.chat
        </h1>

        {allmsg.length !== 0 ? (
          allmsg.map((msg, index) =>
            msg?.readerId !== id ? (
              /* Receiver */
              <div
                key={index}
                className="px-4 py-2 self-start flex flex-col items-start max-w-[85%] bg-[rgb(191,224,248)] rounded-t-[10px] rounded-br-[10px]"
              >
                <p className="text-black break-all whitespace-pre-wrap w-full text-xl font-medium">
                  {msg?.content}
                </p>

                <div className="flex mt-2 items-center gap-2">
                  <p className="text-black text-[12px]">
                    {new Date(msg?.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : (
              /* Sender */
              <div
                key={index}
                className="px-4 py-2 self-end flex flex-col text-right items-end max-w-[85%] bg-[#42c3ff] rounded-t-[10px] rounded-bl-[10px]"
              >
                <p className="text-black break-all whitespace-pre-wrap w-full text-xl font-medium">
                  {msg?.content}
                </p>

                <div className="flex items-center gap-7">
                  <button
                    onClick={() => {
                      del(msg._id);
                    }}
                  >
                    {" "}
                    <i className="fa-solid text-[12px] text-red-800 fa-trash"></i>
                  </button>
                  <div className="flex items-center mt-2 gap-2">
                    <p className="text-black text-[12px]">
                      {new Date(msg?.createdAt).toLocaleTimeString()}
                    </p>

                    <i className="text-black text-lg fa-solid fa-check"></i>
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
                width: "200px",
                height: "200px",
              }}
              alt=""
            />
            <p className="text-3xl mt-3 text-white font-bold">
              🥳 Start A Chat 🎉🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBody;
