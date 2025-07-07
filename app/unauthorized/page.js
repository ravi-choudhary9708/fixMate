"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
        <p className="text-gray-600 mb-6">
          You are not authorized to access this page.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          🔐 Go to Login
        </button>
      </div>
    </div>
  );
}
