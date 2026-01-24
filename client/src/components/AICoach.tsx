import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, Loader2, Compass, Zap } from "lucide-react";
import { toast } from "sonner";
import { aiService } from "../services/aiService";
import { User } from "../types";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const AICoach: React.FC<{ user: User }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [userData, setUserData] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your SkillSwap Mentor. How can I help you optimize your learning journey today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text;
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    setInput("");
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await aiService.coachChat(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: res }]);
    } catch (error) {
      console.error("Coach Error:", error);
      toast.error("The Mentor is temporarily busy.");
      setMessages((prev) => prev.slice(0, -1)); // Remove the user message on fail
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      label: "Learning Path",
      icon: <Compass size={14} />,
      prompt:
        "Based on my current skills, what should I learn next to increase my swap value?",
    },
    {
      label: "Swap Strategy",
      icon: <Zap size={14} />,
      prompt:
        "How can I better pitch my skills to find higher quality swap partners?",
    },
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[60] w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl flex items-center justify-center border-4 border-white"
      >
        <Sparkles size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white z-[80] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Bot size={24} />
                  <div>
                    <h2 className="text-xl font-bold">AI Skill Mentor</h2>
                    <p className="text-[10px] uppercase opacity-70">
                      Personalized for {userData?.name || "You"}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-100 rounded-tl-none font-medium text-slate-800"}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0.2,
                        }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0.4,
                        }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-white">
                <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action.prompt)}
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask for advice..."
                    className="w-full bg-slate-100 rounded-2xl py-4 pl-6 pr-12 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AICoach;
