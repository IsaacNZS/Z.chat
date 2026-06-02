import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  PaginatedGridLayout,
  CallControls,
} from "@stream-io/video-react-sdk";

const VideoCall = () => {
  const { roomId } = useParams();
  const location = useLocation();

  const receiver = location.state?.receiver;

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // 🔥 IMPORTANT: get REAL logged-in user from API
        const meRes = await axios.get(`${import.meta.env.VITE_API_URL}/user/`, {
          withCredentials: true,
        });

        const me = meRes.data.result;

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/call/token`,
          {
            userId: me._id,
            name: me.username,
          },
        );

        const streamClient = new StreamVideoClient({
          apiKey: res.data.apiKey,
          user: {
            id: me._id,
            name: me.username,
          },
          token: res.data.token,
        });

        setClient(streamClient);

        const call = streamClient.call("default", roomId);

        await call.join({ create: true });

        setCall(call);
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, [roomId]);

  if (!client || !call) return <div>Loading...</div>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        {/* VIDEO AREA */}
        <div style={{ height: "100vh", width: "100%", background: "black" }}>
          <PaginatedGridLayout />
        </div>

        {/* CONTROLS */}
        <div
          style={{
            position: "fixed",
            bottom: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <CallControls />
        </div>
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCall;
