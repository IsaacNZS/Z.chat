import React from "react";
import MessageHeader from "../src/components/MessageHeader";
import MessageBody from "../src/components/MessageBody";
import MessageFooter from "../src/components/MessageFooter";

const Message = () => {
  return (
    <div className="w-full h-screen">
      <MessageHeader />
      <MessageBody />
      <MessageFooter />
    </div>
  );
};

export default Message;
