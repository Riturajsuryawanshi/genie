import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageSquare, 
  Mail, 
  Building, 
  Calendar, 
  User, 
  Eye, 
  CheckCircle, 
  Clock,
  Filter,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const AdminContactMessages: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const statusOptions = [
    { value: 'all', label: 'All Messages', color: 'gray' },
    { value: 'new', label: 'New', color: 'blue' },
    { value: 'read', label: 'Read', color: 'yellow' },
    { value: 'responded', label: 'Responded', color: 'green' },
    { value: 'closed', label: 'Closed', color: 'red' }
  ];

  const subjectLabels = {
    'general': 'General Inquiry',
    'demo': 'Request Demo',
    'support': 'Technical Support',
    'pricing': 'Pricing Questions',
    'partnership': 'Partnership'
  };

  const fetchMessages = async (page = 1, status = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (status !== 'all') {
        params.append('status', status);
      }

      const response = await fetch(`/api/contact?${params}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.data.messages);
        setPagination(data.data.pagination);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, status: newStatus as ContactMessage['status'] } : msg
        ));
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error occurred');
      console.error('Error updating status:', err);
    }
  };

  useEffect(() => {
    fetchMessages(currentPage, selectedStatus);
  }, [currentPage, selectedStatus]);

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'read': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'responded': 'bg-green-500/20 text-green-300 border-green-500/30',
      'closed': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status as keyof typeof colors] || colors.new;
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
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                Contact Messages
              </span>
              <div className="text-xs text-purple-300/60 -mt-1">Admin Panel</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        {/* Stats and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
            {pagination && (
              <span className="text-purple-300/70">
                ({pagination.totalMessages} total)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-purple-300" />
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        )}

        {/* Messages List */}
        {!loading && messages.length > 0 && (
          <div className="space-y-4 mb-8">
            {messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-white/[0.05] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                          <User className="h-4 w-4 text-white" />
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
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                          {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                        </span>
                        <select
                          value={message.status}
                          onChange={(e) => updateMessageStatus(message._id, e.target.value)}
                          className="px-2 py-1 bg-white/[0.05] border border-white/[0.1] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="responded">Responded</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm font-medium text-purple-300">
                        Subject: {subjectLabels[message.subject as keyof typeof subjectLabels] || message.subject}
                      </span>
                    </div>

                    <div className="mb-4 p-4 bg-white/[0.03] rounded-lg">
                      <p className="text-white/90 whitespace-pre-wrap">{message.message}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-purple-300/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Received: {formatDate(message.createdAt)}
                      </div>
                      {message.updatedAt !== message.createdAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Updated: {formatDate(message.updatedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Messages */}
        {!loading && messages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-purple-300/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No messages found</h3>
            <p className="text-purple-300/70">
              {selectedStatus === 'all' 
                ? 'No contact messages have been received yet.' 
                : `No messages with status "${selectedStatus}" found.`}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              Previous
            </button>
            
            <span className="text-purple-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminContactMessages;