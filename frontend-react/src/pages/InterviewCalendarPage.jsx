import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import InterviewCalendar from "../components/InterviewCalendar";

const InterviewCalendarPage = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const res = await apiClient.get("/interviews");
      setInterviews(res.data);
    } catch (err) {
      console.error("Failed to load interviews", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Interview Calendar
        </h1>

        <p className="text-gray-500">
          Plan and track your interview schedule
        </p>
      </div>

      {/* CALENDAR COMPONENT */}
      <InterviewCalendar interviews={interviews} />

    </div>
  );
};

export default InterviewCalendarPage;