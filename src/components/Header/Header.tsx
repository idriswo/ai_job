import { Search, Home, Briefcase, Users, MessageSquare, Bell, Plus, Sparkles, Building2, PenTool, MonitorPlay, X, ArrowRight, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { memo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { logoutUser, axiosRequest } from '../../utils/token'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

const Header = memo(() => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [pendingRequests, setPendingRequests] = useState(0)
  
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('store_token') || localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload?.role || null);
        const idStr = payload?.id || payload?.sub || payload?.userId;
        setCurrentUserId(idStr ? Number(idStr) : null);
      } catch (e) {
        console.error("Error parsing token", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axiosRequest.get('/api/User/me');
        setCurrentUser(res.data);
      } catch (e) {
        console.error("Error fetching user", e);
      }
    };
    if (currentUserId) fetchMe();
  }, [currentUserId]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const fetchCounts = async () => {
      if (!currentUserId) return;
      try {
        const connRes = await axiosRequest.get('/api/Connection/all');
        const pending = (connRes.data || []).filter((c: any) => c.status === 'Pending' && c.addresseeId === currentUserId).length;
        setPendingRequests(pending);

        const convRes = await axiosRequest.get('/api/Conversation');
        const unread = (convRes.data || []).reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0);
        setUnreadMessages(unread);
        
        console.log("Notification counts updated:", { pending, unread, currentUserId });
      } catch (error) {
        console.error('Error fetching notification counts', error);
      }
    };

    if (currentUserId) {
      fetchCounts(); // fetch immediately
      intervalId = setInterval(fetchCounts, 5000); // poll every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentUserId]);

  if (userRole === 'Candidate') {
    return (
      <>
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-[24px] max-w-[1520px] mx-auto h-[64px] border-b border-slate-200/50 shadow-sm">
          <div className="flex items-center gap-[12px]">
            <span className="text-[24px] leading-[32px] font-extrabold text-indigo-600 tracking-tight cursor-pointer" onClick={() => navigate('/candidate')}>AIJob</span>
            
            <div className="relative hidden md:block" ref={searchRef}>
              <div className={`flex items-center bg-slate-100 rounded-2xl px-[16px] h-[40px] gap-[8px] transition-all w-[320px] border ${isSearchFocused ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white' : 'border-transparent hover:bg-slate-200/50'}`}>
                <Search className={`w-[16px] h-[16px] ${isSearchFocused ? 'text-indigo-600' : 'text-slate-500'}`} />
                <input 
                  className="bg-transparent border-none focus:ring-0 text-[14px] text-slate-900 w-full outline-none placeholder:text-slate-500" 
                  placeholder="Search jobs, network, roles..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim() !== '') {
                      setIsSearchFocused(false);
                      navigate(`/jobs-candidate?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-[2px] hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-[14px] h-[14px]" />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[48px] left-0 w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 py-[12px] z-[100]"
                  >
                    <div className="px-[16px] mb-[8px]">
                      <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Quick Search</span>
                    </div>
                    <div className="flex flex-col mb-[12px]">
                      <button onClick={() => { setIsSearchFocused(false); navigate(`/jobs-candidate?search=${encodeURIComponent(searchQuery.trim())}`); }} className="flex items-center justify-between w-full px-[16px] py-[10px] hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[32px] h-[32px] rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                            <Briefcase className="w-[16px] h-[16px]" />
                          </div>
                          <span className="text-[14px] font-semibold text-slate-700">
                            Search Jobs for <span className="text-indigo-600">"{searchQuery}"</span>
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-[8px] py-[3px] rounded-full uppercase">Jobs</span>
                      </button>
                      <button onClick={() => { setIsSearchFocused(false); navigate(`/network-candidate`); }} className="flex items-center justify-between w-full px-[16px] py-[10px] hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[32px] h-[32px] rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                            <Users className="w-[16px] h-[16px]" />
                          </div>
                          <span className="text-[14px] font-semibold text-slate-700">
                            Search People for <span className="text-indigo-600">"{searchQuery}"</span>
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-[8px] py-[3px] rounded-full uppercase">Network</span>
                      </button>
                      <button onClick={() => { setIsSearchFocused(false); navigate(`/organization`); }} className="flex items-center justify-between w-full px-[16px] py-[10px] hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[32px] h-[32px] rounded-xl bg-green-50 flex items-center justify-center text-green-500 group-hover:bg-green-100 transition-colors">
                            <Building2 className="w-[16px] h-[16px]" />
                          </div>
                          <span className="text-[14px] font-semibold text-slate-700">
                            Search Companies for <span className="text-indigo-600">"{searchQuery}"</span>
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-[8px] py-[3px] rounded-full uppercase">Companies</span>
                      </button>
                    </div>

                    <div className="w-full h-[1px] bg-slate-100 my-[8px]"></div>

                    <div className="px-[16px] pt-[8px] flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Press Enter to search</span>
                      <button 
                        onClick={() => { setIsSearchFocused(false); navigate(`/jobs-candidate?search=${encodeURIComponent(searchQuery.trim())}`); }}
                        className="text-[13px] font-bold text-red-500 hover:text-red-600 flex items-center gap-[4px] transition-colors"
                      >
                        View All <ArrowRight className="w-[14px] h-[14px]" />
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-[8px] h-[100%]">
            <NavLink to="/ai-candidate" className={({isActive}) => `text-[13px] font-[500] flex items-center justify-center gap-[6px] px-[16px] py-[8px] transition-all rounded-2xl ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`} >
              {({isActive}) => (
                <>
                  <Sparkles className={`w-[18px] h-[18px] ${isActive ? 'fill-indigo-100' : ''}`} />
                  <span>AI Assistant</span>
                </>
              )}
            </NavLink>
            <div className="w-[1px] h-[24px] bg-slate-200 mx-[4px]"></div>
            <NavLink to="/candidate" className={({isActive}) => `text-[13px] font-[500] flex flex-col items-center justify-center gap-[2px] h-[100%] px-[12px] transition-all min-w-[70px] ${isActive ? 'text-indigo-600 border-b-[2px] border-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`} >
              {({isActive}) => (
                <>
                  <Home className={`w-[22px] h-[22px] ${isActive ? 'fill-current' : ''}`} />
                  <span>Home</span>
                </>
              )}
            </NavLink>
            <NavLink to="/network-candidate" className={({isActive}) => `text-[13px] font-[500] flex flex-col items-center justify-center gap-[2px] h-[100%] px-[12px] transition-all min-w-[70px] ${isActive ? 'text-indigo-600 border-b-[2px] border-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`} >
              {({isActive}) => (
                <>
                  <div className="relative">
                    <Users className={`w-[22px] h-[22px] ${isActive ? 'fill-current' : ''}`} />
                    {pendingRequests > 0 && (
                      <span className="absolute -top-[4px] -right-[6px] bg-red-500 text-white text-[10px] leading-tight font-bold px-[4px] py-[1px] rounded-full min-w-[16px] text-center">{pendingRequests}</span>
                    )}
                  </div>
                  <span>Network</span>
                </>
              )}
            </NavLink>
            <NavLink to="/jobs-candidate" className={({isActive}) => `text-[13px] font-[500] flex flex-col items-center justify-center gap-[2px] h-[100%] px-[12px] transition-all min-w-[70px] ${isActive ? 'text-indigo-600 border-b-[2px] border-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`} >
              {({isActive}) => (
                <>
                  <Briefcase className={`w-[22px] h-[22px] ${isActive ? 'fill-current' : ''}`} />
                  <span>Jobs</span>
                </>
              )}
            </NavLink>
            <NavLink to="/messages-candidate" className={({isActive}) => `text-[13px] font-[500] flex flex-col items-center justify-center gap-[2px] h-[100%] px-[12px] transition-all min-w-[70px] ${isActive ? 'text-indigo-600 border-b-[2px] border-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`} >
              {({isActive}) => (
                <>
                  <div className="relative">
                    <MessageSquare className={`w-[22px] h-[22px] ${isActive ? 'fill-current' : ''}`} />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-[4px] -right-[6px] bg-red-500 text-white text-[10px] leading-tight font-bold px-[4px] py-[1px] rounded-full min-w-[16px] text-center">{unreadMessages}</span>
                    )}
                  </div>
                  <span>Messages</span>
                </>
              )}
            </NavLink>
            <NavLink to="/notifications-candidate" className={({isActive}) => `text-[13px] font-[500] flex flex-col items-center justify-center gap-[2px] h-[100%] px-[12px] transition-all min-w-[70px] ${isActive ? 'text-indigo-600 border-b-[2px] border-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`} >
              {({isActive}) => (
                <>
                  <div className="relative">
                    <Bell className={`w-[22px] h-[22px] ${isActive ? 'fill-current' : ''}`} />
                    <span className="absolute top-[0px] right-[2px] w-[8px] h-[8px] bg-red-500 rounded-full"></span>
                  </div>
                  <span>Alerts</span>
                </>
              )}
            </NavLink>
          </nav>

          <div className="flex items-center h-[100%] gap-[16px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-center justify-center gap-[2px] cursor-pointer text-[12px] text-slate-500 hover:text-indigo-600 transition-colors min-w-[70px] group outline-none">
                  <div className="relative">
                    <Avatar className="w-[28px] h-[28px] ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                      <AvatarImage src={currentUser?.avatarUrl || currentUser?.profilePicture || undefined} />
                      <AvatarFallback>{currentUser?.fullName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex items-center font-medium mt-[2px]">
                    <span className="truncate max-w-[50px]">{currentUser ? currentUser.fullName.split(' ')[0] : 'Me'}</span>
                    <ChevronDown className="w-[12px] h-[12px] ml-[2px] opacity-70 group-hover:opacity-100" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-[8px] mt-[12px]">
                
                <div className="px-[12px] py-[12px] flex items-center gap-[12px] border-b border-slate-100 mb-[8px]">
                  <Avatar className="w-[40px] h-[40px]">
                    <AvatarImage src={currentUser?.avatarUrl || currentUser?.profilePicture || undefined} />
                    <AvatarFallback>{currentUser?.fullName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[14px] font-bold text-slate-800 leading-tight truncate">{currentUser?.fullName || 'My Profile'}</span>
                    <span className="text-[12px] text-slate-500 capitalize">{userRole?.toLowerCase() || 'Candidate'}</span>
                  </div>
                </div>

                <DropdownMenuItem onClick={() => navigate('/profile-candidate')} className="flex items-center gap-[10px] cursor-pointer text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl px-[12px] py-[10px] transition-colors focus:bg-slate-50 focus:text-indigo-600">
                  <User className="w-[16px] h-[16px]" />
                  <span>My Account</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/settings')} className="flex items-center gap-[10px] cursor-pointer text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl px-[12px] py-[10px] transition-colors focus:bg-slate-50 focus:text-indigo-600">
                  <Settings className="w-[16px] h-[16px]" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <div className="w-full h-[1px] bg-slate-100 my-[8px]"></div>

                <DropdownMenuItem 
                  className="flex items-center gap-[10px] cursor-pointer text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl px-[12px] py-[10px] transition-colors focus:bg-red-50 focus:text-red-600"
                  onClick={async () => {
                    await logoutUser();
                    navigate('/');
                  }}
                >
                  <LogOut className="w-[16px] h-[16px]" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t-[1px] border-[#c4c5d5] flex justify-around items-center py-[8px] z-50">
          <NavLink to="/candidate" className="text-[#191919] flex flex-col items-center gap-[4px]">
            <Home className="w-[24px] h-[24px] fill-current" />
            <span className="text-[10px] font-[600]">Home</span>
          </NavLink>
          <NavLink to="/network-candidate" className="text-[#666666] flex flex-col items-center gap-[4px]">
            <div className="relative">
              <Users className="w-[24px] h-[24px]" />
              {pendingRequests > 0 && (
                <span className="absolute -top-[6px] -right-[8px] bg-red-500 text-white text-[10px] leading-tight font-bold px-[4px] py-[2px] rounded-full border-[2px] border-white min-w-[18px] text-center">{pendingRequests}</span>
              )}
            </div>
            <span className="text-[10px] font-[600]">Network</span>
          </NavLink>
          <button className="bg-[#00288e] text-[#ffffff] w-[48px] h-[48px] rounded-full shadow-lg flex items-center justify-center -mt-[32px] border-[4px] border-[#ffffff]">
            <Plus className="w-[24px] h-[24px]" />
          </button>
          <NavLink to="/jobs-candidate" className="text-[#666666] flex flex-col items-center gap-[4px]">
            <Briefcase className="w-[24px] h-[24px]" />
            <span className="text-[10px] font-[600]">Jobs</span>
          </NavLink>
          <NavLink to="/messages-candidate" className="text-[#666666] flex flex-col items-center gap-[4px]">
            <div className="relative">
              <MessageSquare className="w-[24px] h-[24px]" />
              {unreadMessages > 0 && (
                <span className="absolute -top-[6px] -right-[8px] bg-red-500 text-white text-[10px] leading-tight font-bold px-[4px] py-[2px] rounded-full border-[2px] border-white min-w-[18px] text-center">{unreadMessages}</span>
              )}
            </div>
            <span className="text-[10px] font-[600]">Messages</span>
          </NavLink>
        </nav>
      </>
    )
  }

  if (userRole === 'Organization') {
    return (
      <>
        <header className="bg-[#ffffff] sticky top-0 z-50 flex justify-between items-center w-full px-[24px] max-w-[1520px] mx-auto shadow-sm h-[64px]">
          
          <div className="flex items-center gap-[32px]">
            <span className="text-[24px] leading-[32px] font-bold text-[#00288e]">AIJob</span>
            <div className="hidden md:flex items-center bg-[#f8f9ff] rounded-[8px] px-[16px] py-[8px] gap-[8px]">
              <Search className="w-[20px] h-[20px] text-[#c4c5d5]" />
              <input 
                className="bg-transparent border-none focus:ring-0 text-[14px] leading-[20px] w-[256px] outline-none" 
                placeholder="Search for candidates..." 
                type="text" 
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-[32px] h-[100%]">
            <NavLink to="/company-feed" className="text-[14px] leading-[20px] font-[600] text-[#444653] hover:text-[#00288e] transition-colors flex flex-col items-center justify-center gap-[4px] h-[100%] px-[8px]" >
              <Home className="w-[24px] h-[24px]" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/company-jobs" className="text-[14px] leading-[20px] font-[600] text-[#444653] hover:text-[#00288e] transition-colors flex flex-col items-center justify-center gap-[4px] h-[100%] px-[8px]" >
              <Briefcase className="w-[24px] h-[24px]" />
              <span>Jobs</span>
            </NavLink>
            <NavLink to="/company-network" className="text-[14px] leading-[20px] font-[600] text-[#444653] hover:text-[#00288e] transition-colors flex flex-col items-center justify-center gap-[4px] h-[100%] px-[8px]" >
              <Users className="w-[24px] h-[24px]" />
              <span>Network</span>
            </NavLink>
            <NavLink to="/company-messages" className="text-[14px] leading-[20px] font-[600] text-[#444653] hover:text-[#00288e] transition-colors flex flex-col items-center justify-center gap-[4px] h-[100%] px-[8px]" >
              <MessageSquare className="w-[24px] h-[24px]" />
              <span>Messages</span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-[16px]">
            <NavLink 
              to={userRole === 'Candidate' ? '/notifications-candidate' : '#'}
              className={({isActive}) => `relative transition-colors ${isActive ? 'text-[#00288e]' : 'text-[#444653] hover:text-[#00288e]'}`}
            >
              <Bell className="w-[24px] h-[24px]" />
              <span className="absolute top-0 right-0 w-[8px] h-[8px] bg-[#ff4d4d] rounded-full"></span>
            </NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-[32px] h-[32px] border-[1px] border-[#c4c5d5] cursor-pointer">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVSgLreOYQGsojaowInuX4U02Fnd4jf7BfQXrFe-qiqbmP49ucp-vZbyWSwYFfxa_9aBAnTUtuTr19weNdcdOlqcl8rJD5_9fl-L6Dpv7fkgl_VS2mN8z_9oNmuy19jri7VP0egnpmDPdhqOZHOB_HKtGNBBNTbViqWD9jmMFReyGskGzRdxvokYh3D8FxJEBg7gXdOTwDBpdg2pD9xadk1iC7D9GwexOisTfqq5uJgLFxGbSN2NF6bCpkb0cUEn94p6rwH63zd9Je" />
                  <AvatarFallback>O</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] bg-[#ffffff] border-[#c4c5d5]">
                <DropdownMenuItem className="cursor-pointer text-[#0b1c30] hover:bg-[#f8f9ff] hover:text-[#00288e]">
                  Company Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-[#ff4d4d] hover:bg-[#fff0f0] hover:text-[#e60000]"
                  onClick={async () => {
                    await logoutUser();
                    navigate('/');
                  }}
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t-[1px] border-[#c4c5d5] flex justify-around items-center py-[8px] z-50">
          <NavLink to="/company-feed" className="text-[#666666] flex flex-col items-center gap-[4px]">
            <Home className="w-[24px] h-[24px]" />
            <span className="text-[10px] font-[600]">Dashboard</span>
          </NavLink>
          <NavLink to="/company-network" className="text-[#666666] flex flex-col items-center gap-[4px]">
            <Users className="w-[24px] h-[24px]" />
            <span className="text-[10px] font-[600]">Network</span>
          </NavLink>
          <button className="bg-[#00288e] text-[#ffffff] w-[48px] h-[48px] rounded-full shadow-lg flex items-center justify-center -mt-[32px] border-[4px] border-[#ffffff]">
            <Plus className="w-[24px] h-[24px]" />
          </button>
          <NavLink to="/company-jobs" className="text-[#666666] flex flex-col items-center gap-[4px]">
            <Briefcase className="w-[24px] h-[24px]" />
            <span className="text-[10px] font-[600]">Jobs</span>
          </NavLink>
          <NavLink to="/company-messages" className="text-[#666666] flex flex-col items-center gap-[4px]">
            <MessageSquare className="w-[24px] h-[24px]" />
            <span className="text-[10px] font-[600]">Messages</span>
          </NavLink>
        </nav>
      </>
    )
  }

  return (
    <header className="w-[100%] h-[72px] border-b-[1px] border-[#e0dfdc] flex items-center justify-center bg-[#ffffff]">
      <div className="w-[100%] max-w-[1450px] px-[24px] flex items-center justify-between">
        
        <div className="flex items-center gap-[48px]">
          <NavLink to="/" className="text-[#003b8e] font-bold text-[24px] tracking-tight">
            ai-job
          </NavLink>
          
          <nav className="flex items-center gap-[32px]">
            <NavLink to="/companies" className="text-[#4b5563] hover:text-[#111827] text-[15px] font-medium transition-colors">
              Companies
            </NavLink>
            <NavLink to="/candidates" className="text-[#4b5563] hover:text-[#111827] text-[15px] font-medium transition-colors">
              Candidates
            </NavLink>
            <NavLink to="/jobs" className="text-[#4b5563] hover:text-[#111827] text-[15px] font-medium transition-colors">
              Jobs
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-[16px]">
          <div className="relative flex items-center">
            <Search className="absolute left-[12px] text-[#6b7280] w-[18px] h-[18px]" />
            <Input 
              placeholder="Search..." 
              className="pl-[38px] w-[280px] h-[40px] bg-[#f3f4f6] border-transparent text-[#111827] text-[14px] rounded-[6px] focus-visible:ring-[#003b8e]"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="h-[40px] px-[20px] rounded-[6px] border-[1px] border-[#003b8e] bg-transparent text-[#003b8e] hover:bg-[#eff6ff] hover:text-[#003b8e] font-semibold text-[14px]"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
          
          <Button 
          onClick={() => navigate('/register')}
            className="h-[40px] px-[20px] rounded-[6px] bg-[#007a5a] text-[#ffffff] hover:bg-[#006046] font-semibold text-[14px] border-none"
          >
            Sign Up
          </Button>
        </div>

      </div>
    </header>
  )
})

export default Header