import { memo, useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2, BookOpen, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { axiosRequest } from '../../../utils/token';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AICandidate = memo(() => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Салом! Ман Ёрдамчии Зеҳни Сунъии шумо барои корёбӣ ҳастам. Ман метавонам дар омодагӣ ба мусоҳиба, навиштани резюме (CV) ва маслиҳатҳои касбӣ ба шумо кӯмак кунам. Чӣ тавр ба шумо ёрӣ диҳам?',
    }
  ]);
  
  const [input, setInput] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput(''); 

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
        const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        
        let aiResponseText = '';
  
        if (GEMINI_API_KEY) {
          const { GoogleGenerativeAI } = await import('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
          
          const systemPrompt = "Шумо як ёвари HR ҳастед ва бо забони тоҷикӣ гап мезанед. ";
          const result = await model.generateContent(systemPrompt + userText);
          const response = await result.response;
          
          aiResponseText = response.text() || 'I could not generate a response.';
        } else {
          const response = await axiosRequest.post('/api/Ai/ask', {
            prompt: userText
          });
          aiResponseText = response.data?.answer || response.data?.data || response.data || 'I am sorry, I could not process that.';
        }
        
        const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText
      };
      
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error: unknown) {
      console.error('AI Request Error:', error);
      const err = error as { response?: { data?: { message?: string, error?: string } }, message?: string };
      const rawMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Unknown error";
      const errMsg = typeof rawMsg === 'object' ? JSON.stringify(rawMsg) : rawMsg;
      toast.error(`AI Error: ${errMsg}`);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to my servers.'
      }]);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-[80px] pb-[40px] px-[20px] md:px-[40px] font-sans">
      <div className="max-w-[1000px] mx-auto h-[calc(100vh-140px)] flex flex-col">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-[24px]"
        >
          <div className="flex items-center gap-[12px] mb-[8px]">
            <div className="bg-indigo-100 text-indigo-600 p-[12px] rounded-2xl shadow-sm">
              <Sparkles className="w-[28px] h-[28px]" />
            </div>
            <div>
              <h1 className="text-[28px] font-extrabold text-slate-900 leading-tight">AI Assistant</h1>
              <p className="text-[15px] text-slate-500 font-medium">Your personal career coach and writer</p>
            </div>
          </div>
        </motion.div>

        {/* Main Chat Interface */}
        <Card className="flex-1 flex flex-col bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-[24px] md:p-[32px] space-y-[24px]">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-[16px] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                    {msg.role === 'user' ? <User className="w-[20px] h-[20px]" /> : <Bot className="w-[24px] h-[24px]" />}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-[16px] text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    {/* Render newlines correctly */}
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i !== msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-[16px]"
              >
                <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 shadow-sm bg-slate-100 text-indigo-600">
                  <Bot className="w-[24px] h-[24px]" />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-[16px] flex items-center gap-[8px]">
                  <Loader2 className="w-[18px] h-[18px] text-indigo-600 animate-spin" />
                  <span className="text-slate-500 text-[14px] font-medium">AI is typing...</span>
                </div>
              </motion.div>
            )}
            
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-[20px] border-t border-slate-100 bg-slate-50/50">
            {/* Quick Actions (Suggestions) */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-[10px] mb-[16px]">
                <Button 
                  variant="outline" 
                  onClick={() => handleQuickAction("Метавонӣ барои ман як намунаи CV барои вазифаи Барномасоз (Developer) нависӣ?")}
                  className="bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-full h-[36px] px-[16px] text-[13px] font-medium"
                >
                  <FileText className="w-[14px] h-[14px] mr-[6px]" />
                  Навиштани Резюме
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleQuickAction("Беҳтарин саволҳое, ки дар мусоҳибаи корӣ барои барномасозон медиҳанд, кадомҳоянд?")}
                  className="bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-full h-[36px] px-[16px] text-[13px] font-medium"
                >
                  <BookOpen className="w-[14px] h-[14px] mr-[6px]" />
                  Омодагӣ ба мусоҳиба
                </Button>
              </div>
            )}

            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Саволи худро ба AI нависед..."
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-2xl h-[56px] pl-[20px] pr-[60px] text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
                disabled={isLoading}
              />
              <Button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-[8px] w-[40px] h-[40px] p-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
              >
                <Send className="w-[18px] h-[18px] ml-[2px]" />
              </Button>
            </form>
            <p className="text-center text-[12px] text-slate-400 mt-[12px]">
              Ёрдамчии AI метавонад хато кунад. Маълумоти муҳимро ҳамеша тафтиш кунед.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
});

export default AICandidate;
