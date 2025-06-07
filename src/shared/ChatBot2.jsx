import React, { useRef, useState, useEffect } from "react"; // Thêm useEffect
import "../styles/chat-bot.css";
import { BASE_URL } from "../utils/config";

// Định nghĩa giới hạn kích thước ảnh (tính bằng byte)
// 1 MB = 1024 * 1024 bytes. Đặt 2MB để kiểm tra, Gemini hỗ trợ 7MB nhưng payload HTTP có giới hạn
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const initialBotMessage = {
  role: "model",
  parts: [{ text: "Hey there 👋 \nHow can I help you today?" }],
};

const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState([initialBotMessage]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null); // Lưu trữ base64 data và mime_type
  const [filePreview, setFilePreview] = useState(""); // Dùng để hiển thị preview ảnh
  const [showChatbot, setShowChatbot] = useState(false);
  const [thinking, setThinking] = useState(false);
  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);

  // Cuộn xuống cuối tin nhắn khi chatHistory thay đổi
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory, thinking]); // Thêm thinking để cuộn khi bot bắt đầu nghĩ

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return; // Không gửi nếu không có tin nhắn hoặc file

    // Tạo tin nhắn của người dùng để hiển thị ngay lập tức
    const userMsg = {
      role: "user",
      parts: [],
    };
    if (message.trim()) {
      userMsg.parts.push({ text: message.trim() });
    }
    // Thêm ảnh vào tin nhắn để hiển thị trên UI
    if (file) {
      userMsg.parts.push({
        inline_data: {
          mime_type: file.mime_type,
          data: file.data, // Dữ liệu base64 đã có sẵn từ handleFileChange
        },
      });
    }

    // Cập nhật chatHistory ngay lập tức
    setChatHistory((prev) => [...prev, userMsg]);

    const messageToSend = message.trim();
    const fileToSend = file; // Object chứa data và mime_type

    // Reset input
    setMessage("");
    setFile(null);
    setFilePreview("");
    setThinking(true);

    try {
      const response = await fetch(`${BASE_URL}/chat/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Chỉ gửi lịch sử CHUẨN ĐỊNH DẠNG GEMINI API
          // Lọc bỏ 'error' prop và chỉ giữ lại 'role' và 'parts'
          history: chatHistory.map(msg => ({ role: msg.role, parts: msg.parts })),
          query: messageToSend,
          image: fileToSend, // Gửi object file chứa mime_type và data
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Lỗi máy chủ: ${response.status} ${response.statusText}`);
      }

      let botResponseText = "";
      if (data.tours) {
        // Kiểm tra data.tours là mảng
        const tours = Array.isArray(data.tours) ? data.tours : [];
        botResponseText = `🔍 Tìm thấy ${tours.length} tour phù hợp\n`;
        if (tours.length > 0) {
          botResponseText += tours
            .map(
              (tour, idx) =>
                `\n${idx + 1}. 🧭 *${tour.title}* - 📍 ${tour.city} - 🕒 ${tour.day} ngày - 💵 ${tour.price.toLocaleString()} VNĐ`
            )
            .join("\n");
        } else {
          botResponseText = "❌ Không tìm thấy tour phù hợp với yêu cầu của bạn.";
        }
      } else {
        botResponseText = data.text; // Nhận text mô tả ảnh hoặc câu trả lời chung từ backend
      }

      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: botResponseText }] },
      ]);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: `Đã xảy ra lỗi: ${err.message}. Vui lòng thử lại.` }],
          error: true,
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    const fileObj = e.target.files[0];
    if (!fileObj) return;

    // Kiểm tra kích thước file
    if (fileObj.size > MAX_IMAGE_SIZE_BYTES) {
      alert(`Kích thước ảnh tối đa cho phép là ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB. Vui lòng chọn ảnh nhỏ hơn.`);
      setFile(null);
      setFilePreview("");
      e.target.value = ""; // Clear file input
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64String = ev.target.result.split(",")[1];
      setFile({
        data: base64String,
        mime_type: fileObj.type,
      });
      setFilePreview(ev.target.result); // URL data cho preview
    };
    reader.readAsDataURL(fileObj);
    e.target.value = ""; // Xóa giá trị input để có thể chọn lại cùng một file
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      (message.trim() || file) && // Cho phép gửi khi có file dù không có text
      window.innerWidth > 768
    ) {
      handleSendMessage(e);
    }
  };

  // JSX for chat messages (renderMessage function remains the same)
  const renderMessage = (msg, idx) => {
    const textPart = msg.parts?.find((p) => p.text);
    const imagePart = msg.parts?.find((p) => p.inline_data);

    if (msg.role === "user") {
      return (
        <div className="message user-message" key={idx}>
          {textPart && (
            <div className="message-text">
              {textPart.text.split("\n").map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          )}
          {imagePart && (
            <img
              src={`data:${imagePart.inline_data.mime_type};base64,${imagePart.inline_data.data}`}
              className="attachment"
              alt="attachment"
            />
          )}
        </div>
      );
    }

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
        {textPart && (
          <div className="message-text">
            {textPart.text.split("\n").map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        )}
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
                  accept="image/*" // Đổi từ "images/*" thành "image/*"
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