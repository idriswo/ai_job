import { memo, useState, useEffect } from 'react'
import { Search, Users, UserPlus, Bookmark, Clock, BarChart2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { axiosRequest } from '../../utils/token'
import { toast } from 'sonner'

const SUGGESTIONS = [
  { id: 1, name: "James Holt", role: "Director @ Meta", avatar: "https://i.pravatar.cc/150?u=james" },
  { id: 2, name: "Linda Avery", role: "VP Growth @ Stripe", avatar: "https://i.pravatar.cc/150?u=linda" },
  { id: 3, name: "Paul Tan", role: "Investor @ Sequoia", avatar: "https://i.pravatar.cc/150?u=paul" }
]

const OrganizationNetwork = memo(() => {
  const [activeTab, setActiveTab] = useState<'all' | 'network' | 'pending'>('all')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sentRequests, setSentRequests] = useState<Record<number, boolean>>({})
  const [connectionsMap, setConnectionsMap] = useState<Record<number, any>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const fetchCurrentUser = async () => {
    try {
      if (!currentUser) {
        const res = await axiosRequest.get('/api/User/me');
        setCurrentUser(res.data);
        return res.data;
      }
      return currentUser;
    } catch (error) {
      console.error("Error fetching me", error);
      return null;
    }
  }

  const fetchData = async () => {
    const user = await fetchCurrentUser();

    setLoading(true);
    try {
      if (activeTab === 'all') {
        const [dirRes, connRes] = await Promise.all([
          axiosRequest.get('/api/User/directory'),
          axiosRequest.get('/api/Connection/all')
        ]);
        
        const map: Record<number, any> = {};
        connRes.data.forEach((c: any) => {
          if (c.otherUser && c.otherUser.id) {
            map[c.otherUser.id] = c;
          }
        });
        setConnectionsMap(map);
        
        // Exclude current user from directory if present
        setData(dirRes.data.filter((u: any) => u.id !== user?.id));
      } else if (activeTab === 'network') {
        const res = await axiosRequest.get('/api/Connection/my');
        setData(res?.data || []);
      } else if (activeTab === 'pending') {
        const res = await axiosRequest.get('/api/Connection/all');
        const pending = (res?.data || []).filter((c: any) => c.status === 'Pending');
        setData(pending);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchData();
    } else {
      fetchCurrentUser().then(fetchData);
    }
  }, [activeTab, currentUser?.id]);

  const handleConnect = async (userId: number) => {
    try {
      await axiosRequest.post(`/api/Connection/send/${userId}`, {});
      setSentRequests(prev => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error("Error connecting", error);
    }
  }

  const handleAccept = async (connectionId: number) => {
    try {
      await axiosRequest.put(`/api/Connection/${connectionId}/respond`, { accept: true });
      fetchData(); toast.success('Success!');
    } catch (error) {
      console.error("Error accepting", error);
    }
  }

  const handleReject = async (connectionId: number) => {
    try {
      await axiosRequest.delete(`/api/Connection/${connectionId}`);
      fetchData(); toast.success('Success!');
    } catch (error) {
      console.error("Error rejecting", error);
    }
  }

  const getUserFromItem = (item: any) => {
    if (activeTab === 'all') return item;
    if (item.requester && item.requester.id !== currentUser?.id) return item.requester;
    if (item.addressee && item.addressee.id !== currentUser?.id) return item.addressee;
    return item.otherUser || item;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-slate-50 py-[24px]">
      <div className="max-w-[1520px] mx-auto px-[24px] flex flex-col md:flex-row gap-[24px]">
        
        <div className="w-full md:w-[280px] shrink-0 flex flex-col gap-[24px]">
          <div className="bg-[#ffffff] rounded-2xl p-[24px] border-[1px] border-[#e0dfdc] shadow-lg shadow-slate-200/40 flex flex-col gap-[8px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[48px] h-[48px] bg-slate-100 rounded-2xl flex items-center justify-center border-[1px] border-slate-200">
                <Users className="w-[24px] h-[24px] text-indigo-600" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-indigo-600">Network Portal</h2>
                <p className="text-[12px] text-[#6b7280]">Candidate Tier</p>
              </div>
            </div>

            <nav className="flex flex-col gap-[4px]">
              <button 
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-2xl font-medium text-[14px] transition-colors ${activeTab === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-slate-200/40' : 'text-[#4b5563] hover:bg-slate-100'}`}
              >
                <Users className="w-[18px] h-[18px]" /> All Professionals
              </button>
              <button 
                onClick={() => setActiveTab('network')}
                className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-2xl font-medium text-[14px] transition-colors ${activeTab === 'network' ? 'bg-indigo-600 text-white shadow-lg shadow-slate-200/40' : 'text-[#4b5563] hover:bg-slate-100'}`}
              >
                <UserPlus className="w-[18px] h-[18px]" /> My Network
              </button>
              <button 
                onClick={() => setActiveTab('pending')}
                className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-2xl font-medium text-[14px] transition-colors ${activeTab === 'pending' ? 'bg-indigo-600 text-white shadow-lg shadow-slate-200/40' : 'text-[#4b5563] hover:bg-slate-100'}`}
              >
                <Clock className="w-[18px] h-[18px]" /> Pending Requests
              </button>
              <button className="flex items-center gap-[12px] px-[16px] py-[12px] text-[#4b5563] hover:bg-slate-100 rounded-2xl font-medium text-[14px] transition-colors">
                <Bookmark className="w-[18px] h-[18px]" /> Saved Profiles
              </button>
              <button className="flex items-center gap-[12px] px-[16px] py-[12px] text-[#4b5563] hover:bg-slate-100 rounded-2xl font-medium text-[14px] transition-colors">
                <BarChart2 className="w-[18px] h-[18px]" /> Industry Insights
              </button>
            </nav>

            <Button className="w-full bg-indigo-600 text-white hover:bg-[#001c66] mt-[16px] h-[44px] rounded-2xl font-bold">
              Discover Jobs
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-[24px]">
          <div className="bg-[#ffffff] rounded-2xl p-[24px] border-[1px] border-[#e0dfdc] shadow-lg shadow-slate-200/40">
            <div className="relative flex items-center">
              <Search className="absolute left-[16px] text-[#6b7280] w-[20px] h-[20px]" />
              <Input 
                value={searchQuery}
                onChange={(el) => setSearchQuery(el.target.value)}
                placeholder="Search by name, role, or company" 
                className="pl-[48px] bg-slate-100 border-[#e0dfdc] text-[15px] rounded-2xl h-[48px] focus-visible:ring-[#00288e]"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center p-8 text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-[24px]">
              {data.filter((item: any) => {
                if (!searchQuery) return true;
                const user = getUserFromItem(item);
                const name = (user?.fullName || user?.name || "").toLowerCase();
                const role = (user?.profile?.headline || user?.headline || user?.role || "").toLowerCase();
                const company = (user?.profile?.company || "").toLowerCase();
                const query = searchQuery.toLowerCase();
                return name.includes(query) || role.includes(query) || company.includes(query);
              }).map((item: any) => {
                const user = getUserFromItem(item);
                const name = user?.fullName || user?.name || "Professional";
                const role = user?.profile?.headline || user?.headline || user?.role || "Member";
                const avatar = user?.profile?.avatarUrl || user?.imageUrl || "";
                
                return (
                  <div key={item.id} className="bg-[#ffffff] rounded-2xl p-[24px] border-[1px] border-[#e0dfdc] shadow-lg shadow-slate-200/40 flex flex-col items-center relative">
                    <Avatar className="w-[96px] h-[96px] mb-[16px] border-[4px] border-[#f8f9ff] shadow-lg shadow-slate-200/40">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-[18px] font-bold text-slate-900 mb-[4px] text-center">{name}</h3>
                    <p className="text-[14px] text-[#4b5563] mb-[16px] text-center line-clamp-2">{role}</p>

                    <div className="flex w-full gap-[12px] mt-auto">
                      {activeTab === 'all' && (
                        (() => {
                          const conn = connectionsMap[user.id];
                          if (conn) {
                            if (conn.status === 'Accepted') {
                              return <Button disabled className="flex-1 bg-[#f3f4f6] text-[#4b5563] h-[40px] rounded-2xl font-semibold border-none shadow-lg shadow-slate-200/40 cursor-not-allowed">Connected</Button>;
                            }
                            if (conn.status === 'Pending') {
                              if (conn.requesterId === currentUser?.id) {
                                return <Button disabled className="flex-1 bg-[#f3f4f6] text-[#4b5563] h-[40px] rounded-2xl font-semibold border-none shadow-lg shadow-slate-200/40 cursor-not-allowed">Pending</Button>;
                              } else {
                                return <Button onClick={() => handleAccept(conn.id)} className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 h-[40px] rounded-2xl font-semibold">Accept</Button>;
                              }
                            }
                            if (conn.status === 'Rejected') {
                              return (
                                <>
                                  <Button disabled className="flex-1 bg-[#ffe6e6] text-slate-500 h-[40px] rounded-2xl font-semibold border-none shadow-lg shadow-slate-200/40 cursor-not-allowed">Rejected</Button>
                                  <Button 
                                    onClick={() => handleReject(conn.id)}
                                    variant="outline"
                                    className="flex-1 text-indigo-600 border-indigo-600 hover:bg-[#eef2ff] hover:text-indigo-600 h-[40px] rounded-2xl font-semibold"
                                  >
                                    Reset
                                  </Button>
                                </>
                              );
                            }
                          }
                          return (
                            <Button 
                              onClick={() => handleConnect(user.id)}
                              disabled={sentRequests[user.id]}
                              variant="outline" 
                              className="flex-1 text-indigo-600 border-indigo-600 hover:bg-[#eef2ff] hover:text-indigo-600 h-[40px] rounded-2xl font-semibold"
                            >
                              {sentRequests[user.id] ? "Pending" : "Connect"}
                            </Button>
                          );
                        })()
                      )}
                      
                      {activeTab === 'network' && (
                        <>
                          <Button variant="outline" className="flex-1 text-indigo-600 border-indigo-600 hover:bg-[#eef2ff] hover:text-indigo-600 h-[40px] rounded-2xl font-semibold">
                            Profile
                          </Button>
                          <Button className="flex-1 bg-indigo-600 text-white hover:bg-[#001c66] h-[40px] rounded-2xl font-semibold">
                            Message
                          </Button>
                        </>
                      )}

                      {activeTab === 'pending' && (
                        <>
                          {item.addresseeId === currentUser?.id ? (
                            <>
                              <Button 
                                onClick={() => handleAccept(item.id)}
                                className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 h-[40px] rounded-2xl font-semibold"
                              >
                                Accept
                              </Button>
                              <Button 
                                onClick={() => handleReject(item.id)}
                                variant="outline" 
                                className="flex-1 text-slate-500 border-[#00000099] hover:bg-slate-100 hover:text-slate-500 h-[40px] rounded-2xl font-semibold"
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Button 
                              onClick={() => handleReject(item.id)}
                              variant="outline" 
                              className="flex-1 text-slate-500 border-[#00000099] hover:bg-slate-100 hover:text-slate-500 h-[40px] rounded-2xl font-semibold"
                            >
                              Withdraw
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {!loading && data.length === 0 && (
                <div className="col-span-1 xl:col-span-2 text-center py-12 text-[#6b7280]">
                  No users found in this category.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden lg:flex w-[320px] shrink-0 flex-col gap-[24px]">          
          <div className="bg-[#ffffff] rounded-2xl p-[24px] border-[1px] border-[#e0dfdc] shadow-lg shadow-slate-200/40">
            <h3 className="text-[16px] font-bold text-slate-900 mb-[16px]">Network Stats</h3>
            <div className="flex gap-[12px] mb-[16px]">
              <div className="flex-1 bg-slate-100 rounded-2xl p-[16px] flex flex-col items-center justify-center border-[1px] border-[#eef2ff]">
                <span className="text-[20px] font-bold text-indigo-600 mb-[4px]">1,284</span>
                <span className="text-[11px] text-[#6b7280] font-medium">Connections</span>
              </div>
              <div className="flex-1 bg-[#faf5ff] rounded-2xl p-[16px] flex flex-col items-center justify-center border-[1px] border-[#f3e8ff]">
                <span className="text-[20px] font-bold text-[#6b21a8] mb-[4px]">243</span>
                <span className="text-[11px] text-[#6b7280] font-medium">Profile Views</span>
              </div>
            </div>
            <a href="#" className="block text-center text-[13px] font-bold text-indigo-600 hover:underline">
              View detailed analytics
            </a>
          </div>

          <div className="bg-[#ffffff] rounded-2xl p-[24px] border-[1px] border-[#e0dfdc] shadow-lg shadow-slate-200/40">
            <div className="flex items-center justify-between mb-[16px]">
              <h3 className="text-[16px] font-bold text-slate-900">Suggestions</h3>
              <a href="#" className="text-[13px] font-bold text-indigo-600 hover:underline">See all</a>
            </div>
            <div className="flex flex-col gap-[16px]">
              {SUGGESTIONS.map(user => (
                <div key={user.id} className="flex items-center gap-[12px]">
                  <Avatar className="w-[40px] h-[40px] border-[1px] border-[#e0dfdc]">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-slate-900 truncate">{user.name}</h4>
                    <p className="text-[12px] text-[#6b7280] truncate">{user.role}</p>
                  </div>
                  <Button variant="outline" className="h-[28px] px-[12px] rounded-full text-[12px] font-semibold text-slate-900 border-slate-200 hover:bg-[#f3f4f6]">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-[24px] shadow-lg shadow-slate-200/40 text-white">
            <h3 className="text-[18px] font-bold mb-[12px]">Premium Insights</h3>
            <p className="text-[13px] leading-[20px] text-[#eef2ff] mb-[20px]">
              Get AI-powered profile optimization and see who's viewing your profile in real-time.
            </p>
            <Button className="w-full bg-[#ffffff] text-indigo-600 hover:bg-slate-100 h-[44px] rounded-2xl font-bold">
              Upgrade Now
            </Button>
          </div>

        </div>

      </div>
    </div>
  )
})

export default OrganizationNetwork
