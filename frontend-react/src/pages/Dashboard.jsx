import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import DashboardCharts from "../components/DashboardCharts";
import InterviewTimeline from "../components/InterviewTimeline";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [appRes, interviewRes] = await Promise.all([
        apiClient.get("/applications"),
        apiClient.get("/interviews"),
      ]);

      setJobs(appRes.data);
      setInterviews(interviewRes.data);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    }
  };

  const count = (status) =>
    jobs.filter((j) => j.Status === status).length;

  // ================= STATUS STYLES =================
  const statusStyles = {
    Applied: "bg-blue-100 text-blue-700",
    Interviewing: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
    Offer: "bg-green-100 text-green-700",
  };

  // ================= STATS CARD =================
  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition border flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className={`text-3xl font-bold mt-1 ${color}`}>
          {value}
        </h2>
      </div>

      <div className="text-2xl opacity-70">{icon}</div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Track your application progress
        </p>
      </div>

      {/* STATS WIDGETS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          title="Total Applications"
          value={jobs.length}
          color="text-slate-800"
          icon="📄"
        />

        <StatCard
          title="Applied"
          value={count("Applied")}
          color="text-blue-600"
          icon="📌"
        />

        <StatCard
          title="Interviewing"
          value={count("Interviewing")}
          color="text-yellow-600"
          icon="🎤"
        />

        <StatCard
          title="Offers"
          value={count("Offer")}
          color="text-green-600"
          icon="🎉"
        />

        <StatCard
          title="Interviews"
          value={interviews.length}
          color="text-purple-600"
          icon="📅"
        />

      </div>

      {/* INTERVIEW TIMELINE SECTION */}
<InterviewTimeline interviews={interviews} />

      {/* RECENT APPLICATIONS */}
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
              className="p-4 flex justify-between items-center hover:bg-gray-50"
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
                  statusStyles[job.Status] ||
                  "bg-gray-100 text-gray-700"
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

      {/* CHARTS SECTION */}
<DashboardCharts jobs={jobs} interviews={interviews} />

      {/* INTERVIEWS PREVIEW (NEW SECTION)
      <div className="bg-white rounded-2xl shadow border">

        <div className="p-5 border-b">
          <h2 className="font-semibold text-lg">
            Upcoming Interviews
          </h2>
        </div>

        <div className="divide-y">

          {interviews.slice(0, 5).map((iv) => (
            <div
              key={iv.Id}
              className="p-4 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <h3 className="font-medium">
                  {iv.JobTitle}
                </h3>

                <p className="text-gray-500 text-sm">
                  {iv.RoundName} • {iv.Mode}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">
                  {new Date(iv.InterviewDate).toLocaleDateString()}
                </p>

                <span className="text-xs text-gray-500">
                  {iv.Status}
                </span>
              </div>
            </div>
          ))}

          {interviews.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No interviews scheduled.
            </div>
          )}

        </div>
      </div> */}

    </div>
  );
};

export default Dashboard;