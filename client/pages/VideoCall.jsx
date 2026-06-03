import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import OneToOneLayout from "../src/components/OnetooneLayout";
import CustomControls from "../src/components/CustomControls";
import { socket } from "../socket";
import { WaitingScreen } from "../src/components/WaitingScreen";

const VideoCall = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [duration, setDuration] = useState("00:00");

  useEffect(() => {
    if (!call) return;

    const startTime = Date.now();

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);

      const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
      const secs = String(seconds % 60).padStart(2, "0");

      setDuration(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [call]);

  useEffect(() => {
    let streamClient;
    let callInstance;

    const initCall = async () => {
      try {
        // Current User
        const meRes = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
          withCredentials: true,
        });

        const me = meRes.data.result;

        // Get Stream Token
        const tokenRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/call/token`,
          {
            userId: me._id,
            name: me.username,
          },
          {
            withCredentials: true,
          },
        );

        streamClient = new StreamVideoClient({
          apiKey: tokenRes.data.apiKey,
          user: {
            id: me._id,
            name: me.username,
          },
          token: tokenRes.data.token,
        });

        callInstance = streamClient.call("default", roomId);

        await callInstance.join({
          create: true,
        });

        await callInstance.camera.enable({
          videoConstraints: {
            width: 1280,
            height: 720,
          },
        });

        setClient(streamClient);
        setCall(callInstance);
      } catch (error) {
        console.error(error);
      }
    };

    initCall();

    return () => {
      callInstance?.leave();
      streamClient?.disconnectUser();
    };
  }, [roomId]);

  useEffect(() => {
    socket.emit("join-room", { roomId });
  }, [roomId]);

  useEffect(() => {
    if (!call) return;
    const handleCallEnded = async () => {
      try {
        await call.endCall();
      } catch (e) {
        console.log(e);
      }

      navigate("/Call");
    };

    socket.on("call-ended", handleCallEnded);

    return () => {
      socket.off("call-ended", handleCallEnded);
    };
  }, [call]);

  useEffect(() => {
    if (!call) return;

    call.setPreferredIncomingVideoResolution({
      width: 1280,
      height: 720,
    });
  }, [call]);

  if (!client || !call) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme>
          <div className="h-screen text-white w-full relative">
            <div className="absolute z-20 top-4 left-4 bg-black/50 px-3 py-1 rounded">
              {duration}
            </div>
            <WaitingScreen />
            {/* Video Layout */}
            <OneToOneLayout />

            {/* Default Stream Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-50">
              <CustomControls roomId={roomId} />
            </div>
          </div>
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCall;
