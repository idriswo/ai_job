import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Briefcase, UserPlus, MessageSquare, Check, Trash2, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { toast } from 'sonner';

// Mock Notifications Data since API returns 404
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'job_alert',
    title: 'New Job Match',
    message: 'Google just posted a "Senior Frontend Engineer" role that matches your profile.',
    time: '2 hours ago',
    isRead: false,
    icon: Briefcase,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 2,
    type: 'connection',
    title: 'Connection Request Accepted',
    message: 'Parviz accepted your connection request. Say hi!',
    time: '5 hours ago',
    isRead: false,
    icon: UserPlus,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message',
    message: 'You received a new message from a recruiter at Amazon.',
    time: '1 day ago',
    isRead: true,
    icon: MessageSquare,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 4,
    type: 'system',
    title: 'Profile View',
    message: 'Your profile appeared in 15 search results this week.',
    time: '2 days ago',
    isRead: true,
    icon: Bell,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  }
];

const NotificationsCandidate = memo(() => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification removed");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-[80px] pb-[40px] px-[20px] md:px-[40px]">
      <div className="max-w-[800px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-[32px] flex justify-between items-end"
        >
          <div>
            <h1 className="text-[32px] md:text-[40px] font-[700] text-slate-900 mb-[8px] flex items-center gap-[12px]">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-indigo-600 text-white text-[16px] font-[600] px-[12px] py-[4px] rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-[16px] text-slate-500">Stay updated on your career journey</p>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="hidden md:flex items-center gap-[8px] border-slate-200 text-slate-500 hover:bg-[#e2e4f0]"
            >
              <CheckCircle2 className="w-[18px] h-[18px]" />
              Mark all as read
            </Button>
          )}
        </motion.div>

        <Card className="rounded-2xl border-slate-200 shadow-lg shadow-slate-200/40 overflow-hidden bg-white">
          {notifications.length === 0 ? (
            <div className="py-[60px] text-center flex flex-col items-center">
              <div className="w-[80px] h-[80px] rounded-full bg-slate-50 flex items-center justify-center mb-[20px]">
                <Bell className="w-[32px] h-[32px] text-[#a0a4b8]" />
              </div>
              <h3 className="text-[20px] font-[600] text-slate-900 mb-[8px]">You're all caught up!</h3>
              <p className="text-[14px] text-slate-500">No new notifications at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f4f7fb]">
              <AnimatePresence>
                {notifications.map((notif, index) => {
                  const Icon = notif.icon;
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0, padding: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`relative flex gap-[16px] p-[20px] md:p-[24px] hover:bg-slate-100 transition-colors group ${notif.isRead ? 'opacity-70' : 'bg-[#eef2ff]/50'}`}
                    >
                      {!notif.isRead && (
                        <div className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-indigo-600" />
                      )}
                      
                      <div className={`w-[48px] h-[48px] rounded-full shrink-0 flex items-center justify-center ${notif.bgColor}`}>
                        <Icon className={`w-[24px] h-[24px] ${notif.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-[4px]">
                          <h4 className={`text-[16px] truncate pr-[16px] ${notif.isRead ? 'font-[500] text-slate-500' : 'font-[700] text-slate-900'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[12px] text-[#6b7280] whitespace-nowrap shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-[14px] text-slate-500 leading-[20px]">
                          {notif.message}
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.isRead && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => markAsRead(notif.id)}
                            className="w-[36px] h-[36px] rounded-full hover:bg-[#eef2ff] hover:text-indigo-600 text-[#6b7280]"
                            title="Mark as read"
                          >
                            <Check className="w-[18px] h-[18px]" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteNotification(notif.id)}
                          className="w-[36px] h-[36px] rounded-full hover:bg-[#fee2e2] hover:text-red-600 text-[#6b7280]"
                          title="Remove notification"
                        >
                          <Trash2 className="w-[18px] h-[18px]" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
});

export default NotificationsCandidate;
