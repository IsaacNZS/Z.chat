import { useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";

const CustomCallControls = () => {
  const call = useCall();

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [currentCamera, setCurrentCamera] = useState(0);

  const toggleMic = async () => {
    try {
      if (isMuted) {
        await call.microphone.enable();
      } else {
        await call.microphone.disable();
      }

      setIsMuted(!isMuted);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCamera = async () => {
    try {
      if (isCameraOff) {
        await call.camera.enable();
      } else {
        await call.camera.disable();
      }

      setIsCameraOff(!isCameraOff);
    } catch (err) {
      console.error(err);
    }
  };

  const flipCamera = async () => {
    try {
      if (isCameraOff) return;

      const devices = await navigator.mediaDevices.enumerateDevices();

      const cameras = devices.filter((device) => device.kind === "videoinput");

      if (cameras.length < 2) return;

      const nextIndex = (currentCamera + 1) % cameras.length;

      await call.camera.select(cameras[nextIndex].deviceId);

      setCurrentCamera(nextIndex);
    } catch (err) {
      console.error(err);
    }
  };

  const leaveCall = async () => {
    try {
      await call.leave();
      window.history.back();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute bottom-8 left-0 w-full flex justify-center items-center gap-5 z-50">
      {/* MIC */}
      <button
        onClick={toggleMic}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all
        ${
          isMuted
            ? "bg-red-500 text-white"
            : "bg-white/20 backdrop-blur-md text-white"
        }`}
      >
        <i
          className={
            isMuted
              ? "fa-solid fa-microphone-lines-slash"
              : "fa-solid fa-microphone-lines"
          }
        />
      </button>

      {/* FLIP CAMERA */}
      <button
        disabled={isCameraOff}
        onClick={flipCamera}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all
        ${
          isCameraOff
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-white/20 backdrop-blur-md text-white"
        }`}
      >
        <i className="fa-solid fa-camera-rotate" />
      </button>

      {/* END CALL */}
      <button
        onClick={leaveCall}
        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white text-2xl transition-all"
      >
        <i className="fa-solid fa-phone rotate-135" />
      </button>

      {/* CAMERA */}
      <button
        onClick={toggleCamera}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all
        ${
          isCameraOff
            ? "bg-red-500 text-white"
            : "bg-white/20 backdrop-blur-md text-white"
        }`}
      >
        <i
          className={
            isCameraOff ? "fa-solid fa-video-slash" : "fa-solid fa-video"
          }
        />
      </button>
    </div>
  );
};

export default CustomCallControls;
