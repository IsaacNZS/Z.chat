import { useCallStateHooks } from "@stream-io/video-react-sdk";

export const WaitingScreen = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  if (participants.length >= 2) return null;

  return (
    <div className="w-full h-full flex items-center justify-center text-white">
      <img
        src="/waiting.gif"
        alt="logo"
        style={{
          width: "60px",
          height: "60px",
        }}
      />
      Waiting for participant...
    </div>
  );
};
