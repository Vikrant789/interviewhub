import { useMemo } from "react";

const InterviewTimeline = ({ interviews = [] }) => {
  // Sort interviews by date (important for timeline)
  const sorted = useMemo(() => {
    return [...interviews].sort(
      (a, b) => new Date(a.InterviewDate) - new Date(b.InterviewDate)
    );
  }, [interviews]);

  const statusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow border p-5">

      {/* HEADER */}
      <h2 className="text-lg font-semibold mb-6">
        Interview Timeline
      </h2>

      {/* EMPTY STATE */}
      {sorted.length === 0 && (
        <p className="text-gray-500 text-sm">
          No interviews scheduled yet.
        </p>
      )}

      {/* TIMELINE */}
      <div className="relative">

        {/* vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-gray-200"></div>

        <div className="space-y-6">

          {sorted.map((item, index) => (
            <div key={item.Id} className="flex gap-4 relative">

              {/* DOT */}
              <div
                className={`w-6 h-6 rounded-full z-10 ${statusColor(
                  item.Status
                )} flex items-center justify-center text-white text-xs`}
              >
                {index + 1}
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-medium">
                      {item.JobTitle}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.RoundName} • {item.Mode}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {new Date(item.InterviewDate).toLocaleDateString()}
                    </p>

                    <span className="text-xs text-gray-500">
                      {item.Status}
                    </span>
                  </div>

                </div>

                {/* optional feedback */}
                {item.Feedback && (
                  <p className="text-xs text-gray-600 mt-1">
                    💬 {item.Feedback}
                  </p>
                )}
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default InterviewTimeline;