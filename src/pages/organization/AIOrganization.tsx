import { memo, useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, Building2, Loader2, Briefcase, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AIOrganization = memo(() => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI HR Assistant. I can help you draft Job Descriptions, analyze applicant resumes, or suggest interview questions. How can I assist your organization today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key is missing");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an expert HR AI assistant for a corporate platform. The user asks: ${text}. Provide a professional, helpful response. Format it nicely.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: textResponse };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const templates = [
    { icon: <Briefcase className="w-5 h-5 text-indigo-600" />, title: "Draft Job Description", prompt: "Draft a modern job description for a Senior React Developer focusing on clean architecture." },
    { icon: <FileText className="w-5 h-5 text-emerald-600" />, title: "Screening Questions", prompt: "Give me 5 behavioral interview questions for a project manager." },
  ];

  return (
    <main className="max-w-[1200px] mx-auto px-[24px] py-[32px] min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
      <section className="lg:col-span-8 flex flex-col h-[calc(100vh-140px)]">
        <Card className="flex-1 flex flex-col bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden relative">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-[20px] flex items-center gap-[16px] text-white">
            <div className="w-[48px] h-[48px] bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Sparkles className="w-[24px] h-[24px]" />
            </div>
            <div>
              <h2 className="text-[18px] font-[700]">AI HR Assistant</h2>
              <p className="text-indigo-100 text-[13px]">Powered by Gemini 1.5</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-[24px] space-y-[24px] bg-slate-50/50">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-[16px] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-[40px] h-[40px] rounded-2xl flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-800 text-white'}`}>
                    {msg.role === 'assistant' ? <Bot className="w-[20px] h-[20px]" /> : <Building2 className="w-[20px] h-[20px]" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-[16px] text-[15px] leading-[24px] ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-white shadow-sm border border-slate-100 text-slate-800 rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-[16px]">
                <div className="w-[40px] h-[40px] rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Loader2 className="w-[20px] h-[20px] animate-spin" />
                </div>
                <div className="bg-white shadow-sm border border-slate-100 rounded-2xl rounded-tl-sm p-[16px] flex items-center gap-[8px]">
                  <div className="w-[8px] h-[8px] bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-[8px] h-[8px] bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-[8px] h-[8px] bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-[20px] bg-white border-t border-slate-100">
            <div className="flex gap-[12px] bg-slate-50 p-[8px] rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend(input)} placeholder="Ask AI to write a job description..." className="flex-1 bg-transparent px-[12px] text-[15px] outline-none text-slate-700" />
              <Button onClick={() => handleSend(input)} disabled={!input.trim() || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-[44px] w-[44px] p-0 shrink-0 flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-indigo-600">
                <Send className="w-[20px] h-[20px]" />
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <aside className="lg:col-span-4 space-y-[24px]">
        <Card className="p-[24px] rounded-3xl border-slate-200 shadow-sm bg-white">
          <h3 className="text-[16px] font-[700] text-slate-900 mb-[16px] flex items-center gap-[8px]">
            <Sparkles className="w-[20px] h-[20px] text-amber-500" /> Suggested Prompts
          </h3>
          <div className="space-y-[12px]">
            {templates.map((t, idx) => (
              <button key={idx} onClick={() => handleSend(t.prompt)} className="w-full text-left p-[16px] rounded-2xl hover:bg-slate-50 border border-slate-100 transition-colors group flex items-start gap-[12px]">
                <div className="p-[8px] bg-white shadow-sm rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                  {t.icon}
                </div>
                <div>
                  <h4 className="text-[14px] font-[600] text-slate-900">{t.title}</h4>
                  <p className="text-[12px] text-slate-500 mt-[4px] line-clamp-2">{t.prompt}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </aside>
    </main>
  );
});

export default AIOrganization;
