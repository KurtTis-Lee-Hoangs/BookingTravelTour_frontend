import React, { useRef, useState } from "react";
import "../styles/chat-bot.css";

const API_KEY = "AIzaSyBZu09Rh9vLascySoZjbXPboWpMyrkw6Hg";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const initialBotMessage = {
  role: "model",
  parts: [{ text: "Hey there 👋 \nHow can I help you today?" }],
};

const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState([initialBotMessage]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [thinking, setThinking] = useState(false);
  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    // Add user message to chat
    const userMsg = {
      role: "user",
      parts: [
        { text: message.trim() },
        ...(file
          ? [
              {
                inline_data: {
                  data: file.data,
                  mime_type: file.mime_type,
                },
              },
            ]
          : []),
      ],
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setFile(null);
    setFilePreview("");
    setThinking(true);

    // Scroll to bottom
    setTimeout(() => {
      if (chatBodyRef.current)
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }, 100);

    // Call API
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [...chatHistory, userMsg] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");
      const apiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text
          ?.replace(/\*\*(.*?)\*\*/g, "$1")
          ?.trim() || "No response";
      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: apiText }] },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: err.message || "Error" }],
          error: true,
        },
      ]);
    } finally {
      setThinking(false);
      setTimeout(() => {
        if (chatBodyRef.current)
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 100);
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    const fileObj = e.target.files[0];
    if (!fileObj) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64String = ev.target.result.split(",")[1];
      setFile({
        data: base64String,
        mime_type: fileObj.type,
      });
      setFilePreview(ev.target.result);
    };
    reader.readAsDataURL(fileObj);
    e.target.value = "";
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      message.trim() &&
      window.innerWidth > 768
    ) {
      handleSendMessage(e);
    }
  };

  // Dynamic textarea height
  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    // el.style.height = "auto";
    // el.style.height = `${el.scrollHeight}px`;
  };

  // JSX for chat messages
  const renderMessage = (msg, idx) => {
    if (msg.role === "user") {
      const hasFile = msg.parts?.some((p) => p.inline_data);
      return (
        <div className="message user-message" key={idx}>
          {/* <div className="message-text">{msg.parts[0]?.text}</div> */}
          <div className="message-text">
            {msg.parts[0]?.text.split("\n").map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          {hasFile && (
            <img
              src={`data:${msg.parts[1]?.inline_data?.mime_type};base64,${msg.parts[1]?.inline_data?.data}`}
              className="attachment"
              alt="attachment"
            />
          )}
        </div>
      );
    }
    // Bot message
    return (
      <div
        className={`message bot-message${msg.error ? " error" : ""}`}
        key={idx}
      >
        <svg
          className="bot-avatar"
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 1024 1024"
        >
          <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        {/* <div className="message-text">{msg.parts[0]?.text}</div> */}
        <div className="message-text">
          {msg.parts[0]?.text.split("\n").map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`chatbot${showChatbot ? " show-chatbot" : ""}`}>
      <button
        className="chatbot-toggler"
        id="chatbot-toggler"
        onClick={() => setShowChatbot((s) => !s)}
      >
        <span>
          <i className="ri-wechat-line"></i>
        </span>
        <span>
          <i className="ri-close-circle-line"></i>
        </span>
      </button>

      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <svg
              className="chatbot-logo"
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 1024 1024"
            >
              <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>
            <h2 className="logo-text">Chatbot</h2>
            <button
              id="close-chatbot"
              type="button"
              onClick={() => setShowChatbot(false)}
            >
              <i className="ri-download-line"></i>
            </button>
          </div>
        </div>

        <div className="chat-body" ref={chatBodyRef}>
          {chatHistory.map(renderMessage)}
          {thinking && (
            <div className="message bot-message thinking">
              <svg
                className="bot-avatar"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 1024 1024"
              >
                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
              </svg>
              <div className="message-text">
                <div className="thinking-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-footer">
          <form
            className="chat-form"
            onSubmit={handleSendMessage}
            autoComplete="off"
          >
            <textarea
              ref={textareaRef}
              placeholder="Message..."
              className="message-input"
              required={!file}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              style={{ resize: "none" }}
            ></textarea>
            <div className="chat-controls">
              <button type="button" id="emoji-picker">
                <i className="ri-user-smile-line"></i>
              </button>
              <div
                className={`file-upload-wrapper${file ? " file-uploaded" : ""}`}
              >
                <input
                  type="file"
                  accept="images/*"
                  id="file-input"
                  hidden
                  onChange={handleFileChange}
                />
                {filePreview && <img src={filePreview} alt="preview" />}
                <button
                  type="button"
                  id="file-upload"
                  onClick={() => document.getElementById("file-input").click()}
                >
                  <i className="ri-attachment-line"></i>
                </button>
                <button
                  type="button"
                  id="file-cancel"
                  onClick={() => {
                    setFile(null);
                    setFilePreview("");
                  }}
                >
                  <i className="ri-close-fill"></i>
                </button>
              </div>
              <button type="submit" id="send-message" disabled={thinking}>
                <i className="ri-arrow-up-line"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
