"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


import { Clock, User, Mail, AlertCircle, CheckCircle, XCircle, Calendar, Tag, Flag, ArrowLeft } from "lucide-react";

export default function TicketDetailPage() {
  const [ticket, setTicket] = useState(null);
  const [traces, setTraces] = useState([]);
  // For demo purposes, we'll use a mock ID - in real app, you'd get this from your router
    const { id } = useParams();

  useEffect(() => {
   if(!id) return;
    const token = localStorage.getItem("fixmate_token");
    const fetchData = async () => {
      try {
        const [ticketRes, traceRes] = await Promise.all([
          fetch(`/api/ticket/${id}/info`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/ticket/${id}/tracelog`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const ticketData = await ticketRes.json();
        console.log(ticketData,"bro ticket data")
        const traceData = await traceRes.json();
         console.log(traceData,"bro trace data")
        setTicket(ticketData);
        setTraces(traceData);
      } catch (error) {
        console.error('Error fetching ticket data:', error);
        // Handle error state - you might want to set an error state here
      }
    };
    fetchData();
  }, [id]);

  const getStatusColor = (status) => {
     if (!status) return <AlertCircle className="w-4 h-4" />;
    switch (status.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
      if (!priority) return <AlertCircle className="w-4 h-4" />;
    switch (priority.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
     if (!status) return <AlertCircle className="w-4 h-4" />;
    switch (status.toLowerCase()) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-600">The ticket you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Tickets</span>
            </button>
            <div className="text-sm text-slate-500">
              Ticket #{ticket.id || id}
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {ticket.title}
            </h1>
            
            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)}
                {ticket.status}
              </span>
              
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
                <Flag className="w-4 h-4" />
                {ticket.priority} Priority
              </span>
              
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-800 border border-slate-200">
                <Tag className="w-4 h-4" />
                {ticket.category}
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Description</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-gray-700 leading-relaxed text-base">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* Ticket Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reporter Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Reporter
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {ticket.userId?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{ticket.userId?.name || 'Unknown User'}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {ticket.userId?.email || 'No email provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignee Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Assigned To
            </h3>
            <div className="space-y-3">
              {ticket.assignedTo ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {ticket.assignedTo?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.assignedTo?.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {ticket.assignedTo?.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Not Assigned</p>
                    <p className="text-sm text-gray-400">Waiting for assignment</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trace Log */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Activity Timeline
          </h3>
          
          {traces.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No activity logs yet</p>
              <p className="text-gray-400 text-sm mt-2">Activity will appear here as the ticket progresses</p>
            </div>
          ) : (
            <div className="space-y-4">
              {traces.map((trace, index) => (
                <div key={index} className="relative">
                  {index !== traces.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                  )}
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{trace.action}</h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                            {trace.byRole}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(trace.timestamp).toLocaleString()}
                          </p>
                          
                          <div className="flex items-start gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">IP:</span>
                              <span className="bg-white px-2 py-0.5 rounded border">{trace.ip}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs">
                            <span className="font-medium">Device:</span>
                            <span className="ml-1 text-gray-500">
                              {trace.userAgent?.slice(0, 60)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
}