import { useEffect, useState } from "react";

const REVIEW_MESSAGES = [
  "Hi! I'm PR Guardian. I'm here to help you review your code.",
  "I'm inspecting your changed files and understanding the updates.",
  "I'm scanning for potential bugs and security vulnerabilities.",
  "I'm checking whether your changes need additional test coverage.",
  "I'm organizing my findings and preparing your code review.",
];

export function useReviewLoader() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [typedMessage, setTypedMessage] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentMessage = REVIEW_MESSAGES[messageIndex];

  // Type the current message character by character
  useEffect(() => {
    if (typedMessage.length < currentMessage.length) {
      const timeout = setTimeout(() => {
        setTypedMessage(currentMessage.slice(0, typedMessage.length + 1));
      }, 35);

      return () => clearTimeout(timeout);
    }

    // Move to the next message after typing finishes
    const timeout = setTimeout(() => {
      setMessageIndex((prev) => (prev + 1) % REVIEW_MESSAGES.length);
      setTypedMessage("");
    }, 2200);

    return () => clearTimeout(timeout);
  }, [typedMessage, currentMessage]);

  // Track elapsed review time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  return {
    typedMessage,
    elapsedTime: formatTime(elapsedSeconds),
    isTakingLong: elapsedSeconds >= 30,
  };
}
