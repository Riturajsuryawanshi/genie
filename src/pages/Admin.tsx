import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  ArrowLeft,
  Mail,
  Calendar,
  User,
  Building,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  isEmailVerified: boolean;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'messages'>('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch('/api/auth/users?limit=10');
      const usersData = await usersResponse.json();
      if (usersData.success) {
        setUsers(usersData.data.users);
      }
      
      // Fetch contact messages
      const messagesResponse = await fetch('/api/contact?limit=5');
      const messagesData = await messagesResponse.json();
      if (messagesData.success) {
        setMessages(messagesData.data.messages);
      }
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-purple-500/20 bg-black/90 backdrop-blur-sm">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>
        
        <div className="flex items-center justify-center mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-2 rounded-xl shadow-lg shadow-purple-500/25">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
              <div className="text-xs text-purple-300/60 -mt-1">User & Message Management</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white'
                : 'bg-white/[0.05] text-purple-300 hover:bg-white/[0.1]'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'messages'
                ? 'bg-purple-600 text-white'
                : 'bg-white/[0.05] text-purple-300 hover:bg-white/[0.1]'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Contact Messages
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        )}

        {/* Users Tab */}
        {!loading && activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Registered Users</h2>
              <span className="text-purple-300/70">({users.length} users)</span>
            </div>
            
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-purple-300/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                <p className="text-purple-300/70">No users have registered yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-purple-300/70">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <span>📞 {user.phone}</span>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        user.isEmailVerified 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {!loading && activeTab === 'messages' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Contact Messages</h2>
              <div className="flex gap-2">
                <span className="text-purple-300/70">({messages.length} recent)</span>
                <button
                  onClick={() => navigate('/admin/messages')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
            
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-purple-300/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No messages found</h3>
                <p className="text-purple-300/70">No contact messages have been received yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {messages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-purple-300/70">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {message.email}
                            </div>
                            {message.company && (
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {message.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        message.status === 'new' ? 'bg-blue-500/20 text-blue-300' :
                        message.status === 'read' ? 'bg-yellow-500/20 text-yellow-300' :
                        message.status === 'responded' ? 'bg-green-500/20 text-green-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {message.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-sm font-medium text-purple-300">
                        Subject: {message.subject}
                      </span>
                    </div>
                    
                    <div className="mb-4 p-4 bg-white/[0.03] rounded-lg">
                      <p className="text-white/90 line-clamp-3">{message.message}</p>
                    </div>
                    
                    <div className="text-xs text-purple-300/60">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {formatDate(message.createdAt)}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;