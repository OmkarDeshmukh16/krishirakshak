import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Mic, Trash2, ChevronRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/index';
import { CHAT_RESPONSES } from '../../data/mockData';

const SUGGESTED = [
  'Why are my tomato leaves turning yellow?',
  'How can I identify pest damage on crops?',
  'What should I monitor after heavy rainfall?',
  'How can I improve soil health?',
  'What government agriculture schemes are available?',
  'What are signs of Early Blight disease?',
];

function findResponse(text) {
  const lower = text.toLowerCase();
  for (const key of Object.keys(CHAT_RESPONSES)) {
    if (key === 'default') continue;
    if (CHAT_RESPONSES[key].keywords.some(kw => lower.includes(kw))) {
      return CHAT_RESPONSES[key].response;
    }
  }
  return CHAT_RESPONSES.default.response;
}

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
    .replace(/^• /gm, '&bull; ');
}

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: `Namaste! 🌿 I'm **Krishi AI Assistant** — your digital agriculture companion.\n\nI can help you with crop diseases, pest identification, weather impact, soil health, and government schemes.\n\n⚠️ *Please note: My responses are general agricultural guidance. Always consult a certified agriculture expert for specific treatment decisions.*\n\nHow can I help you today?`,
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const response = findResponse(text);
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'bot',
        text: response,
        time: new Date(),
      }]);
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="animate-fade-in h-[calc(100vh-10rem)] flex flex-col gap-4">
      <PageHeader
        title="Krishi AI Assistant"
        subtitle="Your digital agriculture companion for crop health guidance"
        breadcrumb="AI Assistant"
        actions={
          <button onClick={() => setMessages(messages.slice(0, 1))} className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors text-xs font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:border-red-300">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        }
      />

      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-0">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Krishi AI</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600">Online · General Agricultural Guidance Only</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.from === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div
                  className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.from === 'user' ? 'chat-user' : 'chat-bot'}`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                />
                <p className="text-xs text-gray-400 mt-1 px-1">{formatTime(msg.time)}</p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bot px-4 py-3 flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-2">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" /> {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-end gap-2 focus-within:ring-2 focus-within:ring-green-400 focus-within:border-transparent transition-all">
              <textarea
                ref={inputRef}
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none max-h-24"
                placeholder="Ask about crops, diseases, pests, weather..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0" title="Voice input (demo UI)">
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            General guidance only · Not a medical or agricultural diagnosis · Consult your KVK or local expert
          </p>
        </div>
      </div>
    </div>
  );
}
