import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  SpeakerLayout,
  CallControls,
  StreamTheme,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const VideoCall = () => {
  const { roomId } = useParams();
  const location = useLocation();

  const receiver = location.state?.receiver;

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

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
          <div className="h-screen relative">
            {/* Header */}
            <div className="absolute top-5 left-0 right-0 z-50 text-center text-white">
              <h2 className="font-bold text-lg">
                {receiver?.username || "Video Call"}
              </h2>
            </div>

            {/* Video Layout */}
            <SpeakerLayout participantsBarPosition="bottom" />

            {/* Default Stream Controls */}
            <CallControls />
          </div>
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCall;
