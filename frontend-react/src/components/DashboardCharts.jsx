import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const DashboardCharts = ({ jobs, interviews }) => {
  // ================= STATUS COUNTS =================
  const applied = jobs.filter((j) => j.Status === "Applied").length;
  const interviewing = jobs.filter((j) => j.Status === "Interviewing").length;
  const offer = jobs.filter((j) => j.Status === "Offer").length;
  const rejected = jobs.filter((j) => j.Status === "Rejected").length;

  // ================= PIE CHART =================
  const pieData = {
    labels: ["Applied", "Interviewing", "Offer", "Rejected"],
    datasets: [
      {
        data: [applied, interviewing, offer, rejected],
        backgroundColor: ["#3b82f6", "#facc15", "#22c55e", "#ef4444"],
      },
    ],
  };

  // ================= BAR CHART =================
  const barData = {
    labels: ["Applications", "Interviews"],
    datasets: [
      {
        label: "Count",
        data: [jobs.length, interviews.length],
        backgroundColor: ["#6366f1", "#14b8a6"],
      },
    ],
  };

  // ================= LINE CHART (Mock Trend) =================
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Applications",
        data: [
          Math.max(1, jobs.length - 8),
          Math.max(1, jobs.length - 6),
          Math.max(1, jobs.length - 3),
          jobs.length,
        ],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* PIE */}
      <div className="bg-white p-4 rounded-2xl shadow border">
        <h2 className="font-semibold mb-4">
          Application Status Breakdown
        </h2>
        <Pie data={pieData} />
      </div>

      {/* BAR */}
      <div className="bg-white p-4 rounded-2xl shadow border">
        <h2 className="font-semibold mb-4">
          Applications vs Interviews
        </h2>
        <Bar data={barData} />
      </div>

      {/* LINE */}
      <div className="bg-white p-4 rounded-2xl shadow border md:col-span-2">
        <h2 className="font-semibold mb-4">
          Application Trend (Monthly Simulation)
        </h2>
        <Line data={lineData} />
      </div>

    </div>
  );
};

export default DashboardCharts;