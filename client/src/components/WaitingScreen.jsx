import { useCallStateHooks } from "@stream-io/video-react-sdk";

export const WaitingScreen = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  if (participants.length >= 2) return null;

  return (
    <div className="w-full h-full flex flex-col absolute top-5 left-0 items-center justify-center text-white">
      <img
        src="/waiting.gif"
        alt="logo"
        style={{
          width: "100px",
          height: "100px",
        }}
      />
      <p className="text-2xl animate-pulse">Waiting for participant...</p>
    </div>
  );
};
