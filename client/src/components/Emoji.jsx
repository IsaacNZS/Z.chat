import EmojiPicker from "emoji-picker-react";
import React, { useState, useRef } from "react";

const Emoji = ({ setInput }) => {
  const textareaRef = useRef(null);

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);

    textareaRef.current?.focus();
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "50px",
        left: 0,
        zIndex: 1000,
      }}
    >
      <EmojiPicker onEmojiClick={onEmojiClick} />
    </div>
  );
};

export default Emoji;
