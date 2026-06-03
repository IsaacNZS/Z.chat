import {
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
  useCall,
} from "@stream-io/video-react-sdk";

import { useState } from "react";
import { socket } from "../../socket";

const CustomControls = ({ roomId }) => {
  const call = useCall();
  const [isRecording, setIsRecording] = useState(false);

  // Start / Stop recording (if enabled in backend)
  const toggleRecording = async () => {
    try {
      if (!call) return;

      if (isRecording) {
        await call.stopRecording();
        setIsRecording(false);
      } else {
        await call.startRecording();
        setIsRecording(true);
      }
    } catch (err) {
      console.log("Recording error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 bg-black/60 p-3 rounded-full">
      {/* Mute / Unmute Mic */}
      <ToggleAudioPublishingButton />

      {/* Camera On/Off */}
      <ToggleVideoPublishingButton />

      {/* Screen Share */}
      <ScreenShareButton />

      {/* Recording */}
      <button
        onClick={toggleRecording}
        className={`px-3 py-2 rounded-full text-white ${
          isRecording ? "bg-red-600" : "bg-gray-700"
        }`}
      >
        {isRecording ? (
          <i className="fa-solid animate-pulse fa-record-vinyl"></i>
        ) : (
          <i className="fa-solid fa-record-vinyl"></i>
        )}
      </button>

      {/* End Call (IMPORTANT) */}
      <button
        onClick={() => {
          socket.emit("call-ended", { roomId });
        }}
        className="bg-red-600 text-white px-4 py-2 rounded-full"
      >
        <i className="fa-solid fa-phone"></i>
      </button>
    </div>
  );
};

export default CustomControls;
