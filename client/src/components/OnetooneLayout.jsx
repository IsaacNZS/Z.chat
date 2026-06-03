import { ParticipantView, useCallStateHooks } from "@stream-io/video-react-sdk";
import React, { useState } from "react";

const OneToOneLayout = () => {
  const { useParticipants } = useCallStateHooks();
  const [change, setChange] = useState(false);

  const participants = useParticipants();

  const localParticipant = participants.find((p) => p.isLocalParticipant);
  const remoteParticipant = participants.find((p) => !p.isLocalParticipant);

  const mainParticipant = change ? localParticipant : remoteParticipant;

  const previewParticipant = change ? remoteParticipant : localParticipant;

  return (
    <div className="w-full h-full relative bg-black">
      {mainParticipant && (
        <div className="w-full h-full">
          <ParticipantView
            participant={mainParticipant}
            className="w-full h-full"
          />
        </div>
      )}

      {previewParticipant && (
        <div
          onClick={() => setChange((prev) => !prev)}
          className="absolute top-4 right-4 w-25 h-40 overflow-hidden rounded-xl border border-white cursor-pointer"
        >
          <ParticipantView
            participant={previewParticipant}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(OneToOneLayout);
