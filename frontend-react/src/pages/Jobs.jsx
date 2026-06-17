import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

import AddApplicationModal from "../components/AddApplicationModal";


import {
  DndContext,
  PointerSensor,
  useSensor,
  useDroppable,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const columns = ["Applied", "Interviewing", "Offer", "Rejected"];

const statusStyles = {
  Applied: "bg-blue-100 text-blue-700",
  Interviewing: "bg-yellow-100 text-yellow-800",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const Jobs = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const res = await apiClient.get("/applications");
    setApplications(res.data);
  };

  const updateStatus = async (id, status) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.Id === id ? { ...a, Status: status } : a
      )
    );

    try {
      await apiClient.put(`/applications/${id}`, { Status: status });
    } catch (err) {
      console.error(err);
      loadApplications();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

const handleDragEnd = (event) => {
  const { active, over } = event;

  if (!over) return;

  const jobId = active.id;

  // over.id may be card OR column → we normalize it
  let newStatus = over.id;

  // if dropped on card, find its column
  const overJob = applications.find((a) => a.Id === over.id);
  if (overJob) {
    newStatus = overJob.Status;
  }

  const job = applications.find((a) => a.Id === jobId);
  if (!job) return;

  if (job.Status !== newStatus) {
    updateStatus(jobId, newStatus);
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Job Pipeline
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Application
        </button>
      </div>

      {/* KANBAN */}
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
        <div className="grid grid-cols-4 gap-5">

          {columns.map((status) => (
            <Column
              key={status}
              status={status}
              items={applications.filter(
                (a) => a.Status === status
              )}
            />
          ))}

        </div>
      </DndContext>

      {/* MODAL */}
      <AddApplicationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadApplications}
      />
    </div>
  );
};

export default Jobs;

//
// ================= COLUMN =================
//
const Column = ({ status, items }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-2xl p-4 border min-h-[520px]
        transition-all duration-200
        ${isOver ? "bg-blue-50 border-blue-400" : "bg-white"}
      `}
    >
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">{status}</h2>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
          {items.length}
        </span>
      </div>

      <SortableContext
        items={items.map((i) => i.Id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((job) => (
            <JobCard key={job.Id} job={job} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

//
// ================= CARD =================
//
const JobCard = ({ job }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.Id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white border rounded-xl p-4 shadow-sm
        cursor-grab active:cursor-grabbing
        hover:shadow-lg hover:-translate-y-1
        transition-all duration-200
        ${isDragging ? "scale-105 opacity-80 shadow-xl" : ""}
      `}
    >
      <div className="font-semibold text-gray-800">
        {job.JobTitle}
      </div>

      <div className="text-sm text-gray-500">
        {job.CompanyName}
      </div>

      <div className="mt-2 text-xs">
        <span
          className={`px-2 py-1 rounded-full ${
            statusStyles[job.Status]
          }`}
        >
          {job.Status}
        </span>
      </div>

      <div className="flex justify-between mt-3">
        <a
          href={job.JobUrl}
          target="_blank"
          className="text-blue-600 text-xs hover:underline"
        >
          View →
        </a>

        <span className="text-[10px] text-gray-400">
          {new Date(job.AppliedDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};