import { useEffect, useMemo, useState } from "react";

const InterviewCalendar = ({ interviews = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // Auto-select today
    useEffect(() => {
        const today = new Date();

        if (
            today.getMonth() === month &&
            today.getFullYear() === year
        ) {
            setSelectedDay(today.getDate());
        } else {
            setSelectedDay(null);
        }
    }, [month, year]);

    const calendarDays = useMemo(() => {
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            days.push(d);
        }

        return days;
    }, [startDay, daysInMonth]);

    const getInterviewsForDay = (day) => {
        if (!day) return [];

        return interviews.filter((interview) => {
            const interviewDate = new Date(interview.InterviewDate);

            return (
                interviewDate.getDate() === day &&
                interviewDate.getMonth() === month &&
                interviewDate.getFullYear() === year
            );
        });
    };

    const selectedDayInterviews = selectedDay
        ? getInterviewsForDay(selectedDay)
        : [];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Scheduled":
                return "bg-blue-500";
            case "Completed":
                return "bg-green-500";
            case "Cancelled":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">

            {/* CALENDAR */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow border p-5">

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold">
                        Interview Calendar
                    </h2>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={prevMonth}
                            className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                            ◀
                        </button>

                        <span className="font-medium min-w-[160px] text-center">
                            {monthNames[month]} {year}
                        </span>

                        <button
                            onClick={nextMonth}
                            className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                            ▶
                        </button>
                    </div>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                            <div
                                key={day}
                                className="text-center text-sm font-medium text-gray-500"
                            >
                                {day}
                            </div>
                        )
                    )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => {
                        const dayInterviews = getInterviewsForDay(day);

                        return (
                            <div
                                key={index}
                                onClick={() => day && setSelectedDay(day)}
                                className={`min-h-[120px] border rounded-lg p-2 cursor-pointer transition
                  ${selectedDay === day
                                        ? "border-blue-500 bg-blue-50"
                                        : "bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                {day && (
                                    <>
                                        <div className="font-semibold text-sm mb-1">
                                            {day}
                                        </div>

                                        <div className="space-y-1">
                                            {dayInterviews.slice(0, 2).map((item) => (
                                                <div>
                                                    <div
                                                        key={item.Id}
                                                        className={`text-[10px] px-2 py-1 rounded text-white truncate ${getStatusColor(
                                                            item.Status
                                                        )}`}
                                                    >
                                                        {item.JobTitle}

                                                    </div>
                                                    <div
                                                    className={`text-[10px] px-2 py-1 rounded text-black truncate `}
                                                    >
                                                        {new Date(item.InterviewDate).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}</div>
                                                </div>
                                            ))}

                                            {dayInterviews.length > 2 && (
                                                <div className="text-[10px] text-gray-500">
                                                    +{dayInterviews.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* DETAILS PANEL */}
            <div className="bg-white rounded-2xl shadow border p-5">

                <h2 className="text-xl font-semibold mb-4">
                    Interview Details
                </h2>

                {!selectedDay && (
                    <p className="text-gray-500">
                        Select a date to view interviews.
                    </p>
                )}

                {selectedDay && (
                    <>
                        <div className="border-b pb-4 mb-4">
                            <h3 className="font-bold text-lg">
                                {selectedDay} {monthNames[month]} {year}
                            </h3>

                            <p className="text-sm text-gray-500">
                                {selectedDayInterviews.length} Interview(s)
                            </p>
                        </div>

                        <div className="space-y-4">

                            {selectedDayInterviews.length === 0 && (
                                <div className="text-gray-500">
                                    No interviews scheduled.
                                </div>
                            )}

                            {selectedDayInterviews.map((item) => (
                                <div
                                    key={item.Id}
                                    className="border rounded-xl p-4 hover:shadow-sm transition"
                                >
                                    <h4 className="font-semibold text-lg">
                                        {item.JobTitle}
                                    </h4>

                                    <p className="text-gray-500 text-sm mb-3">
                                        {item.RoundName}
                                    </p>

                                    <div className="space-y-2 text-sm">

                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {new Date(
                                                item.InterviewDate
                                            ).toLocaleString()}
                                        </p>

                                        <p>
                                            <strong>Mode:</strong>{" "}
                                            {item.Mode}
                                        </p>

                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span
                                                className={`text-white text-xs px-2 py-1 rounded ml-1 ${getStatusColor(
                                                    item.Status
                                                )}`}
                                            >
                                                {item.Status}
                                            </span>
                                        </p>

                                        <p>
                                            <strong>Rating:</strong>{" "}
                                            {item.Rating ?? "Not Rated"}
                                        </p>

                                        <p>
                                            <strong>Feedback:</strong>{" "}
                                            {item.Feedback || "No feedback"}
                                        </p>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InterviewCalendar;