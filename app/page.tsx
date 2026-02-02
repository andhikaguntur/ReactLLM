"use client";
import { useState, useRef, useEffect } from "react";
import { requestToGroq } from "./utils/groq";
import { Light } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: content,
    };

    // Tambahkan pesan user ke chat
    setMessages((prev) => [...prev, userMessage]);
    setContent("");
    setIsLoading(true);

    try {
      // Kirim seluruh riwayat percakapan ke AI
      const aiResponse = await requestToGroq([...messages, userMessage]);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
      };

      // Tambahkan response AI ke chat
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="flex flex-col max-w-4xl mx-auto p-4 h-screen">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-4xl text-indigo-500 font-bold">REACT | AI Chatbot</h1>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Clear Chat
            </button>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-800 rounded-lg p-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <p className="text-xl">Mulai percakapan dengan AI</p>
              <p className="text-sm mt-2">Ketik pesan Anda di bawah...</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <p className="text-xs font-semibold mb-2 opacity-70">
                    {message.role === "user" ? "You" : "AI"}
                  </p>
                  {message.role === "assistant" &&
                  (message.content.includes("```") || message.content.includes("function")) ? (
                    <Light
                      language="typescript"
                      style={darcula}
                      wrapLongLines={true}
                      customStyle={{ margin: 0, borderRadius: "0.5rem" }}
                    >
                      {message.content}
                    </Light>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-xs font-semibold mb-2 opacity-70">AI</p>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 bg-gray-800 text-white py-3 px-4 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
            placeholder="Ketik pesan Anda..."
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? "..." : "Kirim"}
          </button>
        </form>
      </main>
    </div>
  );
}