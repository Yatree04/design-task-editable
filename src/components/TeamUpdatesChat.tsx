import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';

interface TeamMessage {
  id: string;
  sender: string;
  role: string;
  avatar: string;
  text: string;
  time: string;
  isSelf?: boolean;
}

export const TeamUpdatesChat: React.FC = () => {
  const [messages, setMessages] = useState<TeamMessage[]>([
    {
      id: 'msg-1',
      sender: 'Dr. Sarah Lin',
      role: 'Head of Quant Risk',
      avatar: 'SL',
      text: 'Oculus portfolio beta to S&P neutralized. Daily 95% VaR is comfortably at 1.14%.',
      time: '10:14 AM',
      isSelf: false,
    },
    {
      id: 'msg-2',
      sender: 'Marcus Vance',
      role: 'Macro Factor Lead',
      avatar: 'MV',
      text: 'FOMC commentary signals steady front-end. Keep duration hedge on 10Y futures active.',
      time: '10:28 AM',
      isSelf: false,
    },
    {
      id: 'msg-3',
      sender: 'You',
      role: 'Portfolio Lead',
      avatar: 'YP',
      text: 'Approved. Committed +$12M delta hedge on semiconductor basket through the blotter.',
      time: '10:35 AM',
      isSelf: true,
    },
    {
      id: 'msg-4',
      sender: 'Alex Chen',
      role: 'Execution Algorithmist',
      avatar: 'AC',
      text: 'VWAP slicing execution completed with 0.8 bps slip. All FIX tickets filled.',
      time: '10:42 AM',
      isSelf: false,
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const newMsg: TeamMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      role: 'Portfolio Lead',
      avatar: 'YP',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
  };

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg p-2.5 shadow-xs flex flex-col justify-between transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-bold text-foreground tracking-tight">Team updates</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>4 Analysts Active</span>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 space-y-1.5 mb-2 pr-0.5 overflow-y-auto max-h-[280px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-0.5 text-[9px] font-mono text-muted-foreground">
              <span className="font-semibold text-foreground">{msg.sender}</span>
              <span>•</span>
              <span>{msg.time}</span>
            </div>

            {/* Speech Bubble */}
            <div
              className={`max-w-[88%] rounded-lg px-2.5 py-1 text-xs leading-snug transition-all ${
                msg.isSelf
                  ? 'bg-primary text-primary-foreground font-medium rounded-br-xs shadow-xs'
                  : 'bg-white text-foreground border border-border rounded-bl-xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Bottom Input Field: "Text here" + ↗ arrow send button matching wireframe */}
      <div className="pt-1.5 border-t border-border">
        <div className="flex items-center gap-1.5 bg-white border border-border rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Text here"
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden"
          />
          <button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            title="Send Update (Enter)"
            className="p-0.5 rounded text-primary hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors shrink-0"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
