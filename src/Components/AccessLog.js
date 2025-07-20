// src/Components/User/AccessLog.js
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AccessLog() {
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // Redirect if no token
      return;
    }
    AOS.init({ duration: 1200, once: false });
  }, []);

  const logs = [
    {
      id: 1,
      document: "Aadhaar Card",
      time: "2025-06-26 14:30",
      accessedBy: "Gov Agency X",
      location: "Delhi, India",
      notes: "Verified identity for eKYC",
    },
    {
      id: 2,
      document: "PAN Card",
      time: "2025-06-25 10:15",
      accessedBy: "Bank Y",
      location: "Mumbai, India",
      notes: "Account opening",
    },
    {
      id: 3,
      document: "Passport",
      time: "2025-06-20 18:45",
      accessedBy: "Travel Portal Z",
      location: "Online",
      notes: "Visa application",
    },
  ];

  const handleRowClick = (log) => {
    if (window.innerWidth < 768) {
      setSelectedLog(log);
    }
  };

  const closeModal = () => setSelectedLog(null);

  return (
    <div className="pt-20 relative min-h-screen px-6 py-8 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-black text-foreground dark:text-white transition-colors duration-300">
      <div className="relative z-10 bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-sky-400">
          Access Logs
        </h2>

        <div className="overflow-x-auto hide-scrollbar">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800 text-left">
                <th className="p-4">Sr. No.</th>
                <th className="p-4">Document</th>
                <th className="p-4">Access Time</th>
                <th className="p-4">Accessed By</th>
                <th className="p-4">Location</th>
                <th className="p-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={log.id}
                  onClick={() => handleRowClick(log)}
                  className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{log.document}</td>
                  <td className="p-4">{log.time}</td>
                  <td className="p-4">{log.accessedBy}</td>
                  <td className="p-4">{log.location}</td>
                  <td className="p-4">{log.notes}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No logs available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal: Dimmed background only */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-xl p-6 text-gray-900 dark:text-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-700 dark:text-sky-400">
              Access Log Details
            </h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Document:</strong> {selectedLog.document}</li>
              <li><strong>Time:</strong> {selectedLog.time}</li>
              <li><strong>Accessed By:</strong> {selectedLog.accessedBy}</li>
              <li><strong>Location:</strong> {selectedLog.location}</li>
              <li><strong>Notes:</strong> {selectedLog.notes}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}