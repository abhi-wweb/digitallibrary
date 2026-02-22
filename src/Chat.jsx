import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let aiMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const events = chunk.split("\n\n");

        for (const ev of events) {
          if (!ev.trim()) continue;

          if (ev.startsWith("data: ")) {
            const payload = JSON.parse(ev.slice(6));
            if (payload.token) {
              aiMessage.content += payload.token;

              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...aiMessage };
                return updated;
              });
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">

      {/* SHOW LANDING ONLY IF NO MESSAGES */}
      {messages.length === 0 && (
        <div className="landing-center">

          <div className="brand">
            <div className="logo-icon">✦</div>
            <h1>NEHA</h1>
          </div>

          <h2 className="hero-text">
            Ask Anything About Study <br />
            <span>with Simple Prompt</span>
          </h2>

          <div className="pill-row">
            <div className="pill">SaaS Landing Page</div>
            <div className="pill">Digital Agency Website</div>
            <div className="pill">Portfolio Site</div>
            <div className="pill">Dashboard</div>
          </div>
        </div>
      )}

      {/* CHAT AREA */}
      {messages.length > 0 && (
        <div className="chat-area">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className="bubble">{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant">
              <div className="bubble typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      )}

      {/* INPUT ALWAYS AT BOTTOM */}
      <div className="prompt-box fixed">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask Neha about your study"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
        />
        <button onClick={handleAsk} disabled={loading}>
          ↑
        </button>
      </div>

    </div>
  );
}