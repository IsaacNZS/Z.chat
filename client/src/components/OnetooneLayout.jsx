import { ParticipantView, useCallStateHooks } from "@stream-io/video-react-sdk";

const OneToOneLayout = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const localParticipant = participants.find((p) => p.isLocalParticipant);

  const remoteParticipant = participants.find((p) => !p.isLocalParticipant);

  return (
    <div className="w-full h-full relative bg-black">
      {!remoteParticipant && (
        <div className="w-full h-full flex items-center justify-center text-white">
          Waiting for participant...
        </div>
      )}
      {remoteParticipant && (
        <ParticipantView
          participant={remoteParticipant}
          className="w-full h-full"
        />
      )}

      {localParticipant && (
        <div className="absolute top-4 right-4 w-36 h-52 overflow-hidden rounded-xl border border-white">
          <ParticipantView participant={localParticipant} />
        </div>
      )}
    </div>
  );
};

export default OneToOneLayout;
