
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronLeft, User } from 'lucide-react';
import { Conversation, ChatMessage, UserProfile } from '@/types';
import { getUserConversations, sendMessage, subscribeToMessages } from '@/services/firestoreService';

interface ChatAssistantProps {
  user: { uid: string; name: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  activeConversationId?: string | null;
  onConversationSelect?: (id: string | null) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  user, 
  isOpen, 
  onClose,
  onToggle, 
  activeConversationId,
  onConversationSelect
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to list of conversations
  useEffect(() => {
    if (user) {
      const unsubscribe = getUserConversations(user.uid, (convos) => {
        const unique = Array.from(new Map(convos.map(c => [c.id, c])).values());
        setConversations(unique);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Subscribe to messages of active conversation
  useEffect(() => {
    if (activeConversationId) {
      const unsubscribe = subscribeToMessages(activeConversationId, (msgs) => {
        const unique = Array.from(new Map(msgs.map(m => [m.id, m])).values());
        setMessages(unique);
      });
      return () => unsubscribe();
    }
  }, [activeConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, activeConversationId]);

  const handleSend = async () => {
    if (!inputValue.trim() || !user || !activeConversationId) return;

    const text = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      await sendMessage(activeConversationId, user.uid, text);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOtherParticipantName = (conv: Conversation) => {
    if (!user) return 'User';
    const otherId = conv.participants.find(id => id !== user.uid);
    return otherId ? (conv.participantNames[otherId] || 'User') : 'User';
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return '';
    }
  };

  if (!user) {
      return (
        <>
            <button
                onClick={onToggle}
                className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${
                isOpen ? 'bg-stone-200 text-stone-600 rotate-90' : 'bg-brand-blue text-white'
                }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
            
            {isOpen && (
                <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 z-40 md:w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-300">
                        <MessageCircle className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">Start Chatting</h3>
                    <p className="text-stone-500 text-sm mb-6">Log in to your account to chat with our sellers and artisans.</p>
                </div>
            )}
        </>
      );
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-stone-200 text-stone-600 rotate-90' : 'bg-brand-blue text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 z-40 md:w-96 bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden animate-fade-in-up h-[65vh] md:h-[80vh]" style={{ maxHeight: '600px' }}>
          
          {/* Header */}
          <div className="bg-brand-blue p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               {activeConversationId && onConversationSelect && (
                   <button onClick={() => onConversationSelect(null)} className="text-white hover:bg-white/20 p-1 rounded-full">
                       <ChevronLeft className="w-5 h-5" />
                   </button>
               )}
               <h3 className="text-white font-bold text-sm">
                   {activeConversationId 
                     ? (conversations.find(c => c.id === activeConversationId) ? getOtherParticipantName(conversations.find(c => c.id === activeConversationId)!) : 'Chat')
                     : 'Messages'}
               </h3>
            </div>
          </div>

          {/* Content Area */}
          {!activeConversationId ? (
              // Conversation List
              <div className="flex-1 overflow-y-auto bg-stone-50">
                  {conversations.length === 0 ? (
                      <div className="p-8 text-center text-stone-500 text-sm">
                          No messages yet. Contact a seller to start chatting!
                      </div>
                  ) : (
                      <div className="divide-y divide-stone-200">
                          {conversations.map(conv => (
                              <div 
                                key={conv.id} 
                                onClick={() => onConversationSelect && onConversationSelect(conv.id)}
                                className="p-4 bg-white hover:bg-stone-50 cursor-pointer transition-colors"
                              >
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center text-brand-blue font-bold">
                                          {getOtherParticipantName(conv).charAt(0)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <div className="flex justify-between items-baseline mb-1">
                                              <h4 className="font-bold text-stone-800 text-sm truncate">{getOtherParticipantName(conv)}</h4>
                                              <span className="text-xs text-stone-400">
                                                  {conv.updatedAt?.toDate ? conv.updatedAt.toDate().toLocaleDateString() : ''}
                                              </span>
                                          </div>
                                          <p className="text-xs text-stone-500 truncate">{conv.lastMessage}</p>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          ) : (
              // Message Thread
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 flex flex-col">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.senderId === user.uid ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed break-words shadow-sm ${
                        msg.senderId === user.uid
                          ? 'bg-brand-blue text-white rounded-br-none'
                          : 'bg-white border border-stone-200 text-stone-700 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 px-1">
                        {formatTime(msg.timestamp)}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
          )}

          {/* Input Area (Only visible if active conversation) */}
          {activeConversationId && (
              <div className="p-4 bg-white border-t border-stone-100">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 border border-stone-300 bg-white rounded-full px-4 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all placeholder-stone-400"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-brand-blue text-white p-2 rounded-full hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
