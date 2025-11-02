import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll when new message appears
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load previous history
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:3000/history");
      const history = await res.json();
      const formatted = history.flatMap((h) => [
        { role: "user", content: h.question },
        { role: "assistant", content: h.answer },
      ]);
      setMessages(formatted.reverse());
    } catch (err) {
      console.error("❌ Failed to load history:", err);
    }
  };

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

      if (!res.body) throw new Error("No stream found");

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
          if (ev.includes("[DONE]")) {
            setLoading(false);
            return;
          }

          if (ev.startsWith("data: ")) {
            try {
              const payload = JSON.parse(ev.slice(6));
              if (payload.token) {
                aiMessage.content += payload.token;

                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { ...aiMessage };
                  return updated;
                });
              }
            } catch (err) {
              console.error("JSON parse error:", err);
            }
          }
        }
      }
    } catch (err) {
      console.error("❌ Ask error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Server error. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await fetch("http://localhost:3000/history", { method: "DELETE" });
      setMessages([]);
    } catch (err) {
      console.error("❌ Clear history error:", err);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>AI Study Assistant</h2>
        <button onClick={handleClearHistory}>🗑️ Clear</button>
      </header>

      <main className="chat-main">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="bubble">{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            <div className="bubble typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <footer className="chat-input">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
        />
        <button onClick={handleAsk} disabled={loading}>Send</button>
      </footer>
    </div>
  );
}
