import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const token = localStorage.getItem("token");
  const [departments, setDepartments] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
const [selectedIssue, setSelectedIssue] = useState(null);
const [selectedDept, setSelectedDept] = useState("");


  const fetchIssues = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/issues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(res.data.issues);
    } catch (err) {
      console.error("Error fetching issues:", err);
      alert("Failed to load issues");
    }
  };

  const fetchDepartments = async () => {
  const res = await axios.get("http://localhost:3000/admin/departments", {
    headers: { Authorization: `Bearer ${token}` }
  });
  setDepartments(res.data.departments);
};

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIssues();
    fetchDepartments();
  }, []);

  // Assign issue to a department manually
  const assignIssue = async (id, departmentId) => {
  try {
    await axios.put(
      `http://localhost:3000/admin/assign/${id}`,
      { departmentId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Issue assigned successfully!");
    fetchIssues();
    setShowAssignModal(false);
  } catch (err) {
    console.error("Assign error:", err);
    alert("Failed to assign issue");
  }
};



  // Mark issue as resolved
  const markSolved = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/solve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Issue marked as resolved!");
      fetchIssues();
    } catch (err) {
      console.error("Solve error:", err);
      alert("Failed to mark resolved");
    }
  };

  const openAssignModal = (issue) => {
  setSelectedIssue(issue);
  setShowAssignModal(true);
};


  const filteredIssues = issues.filter((issue) => {
    if (activeTab === "assigned") return issue.status === "assigned";
    if (activeTab === "resolved") return issue.status === "resolved";
    if (activeTab === "unassigned") return issue.status === "pending";
    return true;
  });

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>

    {/* Tabs */}
    <div className="flex gap-4 mb-6">
      {["all", "unassigned", "assigned", "resolved"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-xl font-semibold shadow-sm transition-all ${
            activeTab === tab
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border border-blue-300 text-blue-600 hover:bg-blue-50"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)} Issues
        </button>
      ))}
    </div>

    {/* Issues */}
    <div className="grid gap-4">
      {filteredIssues.length > 0 ? (
        filteredIssues.map((issue) => (
          <div
            key={issue._id}
            className="bg-white shadow-md rounded-lg p-5 flex justify-between items-start border-l-4 
            border-blue-500 hover:shadow-lg transition-all"
          >
            {/* Left Section */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {issue.title}
              </h3>

              <p className="text-gray-600">{issue.description}</p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-semibold text-gray-700">
                    Category:
                  </span>{" "}
                  {issue.category}
                </p>

                <p>
                  <span className="font-semibold text-gray-700">Date:</span>{" "}
                  {issue.date}
                </p>

                <p className="font-medium text-blue-600">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-md text-white ${
                      issue.status === "assigned"
                        ? "bg-yellow-600"
                        : issue.status === "resolved"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {issue.status || "pending"}
                  </span>
                </p>

                {issue.assignedDepartment && (
                  <p className="text-sm text-green-700 font-semibold">
                    Assigned Dept: {issue.assignedDepartment.name}
                  </p>
                )}
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-col gap-2">
              {activeTab === "unassigned" && (
  <button
    onClick={() => openAssignModal(issue)}
    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
  >
    Assign
  </button>
)}

              {issue.status === "assigned" && (
                <button
                  onClick={() => markSolved(issue._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                  Mark Solved
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No issues found</p>
      )}
    </div>

    {showAssignModal && (
  <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-xl shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Assign Department</h2>

      {/* Department Select */}
      <select
        className="w-full border p-2 rounded-lg"
        value={selectedDept}
        onChange={(e) => setSelectedDept(e.target.value)}
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept._id} value={dept._id}>
            {dept.name}
          </option>
        ))}
      </select>

      {/* Buttons */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setShowAssignModal(false)}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => assignIssue(selectedIssue._id, selectedDept)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Assign
        </button>
      </div>
    </div>
  </div>
)}

  </div>

  
);

}

export default Dashboard;
