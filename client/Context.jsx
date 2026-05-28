import { createContext, useState, useEffect } from "react";
import { socket } from "./socket";

// Context create
export const UserContext = createContext();

// Provider component
const UserProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [user, setUser] = useState(null);

  const userinfo = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/`, {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("add_user", user._id);

      socket.on("online_users", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.off("online_users");
      };
    }
  }, [user]);

  useEffect(() => {
    userinfo();
  }, []);

  return (
    <UserContext.Provider value={{ onlineUsers, setOnlineUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
