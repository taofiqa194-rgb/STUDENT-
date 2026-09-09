import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Send,
  ShieldCheck,
  MapPin,
  AlertTriangle,
  Lock,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatSession } from '../../types';

interface ChatModalProps {
  chatSession: ChatSession | null;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ chatSession, onClose }) => {
  const { sendMessage, currentUser, allUsers, campusItems } = useApp();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatSession?.messages]);

  if (!chatSession) return null;

  const otherParticipantId = chatSession.participants.find((p) => p !== currentUser.id) || chatSession.participants[0];
  const otherUser = allUsers.find((u) => u.id === otherParticipantId) || {
    id: otherParticipantId,
    name: 'Campus Peer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    university: currentUser.university,
  };

  const relatedItem = chatSession.itemId
    ? campusItems.find((i) => i.id === chatSession.itemId)
    : undefined;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(chatSession.id, text.trim());
    setText('');
  };

  const handleQuickReply = (msg: string) => {
    sendMessage(chatSession.id, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        id="private-chat-modal"
        className="w-full max-w-md h-[550px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  {otherUser.name}
                </h3>
                <span title="Student Verified">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {otherUser.university} • Private End-to-End
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item context bar */}
        {relatedItem && (
          <div className="px-4 py-2 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="text-base">{relatedItem.type === 'lost' ? '🔎' : '📦'}</span>
              <span className="font-medium truncate text-emerald-900 dark:text-emerald-200">
                Item: <strong>{relatedItem.title}</strong>
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
              {relatedItem.location}
            </span>
          </div>
        )}

        {/* Safety Header Callout */}
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/50 dark:border-amber-900/30 flex items-center gap-2 text-[10px] text-amber-800 dark:text-amber-300">
          <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Phone numbers are masked. Meet at public campus security posts.</span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatSession.messages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No messages yet. Say hello and coordinate safe campus handover!
            </div>
          ) : (
            chatSession.messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                    <span>{msg.timestamp}</span>
                    {isMine && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick safety replies */}
        <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
          {[
            'Can we meet at Main Security Gate?',
            'I have the item with me right now.',
            'Can you verify the color or serial number?',
          ].map((quick, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickReply(quick)}
              className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition"
            >
              {quick}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
          <button
            type="submit"
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
