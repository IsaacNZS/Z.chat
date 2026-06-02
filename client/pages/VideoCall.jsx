import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
} from "@stream-io/video-react-sdk";

import CallHeader from "../src/components/CallHeader";
import CallBody from "../src/components/CallBody";
import CustomCallControls from "../src/components/CallControls";

const VideoCall = () => {
  const { roomId } = useParams();
  const location = useLocation();

  const receiver = location.state?.receiver;

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
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

        const callInstance = streamClient.call("default", roomId);

        await callInstance.join({
          create: true,
        });

        setClient(streamClient);
        setCall(callInstance);
      } catch (err) {
        console.log(err);
      }
    };

    init();

    return () => {
      call?.leave();
      client?.disconnectUser();
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
        <div className="h-screen bg-black relative overflow-hidden">
          <CallHeader receiver={receiver} />

          <CallBody />

          <CustomCallControls />
        </div>
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCall;
