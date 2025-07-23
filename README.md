# 🛠️ FixMate – AI-Powered IT Support Ticket System

FixMate is an intelligent IT support ticket management system designed for organizations, colleges, and companies to streamline the way users report issues and staff/admins resolve them.

Built using the latest technologies like **Next.js App Router**, **MongoDB Atlas**, and **JWT-based auth**, FixMate empowers users with an intuitive interface and powerful collaboration tools — including **per-ticket real-time chat**, **role-based dashboards**, and **WhatsApp notifications**.

> ⚡ Project by Ravi Kumar & Team – Cyber Hackathon 2025 Finalist (Problem Statement 5)

---

## 🚀 Features

### ✅ Ticket Management
- Create, view, and track support tickets
- Assign priorities: Low, Medium, High, Urgent
- Add categories: Hardware, Software, Network, etc.

### 👥 Role-Based Dashboards
- **User Dashboard**: Create & view tickets, chat with staff
- **Staff Dashboard**: View assigned tickets, mark progress, chat
- **Admin Dashboard**: View all tickets, assign staff, trace logs

### 💬 Real-Time Ticket Chat
- Chatbox visible on each ticket
- Staff, user, and admin can communicate on the same ticket
- Floating chat window integrated per ticket (like WhatsApp)

### 📲 WhatsApp Notifications
- Notify staff when a ticket is assigned
- Notify users when a ticket is resolved or updated

### 📈 Trace Logging
- Logs IP, device info, and timestamp when ticket is accessed
- Helps trace suspicious activity

### 🔐 Secure Auth
- JWT-based authentication
- Middleware-protected routes based on roles

---

## 🧱 Tech Stack

| Frontend        | Backend         | Database        | Auth     |
|----------------|-----------------|----------------|----------|
| Next.js App Router | API Routes (Next.js) | MongoDB Atlas | JWT     |

+ Tailwind CSS, ShadCN UI, Lucide React icons  
+ WhatsApp prefilled message sharing  
+ AI Chatbot (planned), Vercel Deployment Ready

---


---

## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/fixmate.git
cd fixmate

# Install dependencies
npm install

# Create env file
cp .env.example .env.local
