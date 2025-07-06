"use client";
import { useEffect, useState } from "react";
import { Plus, Ticket, User, LogOut } from "lucide-react";

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Hardware",
    priority: "Low",
  });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch my tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage?.getItem("fixmate_token");
        if (!token) {
          // Optionally, redirect to login or show a message
          console.warn("No token found. User might not be logged in.");
          return;
        }

        const res = await fetch("/api/ticket/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // Check if data is an array before setting state
        if (Array.isArray(data)) {
          setTickets(data);
        } else {
          console.error("API response for tickets is not an array:", data);
          setTickets([]); // Set to empty array to avoid rendering issues
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, [success]); // Refetch when a new ticket is successfully submitted

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new ticket
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage?.getItem("fixmate_token");
      if (!token) {
        console.error("No authentication token found. Please log in.");
        setSuccess("Error: Not authenticated. Please log in.");
        return;
      }

      const res = await fetch("/api/ticket/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Ticket submitted successfully!");
        setForm({
          title: "",
          description: "",
          category: "Hardware",
          priority: "Low",
        });
        // Optionally, refetch tickets immediately to update the list
        // fetchTickets(); // This would re-run the useEffect
      } else {
        // Handle API errors (e.g., validation errors, server errors)
        setSuccess(`Error submitting ticket: ${data.message || res.statusText}`);
        console.error("API error submitting ticket:", data);
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setSuccess("An unexpected error occurred while submitting the ticket.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-purple-100 text-purple-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your support tickets</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Ticket Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Submit New Ticket</h2>
              </div>

              {/* Added onSubmit to the form element */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title" // Added id for accessibility
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description" // Added id for accessibility
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Detailed description of the issue..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category" // Added id for accessibility
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option>Hardware</option>
                      <option>Software</option>
                      <option>Network</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority" // Added id for accessibility
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Ticket"}
                </button>

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">{success}</p>
                  </div>
                )}
              </form> {/* Closing form tag added here */}
            </div>
          </div>

          {/* Tickets List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">My Tickets</h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {tickets.length}
                </span>
              </div>

              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No tickets yet</p>
                    <p className="text-gray-400 text-sm">Submit your first ticket to get started</p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{ticket.title}</h3>
                        <div className="flex space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">{ticket.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="bg-gray-100 px-3 py-1 rounded-lg">
                          {ticket.category}
                        </span>
                        <span>
                          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}