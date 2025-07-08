"use client";
import { useEffect, useState } from "react";
import { 
  Shield, 
  Users, 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  UserCheck, 
  LogOut,
  Filter,
  Search,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router= useRouter();
  const [tickets, setTickets] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage?.getItem("fixmate_token");
        if (!token) return;

        // Fetch all tickets
        const ticketsRes = await fetch("/api/admin/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData);

        // Fetch staff list
        const staffRes = await fetch("/api/admin/staff", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const staffData = await staffRes.json();
        setStaffList(staffData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [success]);

  const handleAssign = async (ticketId, staffId) => {
    if (!staffId) return;
    
    setLoading(prev => ({ ...prev, [ticketId]: true }));
    
    try {
      const token = localStorage?.getItem("fixmate_token");
      const res = await fetch("/api/admin/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticketId, staffId }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess("Ticket assigned successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error assigning ticket:", error);
    } finally {
      setLoading(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Assigned": return "bg-purple-100 text-purple-800 border-purple-200";
      case "In Progress": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Resolved": return "bg-green-100 text-green-800 border-green-200";
      case "Closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open": return <AlertCircle className="w-4 h-4" />;
      case "Assigned": return <UserCheck className="w-4 h-4" />;
      case "In Progress": return <Clock className="w-4 h-4" />;
      case "Resolved": return <CheckCircle className="w-4 h-4" />;
      case "Closed": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTicketStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === "Open").length;
    const assigned = tickets.filter(t => t.status === "Assigned").length;
    const inProgress = tickets.filter(t => t.status === "In Progress").length;
    const resolved = tickets.filter(t => t.status === "Resolved").length;
    const unassigned = tickets.filter(t => !t.assignedTo).length;
    
    return { total, open, assigned, inProgress, resolved, unassigned };
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = getTicketStats();

    const handleClick=()=>{
 router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage all tickets and staff assignments</p>
              </div>
            </div>
           
            <button onClick={handleClick} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-purple-600">{stats.assigned}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-red-600">{stats.unassigned}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
              </div>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredTickets.length} tickets
              </span>
            </div>
          </div>

          <div className="p-6">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No tickets found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredTickets.map((ticket) => (
                  <div key={ticket._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">{ticket.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">{ticket.description}</p>
                        
                        <div className="flex flex-wrap gap-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                            Priority: {ticket.priority}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            {ticket.category}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            <span>{ticket.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Assigned to: </span>
                          {ticket.assignedTo?.name ? (
                            <span className="text-indigo-600 font-medium">{ticket.assignedTo.name}</span>
                          ) : (
                            <span className="text-red-600 font-medium">Unassigned</span>
                          )}
                        </div>
                      </div>

                    <div className="flex items-center space-x-3">
  <label className="font-medium">Assign:</label>

  <select
    onChange={async (e) => {
      const staffId = e.target.value;
      if (!staffId) return;

      setLoading((prev) => ({ ...prev, [ticket._id]: true }));
      await handleAssign(ticket._id, staffId);
      setLoading((prev) => ({ ...prev, [ticket._id]: false }));
    }}
    value={ticket.assignedTo?._id || ""}
    disabled={!!ticket.assignedTo || loading[ticket._id]}
    className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
      ${ticket.assignedTo ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
      ${loading[ticket._id] ? "opacity-50" : ""}
    `}
  >
    <option value="" disabled>
      {ticket.assignedTo
        ? `${ticket.assignedTo.name} (Already Assigned)`
        : loading[ticket._id]
        ? "Assigning..."
        : "Assign to Staff"}
    </option>

    {staffList.map((staff) => (
      <option key={staff._id} value={staff._id}>
        {staff.name} ({staff.email})
      </option>
    ))}
  </select>
</div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}