import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
const fetchIssues = async () => {
      const token=localStorage.getItem("token")
    try {
      const res = await axios.get("http://localhost:3000/admin/issues", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssues(res.data.issues);
    } catch (err) {
      console.error("Error fetching issues:", err);
      alert("Failed to load issues");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIssues();
  }, []);

  

  // const assignIssue = async (id) => {
  //   try {
  //     await axios.put(`http://localhost:3000/api/admin/assign/${id}`, {}, { withCredentials: true });
  //     alert("Issue assigned!");
  //     fetchIssues();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const markSolved = async (id) => {
  //   try {
  //     await axios.put(`http://localhost:3000/api/admin/solve/${id}`, {}, { withCredentials: true });
  //     alert("Marked as solved!");
  //     fetchIssues();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const filteredIssues = issues.filter((issue) => {
    if (activeTab === "assigned") return issue.status === "assigned";
    if (activeTab === "solved") return issue.status === "solved";
    if (activeTab === "unassigned") return issue.status === "pending";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["all", "unassigned", "assigned", "solved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white border text-blue-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Issues
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="grid gap-4">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div onClick={()=>console.log(issue)}>
                <h3 className="text-lg font-semibold">{issue.title}</h3>
                <p className="text-gray-600">{issue.description}</p>
                <p className="text-sm text-gray-500">
                  {issue.category} | {issue.date} | {issue.location?.coordinates.join(", ")}
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  Status: {issue.status || "pending"}
                </p>
              </div>

              {/* <div className="flex gap-2">
                {issue.status === "pending" && (
                  <button
                    onClick={() => assignIssue(issue._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Assign
                  </button>
                )}
                {issue.status === "assigned" && (
                  <button
                    onClick={() => markSolved(issue._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                  >
                    Mark Solved
                  </button>
                )}
              </div> */}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No issues found</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
