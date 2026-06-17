import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await apiClient.get("/applications");
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    }
  };

  const count = (status) =>
    jobs.filter((j) => j.Status === status).length;

  const Card = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border">
      <p className="text-gray-500 text-sm">{title}</p>

      <h2 className={`text-4xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Track your application progress
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card
          title="Total Applications"
          value={jobs.length}
          color="text-slate-800"
        />

        <Card
          title="Applied"
          value={count("Applied")}
          color="text-blue-600"
        />

        <Card
          title="Interviewing"
          value={count("Interviewing")}
          color="text-yellow-600"
        />

        <Card
          title="Rejected"
          value={count("Rejected")}
          color="text-red-600"
        />

        <Card
          title="Offers"
          value={count("Offer")}
          color="text-green-600"
        />
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl shadow border">
        <div className="p-5 border-b">
          <h2 className="font-semibold text-lg">
            Recent Applications
          </h2>
        </div>

        <div className="divide-y">
          {jobs.slice(0, 5).map((job) => (
            <div
              key={job.Id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">
                  {job.JobTitle}
                </h3>

                <p className="text-gray-500 text-sm">
                  {job.CompanyName}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  job.Status === "Applied"
                    ? "bg-blue-100 text-blue-700"
                    : job.Status === "Interviewing"
                    ? "bg-yellow-100 text-yellow-700"
                    : job.Status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {job.Status}
              </span>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No applications found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;