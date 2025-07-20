import React, { useState, useEffect, useRef } from 'react';
import { SendHorizonal, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // Redirect if no token
      return;
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const uploadedFilePath = localStorage.getItem('uploadedFilePath');
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, filepath: uploadedFilePath }),
      });

      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: '⚠️ Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:5000/export-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat: messages, format: 'pdf' }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'chat_export.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="pt-16 h-screen w-full flex flex-col items-center justify-center p-4 relative bg-gradient-to-br from-[#fef9ff] via-[#e4f3ff] to-[#fff7f2] dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] transition-all duration-300">

      {/* Decorative Glows */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-200 opacity-40 blur-3xl animate-pulse block dark:hidden"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 opacity-40 blur-3xl animate-pulse block dark:hidden"></div>

      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-800 opacity-20 blur-3xl animate-pulse hidden dark:block"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-700 opacity-20 blur-3xl animate-pulse hidden dark:block"></div>

      <div className="z-10 w-full max-w-5xl h-full flex flex-col bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white drop-shadow-xl tracking-wide animate-fade-in">
            💬 Document Q&A Chat
          </h1>
          <button
            onClick={handleExport}
            className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            Export Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-2 pr-4 space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-2xl px-6 py-4 rounded-xl text-sm md:text-base whitespace-pre-wrap shadow-md tracking-wide leading-relaxed font-medium animate-fade-in-up transition-all duration-300
              ${
                msg.sender === 'user'
                  ? 'bg-sky-500 text-white self-end ml-auto rounded-br-none'
                  : 'bg-violet-100 text-gray-900 self-start mr-auto rounded-bl-none dark:bg-violet-300/10 dark:text-violet-100'
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="self-center text-sm text-gray-600 dark:text-gray-300 italic animate-pulse flex items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              Hang tight... thinking...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask your document anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-5 py-3 bg-white/50 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 border border-gray-300 dark:border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.15);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .animate-fade-in {
          animation: fadeIn 0.9s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}