'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { CulturXData } from '@/lib/initialData';
import { AnimatePresence, motion } from 'motion/react';

interface AIChatbotProps {
  siteData: CulturXData;
}

export default function AIChatbot({ siteData }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Hello! I am the CulturX AI Assistant. I can help answer questions about our products, treatments, and philosophy. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simple keyword-based mock logic for demonstration
    // Real implementation would call an API like /api/chat with the user message and siteData context
    setTimeout(() => {
      let response = "I'm sorry, I don't have information on that topic. Please contact our support team.";
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes('product') || lowerInput.includes('shop') || lowerInput.includes('buy')) {
        const availableProducts = siteData.products.filter(p => !p.isComingSoon).map(p => p.name).join(', ');
        response = `We have the following products currently available for purchase: ${availableProducts}. Is there a specific product you would like to know more about?`;
      } else if (lowerInput.includes('treatment') || lowerInput.includes('book') || lowerInput.includes('session')) {
        const treatments = siteData.bodyworks.treatments.map(t => `${t.name} (${t.durationMin}m, $${t.costUSD})`).join(', ');
        response = `We offer several restorative bodywork treatments: ${treatments}. You can book these sessions online.`;
      } else if (lowerInput.includes('exhale') || lowerInput.includes('studio')) {
        response = `Our studio, The Exhale Work, is located at: ${siteData.contact.location}. ${siteData.exhaleWork.explanation}`;
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        response = "Hello there! Feel free to ask me anything about CulturX's offerings.";
      } else {
        response = `Our philosophy focuses on ${siteData.manifesto.heading.toLowerCase()}. For specific queries not covered in our documentation, please use the contact form.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 px-6 py-4 bg-brand-gold text-brand-black font-extrabold uppercase text-xs tracking-widest rounded-full shadow-2xl hover:bg-white hover:text-brand-black shadow-brand-gold/25 transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Assistant</span>
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping ml-2"></span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-neutral-950 border border-brand-line/50 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-brand-line/30">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-brand-gold" />
                <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">CulturX AI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-neutral-800 rounded-lg text-zinc-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-neutral-800 border border-neutral-700">
                      {msg.role === 'user' ? <User className="w-3 h-3 text-zinc-400" /> : <Bot className="w-3 h-3 text-brand-gold" />}
                    </div>
                    <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-brand-gold text-black' : 'bg-neutral-900 border border-neutral-800 text-zinc-300'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-2 flex-row max-w-[85%]">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-neutral-800 border border-neutral-700">
                      <Bot className="w-3 h-3 text-brand-gold" />
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center space-x-1">
                      <Loader2 className="w-3 h-3 text-brand-gold animate-spin" />
                      <span className="text-[10px] text-zinc-500 font-mono">Analyzing knowledge base...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-neutral-900 border-t border-brand-line/30">
              <form onSubmit={handleSend} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about products, treatments..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-brand-gold text-black rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
