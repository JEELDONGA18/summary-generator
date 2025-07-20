import React, { useState, useEffect, useRef } from 'react';
import { SendHorizonal, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

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
        body: JSON.stringify({ question: input, filepath: uploadedFilePath })
      });

      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white flex flex-col items-center p-4 overflow-hidden">
      <div className="w-full max-w-5xl h-full flex flex-col bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl overflow-hidden">
        <h1 className="text-4xl font-bold text-center mb-6 text-white drop-shadow-xl tracking-wide animate-fade-in">
          🤖 Your Summary Assistant
        </h1>

        <div className="flex-1 overflow-y-auto space-y-4 px-2 pr-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`transition-all duration-300 ease-in-out max-w-2xl px-6 py-4 rounded-xl text-sm md:text-base whitespace-pre-wrap shadow-lg tracking-wide leading-relaxed font-medium animate-fade-in-up
                ${msg.sender === 'user'
                  ? 'bg-blue-600 text-white self-end ml-auto rounded-br-none'
                  : 'bg-white text-gray-900 self-start mr-auto rounded-bl-none'}
              `}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="self-center text-sm text-gray-300 italic animate-pulse flex items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" /> Give moment!! Alomost Done...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask your document anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-5 py-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
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
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}