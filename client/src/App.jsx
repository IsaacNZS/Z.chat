import { Routes, Route, Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Chat from "../pages/Chat";
import Call from "../pages/Call";
import Home from "../pages/Home";
import Footer from "./components/Footer";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Message from "../pages/Message";
import UserProvider from "../Context";
import Edit from "../pages/Edit";
import { socket } from "../socket";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { generatetoken, messaging } from "./notification/firebase";
import { onMessage } from "firebase/messaging";
import { useNavigate } from "react-router-dom";
import VideoCall from "../pages/VideoCall";

function MainLayout() {
  return (
    <div className="w-full h-screen">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const notifySound = new Audio("/noti.mp3");
  const callingSound = new Audio("/calling.mp3");
  const lastSoundTimeRef = useRef(0);

  useEffect(() => {
    socket.on("incoming-call", ({ caller, receiver, roomId }) => {
      callingSound.loop = true;
      callingSound.play();
      const toastId = toast(
        <div className="w-full">
          <h3 className="w-full font-bold">
            {caller.username} is Video Calling...
          </h3>

          <div className="flex w-full justify-end gap-3 mt-2">
            <button
              className="bg-green-500 px-2 py-1 rounded"
              onClick={() => {
                callingSound.pause();
                callingSound.currentTime = 0;
                socket.emit("call-accepted", {
                  roomId,
                  callerId: caller._id,
                });

                navigate(`/call/${roomId}`, {
                  state: {
                    receiver: caller,
                    caller: receiver,
                  },
                });

                toast.dismiss(toastId);
              }}
            >
              Accept
            </button>

            <button
              className="bg-red-500 px-2 py-1 rounded"
              onClick={() => {
                callingSound.pause();
                callingSound.currentTime = 0;
                socket.emit("call-rejected", {
                  roomId,
                  caller: caller,
                  receiver: receiver,
                });
                toast.dismiss(toastId);
              }}
            >
              Reject
            </button>
          </div>
        </div>,
        {
          duration: Infinity, // 👈 မပျောက်အောင်
          position: "top-center",
        },
      );
      socket.on("call-cancelled", () => {
        callingSound.pause();
        callingSound.currentTime = 0;
        toast.dismiss(toastId);
      });
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-cancelled");
    };
  }, []);

  useEffect(() => {
    const handler = (data) => {
      toast.success(data.content, {
        richColors: true,
        position: "top-center",
        duration: 5000,
        action: {
          label: "show",
          onClick: () => navigate(`/message/${data.senderId}`),
        },
      });

      const now = Date.now();

      if (now - lastSoundTimeRef.current > 1000) {
        notifySound.play();
        lastSoundTimeRef.current = now;
      }
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler); // 🔥 important
    };
  }, [navigate]);

  useEffect(() => {
    generatetoken();
    onMessage(messaging, (payload) => {});
  }, []);

  return (
    <div>
      <UserProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Call" element={<Call />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/message/:id" element={<Message />} />
          <Route path="/call/:roomId" element={<VideoCall />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
