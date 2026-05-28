import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context";

const MessageHeader = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { onlineUsers } = useContext(UserContext);

  const userinfo = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/profile/${id}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setUser(data.result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    userinfo();
  }, []);

  return (
    <div className="flex relative items-center justify-between py-2 px-4">
      <div className="flex items-center gap-39">
        {" "}
        <div className="flex gap-5 items-center">
          <i
            onClick={() => navigate("/Chat")}
            className="text-[#00aeff] text-3xl fa-solid fa-arrow-left"
          ></i>
          <img
            src={
              !user?.profileimg || user?.profileimg === ""
                ? "/1.png"
                : user?.profileimg
            }
            alt="logo"
            style={{
              width: "60px",
              height: "60px",
            }}
            className="border-2 border-[#00aeff] rounded-full"
          />
          <div
            onClick={() => {
              navigate(`/profile/${user?._id}`);
            }}
            className="flex flex-col"
          >
            {" "}
            <p className="text-[#00aeff]">
              <span className="text-3xl font-bold"> {user?.username}</span>
            </p>
            <p
              className={`text-[18px] ${
                onlineUsers.includes(user?._id)
                  ? "text-[#00aeff]"
                  : "text-gray-400"
              }`}
            >
              {onlineUsers.includes(user?._id) ? "online" : "offline"}
            </p>
          </div>
        </div>
        <i
          onClick={() => setMenu(!menu)}
          className="fa-solid text-3xl font-bold text-[#3190d8] fa-bars"
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

export default MessageHeader;
