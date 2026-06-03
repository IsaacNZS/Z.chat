import { ParticipantView, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";

const OneToOneLayout = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const localParticipant = participants.find((p) => p.isLocalParticipant);

  const remoteParticipant = participants.find((p) => !p.isLocalParticipant);

  return (
    <div className="w-full h-full flex flex-col relative bg-black">
      {!remoteParticipant && (
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
      )}
      {remoteParticipant && (
        <ParticipantView
          participant={remoteParticipant}
          className="w-full h-full"
        />
      )}

      {localParticipant && (
        <div className="absolute top-4 right-4 w-28 h-40 overflow-hidden rounded-xl border border-white">
          <ParticipantView
            participant={localParticipant}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(OneToOneLayout);
