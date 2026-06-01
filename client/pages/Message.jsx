import React from "react";
import MessageHeader from "../src/components/MessageHeader";
import MessageBody from "../src/components/MessageBody";
import MessageFooter from "../src/components/MessageFooter";

const Message = () => {
  return (
    <div className="h-dvh w-full flex flex-col bg-[#1D1D1D]">
      <MessageHeader />
      <MessageBody />
      <MessageFooter />
    </div>
  );
};

export default Message;
