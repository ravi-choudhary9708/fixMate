"use client";
import { useEffect, useState } from "react";
import { Settings, Users, Clock, CheckCircle, PlayCircle, LogOut, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StaffDashboard() {
    const router= useRouter();
  const [tickets, setTickets] = useState([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage?.getItem("fixmate_token");
        if (!token) return;
        
        const res = await fetch("/api/ticket/staff", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, [success]);

  const handleStatusUpdate = async (ticketId, newStatus) => {
    setLoading(prev => ({ ...prev, [ticketId]: true }));
    
    try {
      const token = localStorage?.getItem("fixmate_token");
      const res = await fetch(`/api/ticket/${ticketId}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
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
      case "Assigned": return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Resolved": return "bg-green-100 text-green-800 border-green-200";
      case "Closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Assigned": return <AlertCircle className="w-4 h-4" />;
      case "In Progress": return <Clock className="w-4 h-4" />;
      case "Resolved": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTicketCounts = () => {
    const assigned = tickets.filter(t => t.status === "Assigned").length;
    const inProgress = tickets.filter(t => t.status === "In Progress").length;
    const resolved = tickets.filter(t => t.status === "Resolved").length;
    return { assigned, inProgress, resolved, total: tickets.length };
  };

  const counts = getTicketCounts();

    const handleClick=()=>{
 router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-sm text-gray-600">Manage assigned tickets</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-blue-600">{counts.assigned}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-purple-600">{counts.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{counts.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Assigned Tickets</h2>
            </div>
          </div>

          <div className="p-6">
            {tickets.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No tickets assigned</p>
                <p className="text-gray-400 text-sm">Check back later for new assignments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
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
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span>{ticket.status}</span>
                        </span>
                      </div>

                      {ticket.status !== "Resolved" && (
                        <div className="flex space-x-2">
                          {ticket.status === "Assigned" && (
                            <button
                              onClick={() => handleStatusUpdate(ticket._id, "In Progress")}
                              disabled={loading[ticket._id]}
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                              <PlayCircle className="w-4 h-4" />
                              <span>{loading[ticket._id] ? "Starting..." : "Start"}</span>
                            </button>
                          )}
                          {["Assigned", "In Progress"].includes(ticket.status) && (
                            <button
                              onClick={() => handleStatusUpdate(ticket._id, "Resolved")}
                              disabled={loading[ticket._id]}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>{loading[ticket._id] ? "Resolving..." : "Resolve"}</span>
                            </button>
                          )}
                        </div>
                      )}
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