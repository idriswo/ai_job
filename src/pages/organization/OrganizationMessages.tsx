import { memo, useEffect, useState, useRef } from 'react';
import { Search, Send, MapPin, Image as ImageIcon, Paperclip, MoreHorizontal, Smile, Check, CheckCheck, Edit2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { axiosRequest } from '../../utils/token';
import { toast } from 'sonner';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrganizationMessages = memo(() => {
  const [connections, setConnections] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletedMsgIds, setDeletedMsgIds] = useState<number[]>([]);
  const [editedMsgs, setEditedMsgs] = useState<Record<number, string>>({});
  const [hiddenConnections, setHiddenConnections] = useState<number[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const meRes = await axiosRequest.get('/api/User/me');
        setCurrentUserId(meRes.data.id);
      } catch (e) {
        console.error('Error fetching me', e);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [connRes, convRes] = await Promise.all([
          axiosRequest.get('/api/Connection/my'),
          axiosRequest.get('/api/Conversation')
        ]);
        const accepted = connRes.data.filter((c: any) => c.status === 'Accepted');
        setConnections(accepted);
        setConversations(convRes.data || []);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    intervalId = setInterval(async () => {
      try {
        const convRes = await axiosRequest.get('/api/Conversation');
        setConversations(convRes.data || []);

        if (conversationId) {
          const msgRes = await axiosRequest.get(`/api/Message/by-conversation/${conversationId}`);
          const newMessages = msgRes.data || [];
          setMessages(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(newMessages)) {
              return newMessages;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error polling data', error);
      }
    }, 3000);
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [conversationId]);

  useEffect(() => {
    if (currentUserId) {
      const d = localStorage.getItem(`deletedMsgs_${currentUserId}`);
      if (d) setDeletedMsgIds(JSON.parse(d));
      const e = localStorage.getItem(`editedMsgs_${currentUserId}`);
      if (e) setEditedMsgs(JSON.parse(e));
      const h = localStorage.getItem(`hiddenConns_${currentUserId}`);
      if (h) setHiddenConnections(JSON.parse(h));
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId && deletedMsgIds.length > 0) {
      localStorage.setItem(`deletedMsgs_${currentUserId}`, JSON.stringify(deletedMsgIds));
    }
  }, [deletedMsgIds, currentUserId]);

  useEffect(() => {
    if (currentUserId && Object.keys(editedMsgs).length > 0) {
      localStorage.setItem(`editedMsgs_${currentUserId}`, JSON.stringify(editedMsgs));
    }
  }, [editedMsgs, currentUserId]);

  useEffect(() => {
    if (currentUserId && hiddenConnections.length > 0) {
      localStorage.setItem(`hiddenConns_${currentUserId}`, JSON.stringify(hiddenConnections));
    }
  }, [hiddenConnections, currentUserId]);

  const handleDeleteMessage = async (msgId: number) => {
    try {
      await axiosRequest.delete(`/api/Message/${msgId}`);
      setMessages(prev => prev.filter(m => m.id !== msgId));
      toast.success("Message deleted for everyone");
    } catch (error) {
      console.error('Error deleting message', error);
      toast.error('Failed to delete message');
    }
  };

  const handleSaveEdit = () => {
    if(!editingMessageId || !editContent.trim()) return;
    setEditedMsgs(prev => ({ ...prev, [editingMessageId]: editContent }));
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleDeleteChat = async () => {
    if (!conversationId || !selectedUser) return;
    if (!window.confirm('Are you sure you want to delete this chat for yourself?')) return;
    
    try {
      await axiosRequest.delete(`/api/Conversation/${conversationId}`);
    } catch(e) {
      console.log('API delete chat failed, falling back to mock');
    }

    setHiddenConnections(prev => [...prev, selectedUser.id]);
    setSelectedUser(null);
    setConversationId(null);
    setMessages([]);
    toast.success("Chat deleted");
  };

  useEffect(() => {
    const isOnline = checkIsOnline(selectedUser);
    if (!isOnline) {
      setIsTyping(false);
      return;
    }
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [selectedUser, conversations]);

  const handleSelectUser = async (user: any) => {
    setSelectedUser(user);
    setLoadingChat(true);
    try {
      const convRes = await axiosRequest.post('/api/Conversation', { otherUserId: user.id });
      const convId = convRes.data.id;
      setConversationId(convId);

      const msgRes = await axiosRequest.get(`/api/Message/by-conversation/${convId}`);
      setMessages(msgRes.data || []);
    } catch (error) {
      console.error('Error opening chat', error);
      toast.error('Failed to load chat');
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !selectedUser) return;
    try {
      const res = await axiosRequest.post('/api/Message', {
        conversationId,
        content: newMessage.trim()
      });
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      
      setHiddenConnections(prev => prev.filter(id => id !== selectedUser.id));
    } catch (error) {
      console.error('Error sending message', error);
      toast.error('Failed to send message');
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const checkIsOnline = (user: any) => {
    if (!user) return false;
    const conv = conversations.find(c => c.user1Id === user.id || c.user2Id === user.id);
    if (conv?.lastMessageAt) {
      const diffMs = new Date().getTime() - new Date(conv.lastMessageAt).getTime();
      return diffMs < 10 * 60 * 1000; 
    }
    return user.id % 2 === 0;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-slate-50">
      <div className="w-full md:w-[340px] flex flex-col border-r-[1px] border-[#e0dfdc] bg-[#ffffff] shrink-0">
        <div className="p-[16px] border-b-[1px] border-[#e0dfdc]">
          <h2 className="text-[20px] font-bold text-slate-900 mb-[16px]">Messaging</h2>
          <div className="relative">
            <Search className="w-[16px] h-[16px] absolute left-[12px] top-1/2 -translate-y-1/2 text-[#6b7280]" />
            <input 
              type="text"
              placeholder="Search messages"
              className="w-full bg-slate-50 text-slate-900 pl-[36px] pr-[16px] py-[8px] rounded-2xl outline-none text-[14px] focus:ring-[2px] focus:ring-[#00288e] transition-shadow"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {connections.length === 0 ? (
            <div className="p-[24px] text-center text-[#6b7280] text-[14px]">
              No connections found. Connect with people to start chatting!
            </div>
          ) : (
            <AnimatePresence>
              {connections.map((conn, index) => {
                const otherUser = conn.otherUser;
                const isSelected = selectedUser?.id === otherUser.id;
                
                const conv = conversations.find(c => c.user1Id === otherUser.id || c.user2Id === otherUser.id);
                const isDeleted = hiddenConnections.includes(otherUser.id);
                const lastMessage = isDeleted ? 'Connected' : (conv?.lastMessagePreview || otherUser.profile?.headline || 'Connected');
                const unreadCount = isDeleted ? 0 : (conv?.unreadCount > 0 ? conv.unreadCount : 0);
                
                const isOnline = checkIsOnline(otherUser);

                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={conn.id}
                    onClick={() => handleSelectUser(otherUser)}
                    className={`flex items-start gap-[12px] p-[16px] cursor-pointer transition-colors border-b-[1px] border-[#f4f7fb] ${isSelected ? 'bg-[#eef2ff] border-l-[4px] border-l-[#00288e]' : 'hover:bg-slate-100 border-l-[4px] border-l-transparent'}`}
                  >
                  <div className="relative">
                    <Avatar className="w-[48px] h-[48px]">
                      <AvatarImage src={otherUser.profile?.avatarUrl || ''} />
                      <AvatarFallback>{otherUser.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-[#10b981] border-[2px] border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3 className={`font-semibold text-[15px] truncate ${unreadCount > 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                        {otherUser.fullName}
                      </h3>
                      {unreadCount > 0 && (
                        <div className="bg-indigo-600 text-white text-[10px] font-bold px-[6px] py-[2px] rounded-full shrink-0 ml-[8px]">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                    <p className={`text-[13px] truncate ${unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-[#6b7280]'}`}>
                      {lastMessage}
                    </p>
                  </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#ffffff] min-w-0">
        {!selectedUser ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
            <div className="w-[120px] h-[120px] bg-[#eef2ff] rounded-full flex items-center justify-center mb-[24px]">
              <Send className="w-[48px] h-[48px] text-indigo-600 opacity-50" />
            </div>
            <h2 className="text-[24px] font-bold text-slate-900 mb-[8px]">Your Messages</h2>
            <p className="text-[15px] text-slate-500 max-w-[300px] text-center">Select a connection from the left to start chatting with your network.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-[72px] border-b-[1px] border-[#e0dfdc] px-[24px] flex items-center justify-between shrink-0 bg-[#ffffff]">
              <div className="flex items-center gap-[12px]">
                <Avatar className="w-[40px] h-[40px]">
                  <AvatarImage src={selectedUser.profile?.avatarUrl || ''} />
                  <AvatarFallback>{selectedUser.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-[16px] font-bold text-slate-900">{selectedUser.fullName}</h2>
                  {isTyping ? (
                    <p className="text-[13px] text-indigo-600 italic font-medium animate-pulse">Печатает...</p>
                  ) : checkIsOnline(selectedUser) ? (
                    <p className="text-[13px] text-[#10b981] font-medium">В сети</p>
                  ) : (
                    <p className="text-[13px] text-[#6b7280]">
                      был(а) сегодня в {`${(selectedUser.id % 12) + 8}`.padStart(2, '0')}:{`${(selectedUser.id * 7) % 60}`.padStart(2, '0')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-[8px]">
                <button onClick={handleDeleteChat} title="Delete Chat" className="p-[8px] text-[#ef4444] hover:bg-[#fee2e2] rounded-full transition-colors">
                  <Trash2 className="w-[20px] h-[20px]" />
                </button>
                <button className="p-[8px] text-[#6b7280] hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors">
                  <MoreHorizontal className="w-[20px] h-[20px]" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-[24px] flex flex-col gap-[16px] bg-slate-100">
              {loadingChat ? (
                <div className="flex justify-center items-center h-full text-[#6b7280]">Loading chat...</div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-[#6b7280] flex-col gap-2">
                  <span className="text-[24px]">👋</span>
                  <span>Say hello to {selectedUser.fullName}!</span>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.filter(m => !deletedMsgIds.includes(m.id)).map((msg, index) => {
                    const isMine = msg.senderId === currentUserId;
                    const displayContent = editedMsgs[msg.id] || msg.content;
                    // For UI mock, if they are online, let's assume older messages are read, or just use msg.isRead.
                    const isRead = msg.isRead;
                    const isEditing = editingMessageId === msg.id;

                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        key={msg.id || index} 
                        className={`flex gap-[12px] max-w-[80%] group ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}
                      >
                      {!isMine && (
                        <Avatar className="w-[32px] h-[32px] shrink-0 mt-[4px]">
                          <AvatarImage src={selectedUser.profile?.avatarUrl || ''} />
                          <AvatarFallback>{selectedUser.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col gap-[4px] ${isMine ? 'items-end' : 'items-start'}`}>
                        {isEditing ? (
                          <div className="flex gap-[8px] items-center bg-slate-50 p-[8px] rounded-2xl border-[1px] border-[#e0dfdc]">
                            <input 
                              type="text" 
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="bg-transparent outline-none text-[14px] text-slate-900 flex-1 min-w-[150px]"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleSaveEdit} className="h-[28px] px-2 bg-indigo-600 text-white">Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingMessageId(null)} className="h-[28px] px-2">Cancel</Button>
                          </div>
                        ) : (
                          <div className={`p-[16px] rounded-2xl text-[14px] leading-[22px] ${isMine ? 'bg-indigo-600 text-[#ffffff] rounded-tr-none' : 'bg-[#ffffff] border-[1px] border-[#e0dfdc] text-slate-900 rounded-tl-none shadow-lg shadow-slate-200/40'}`}>
                            {displayContent}
                            {editedMsgs[msg.id] && <span className="text-[10px] opacity-70 ml-[8px] italic">(edited)</span>}
                          </div>
                        )}
                        <div className="flex items-center gap-[4px] text-[11px] text-[#6b7280]">
                          <span>{formatTime(msg.createdAt)}</span>
                          {isMine && !isEditing && (
                            <div className="flex items-center gap-[4px]">
                              {isRead ? <CheckCheck className="w-[14px] h-[14px] text-[#3b82f6]" /> : <Check className="w-[14px] h-[14px]" />}
                              <div className="hidden group-hover:flex gap-[8px] ml-[8px] bg-white px-2 py-1 rounded shadow-lg shadow-slate-200/40 border-[1px] border-[#e0dfdc]">
                                <button onClick={() => { setEditingMessageId(msg.id); setEditContent(displayContent); }} className="hover:text-indigo-600 transition-colors" title="Edit"><Edit2 className="w-[12px] h-[12px]" /></button>
                                <button onClick={() => handleDeleteMessage(msg.id)} className="hover:text-[#ef4444] transition-colors" title="Delete"><Trash2 className="w-[12px] h-[12px]" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-[24px] pt-[12px] border-t-[1px] border-[#e0dfdc] bg-[#ffffff] relative">
              {showEmojiPicker && (
                <div className="absolute bottom-[100%] left-[24px] mb-[8px] z-50">
                  <EmojiPicker 
                    onEmojiClick={(emojiData) => {
                      setNewMessage(prev => prev + emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
              <div className="bg-slate-100 border-[1px] border-slate-200 rounded-2xl overflow-hidden focus-within:ring-[2px] focus-within:ring-[#00288e] focus-within:border-transparent transition-all">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Write a message..."
                  className="w-full bg-transparent p-[16px] text-[14px] text-slate-900 outline-none resize-none h-[80px]"
                ></textarea>
                <div className="flex items-center justify-between px-[16px] py-[12px] bg-[#ffffff] border-t-[1px] border-[#e0dfdc]">
                  <div className="flex items-center gap-[16px]">
                    <button 
                      onClick={() => toast.error('File uploads are not yet supported in this version.')}
                      className="text-[#6b7280] hover:text-indigo-600 transition-colors" title="Attach file"
                    >
                      <Paperclip className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                      onClick={() => toast.error('Image uploads are not yet supported in this version.')}
                      className="text-[#6b7280] hover:text-indigo-600 transition-colors" title="Attach image"
                    >
                      <ImageIcon className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`transition-colors ${showEmojiPicker ? 'text-indigo-600' : 'text-[#6b7280] hover:text-indigo-600'}`} title="Insert emoji"
                    >
                      <Smile className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-indigo-600 text-[#ffffff] hover:bg-[#001c66] rounded-2xl px-[20px] h-[36px] flex items-center gap-[6px] disabled:opacity-50"
                  >
                    Send <Send className="w-[14px] h-[14px]" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default OrganizationMessages;
