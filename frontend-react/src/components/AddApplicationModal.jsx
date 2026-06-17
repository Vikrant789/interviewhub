import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

const AddApplicationModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const { user } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [newCompanyModal, setNewCompanyModal] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [companyErrors, setCompanyErrors] = useState({});

  const [form, setForm] = useState({
    UserId: user?.id || user?.Id,
    CompanyId: "",
    JobTitle: "",
    JobUrl: "",
    Status: "",
    Notes: "",
  });

  const [companyForm, setCompanyForm] = useState({
    Name: "",
    Website: "",
    Location: "",
  });

  // ================= LOAD COMPANIES =================
  useEffect(() => {
    if (isOpen) loadCompanies();
  }, [isOpen]);

  const loadCompanies = async () => {
    const res = await apiClient.get("/companies");
    setCompanies(res.data);
  };

  // ================= EDIT PREFILL =================
  useEffect(() => {
    if (editData) {
      setForm({
        UserId: user?.id || user?.Id,
        CompanyId: editData.CompanyId || "",
        JobTitle: editData.JobTitle || "",
        JobUrl: editData.JobUrl || "",
        Status: editData.Status || "",
        Notes: editData.Notes || "",
      });
    }
  }, [editData, user]);

  // ================= VALIDATION: APPLICATION =================
  const validateForm = () => {
    let err = {};

    // Company
    if (!form.CompanyId?.trim()) {
      err.CompanyId = "Company is required";
    }

    // Job Title
    if (!form.JobTitle?.trim()) {
      err.JobTitle = "Job title is required";
    } else {
      const t = form.JobTitle.trim();
      if (t.length < 3) err.JobTitle = "Min 3 characters required";
      if (t.length > 80) err.JobTitle = "Max 80 characters allowed";
    }

    // Job URL
    if (form.JobUrl?.trim()) {
      try {
        new URL(form.JobUrl.trim());
      } catch {
        err.JobUrl = "Invalid URL";
      }
    }

    // Status
    if (!form.Status?.trim()) {
      err.Status = "Status is required";
    }

    // Notes
    // ================= NOTES (STRICT VALIDATION) =================
    if (!form.Notes || !form.Notes.trim()) {
      err.Notes = "Notes are required";
    } else {
      const notes = form.Notes.trim();

      // max length
      if (notes.length > 300) {
        err.Notes = "Notes cannot exceed 300 characters";
      }

      // min meaningful content check
      const meaningfulText = notes.replace(/[^a-zA-Z0-9]/g, "");

      if (meaningfulText.length < 5) {
        err.Notes = "Please enter meaningful notes (not symbols/spaces)";
      }

      // prevent only numbers (optional but useful)
      if (/^[0-9\s]+$/.test(notes)) {
        err.Notes = "Notes cannot contain only numbers";
      }
    }

    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= VALIDATION: COMPANY =================
  const validateCompany = () => {
    let err = {};

    const name = companyForm.Name?.trim();
    const website = companyForm.Website?.trim();
    const location = companyForm.Location?.trim();

    // ================= NAME =================
    if (!name) {
      err.Name = "Company name is required";
    } else if (name.length < 2) {
      err.Name = "Minimum 2 characters required";
    } else if (name.length > 60) {
      err.Name = "Maximum 60 characters allowed";
    }

    // ================= WEBSITE =================
    if (!website) {
      err.Website = "Website is required";
    }
    if (website) {
      try {
        const url = new URL(website);

        if (!["http:", "https:"].includes(url.protocol)) {
          err.Website = "Use http or https";
        }

        if (!url.hostname.includes(".")) {
          err.Website = "Enter valid domain (example.com)";
        }

      } catch {
        err.Website = "Enter valid website URL";
      }
    }

    // ================= LOCATION =================
    if (!location) {
      err.Location = "Location is required";
    }
    if (location) {
      if (location.length < 2) {
        err.Location = "Too short";
      }

      if (location.length > 100) {
        err.Location = "Max 100 characters allowed";
      }

      if (!/[a-zA-Z]/.test(location)) {
        err.Location = "Enter valid location";
      }
    }

    setCompanyErrors(err);

    // IMPORTANT DEBUG LINE
    console.log("VALIDATION ERRORS:", err);

    return Object.keys(err).length === 0;
  };

  // ================= SUBMIT APPLICATION =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editData) {
        await apiClient.put(`/applications/${editData.Id}`, form);
      } else {
        await apiClient.post("/applications", form);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CREATE COMPANY =================
  const handleCreateCompany = async () => {
    if (!validateCompany()) return;

    try {
      const res = await apiClient.post("/companies", companyForm);

      await loadCompanies();

      setForm((prev) => ({
        ...prev,
        CompanyId: res.data.Id,
      }));

      setCompanyForm({ Name: "", Website: "", Location: "" });
      setNewCompanyModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-[520px] relative">

          <button onClick={onClose} className="absolute right-3 top-3">
            ✕
          </button>

          <h2 className="text-lg font-bold mb-4">
            {editData ? "Edit Application" : "Add Application"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* COMPANY */}
            <div>
              <select
                className="w-full border p-2 rounded"
                value={form.CompanyId}
                onChange={(e) => {
                  const companyId = e.target.value;

                  const selectedCompany = companies.find(
                    (c) => c.Id === companyId
                  );

                  setForm((prev) => ({
                    ...prev,
                    CompanyId: companyId,
                    JobUrl: selectedCompany?.Website || "",
                  }));

                  setFormErrors((p) => ({ ...p, CompanyId: "" }));
                }}
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.Id} value={c.Id}>
                    {c.Name}
                  </option>
                ))}

              </select>

              {formErrors.CompanyId && (
                <p className="text-red-500 text-xs">{formErrors.CompanyId}</p>
              )}

              {/* MOVE BUTTON UNDER DROPDOWN */}
              <button
                type="button"
                className="text-blue-600 text-sm mt-1 hover:underline"
                onClick={() => setNewCompanyModal(true)}
              >
                + Add New Company
              </button>
            </div>
            {/* JOB TITLE */}
            <input
              className="w-full border p-2 rounded"
              placeholder="Job Title"
              value={form.JobTitle}
              onChange={(e) =>
                setForm({ ...form, JobTitle: e.target.value })
              }
            />
            {formErrors.JobTitle && <p className="text-red-500 text-xs">{formErrors.JobTitle}</p>}

            {/* JOB URL */}
           {/* JOB URL */}
<div>
  <input
    className="w-full border p-2 rounded"
    placeholder="Job URL"
    value={form.JobUrl}
    onChange={(e) =>
      setForm({ ...form, JobUrl: e.target.value })
    }
  />

  {/* Small Open Link */}
  {form.JobUrl && (
    <div className="flex justify-end mt-1">
      <a
        href={form.JobUrl}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-blue-600 hover:underline"
      >
        Open link ↗
      </a>
    </div>
  )}

  {formErrors.JobUrl && (
    <p className="text-red-500 text-xs mt-1">
      {formErrors.JobUrl}
    </p>
  )}
</div>

            {/* STATUS */}
            <select
              className="w-full border p-2 rounded"
              value={form.Status}
              onChange={(e) =>
                setForm({ ...form, Status: e.target.value })
              }
            >
              <option value="">Select Status</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            {formErrors.Status && <p className="text-red-500 text-xs">{formErrors.Status}</p>}

            {/* NOTES */}
            <div>
              <textarea
                className="w-full border p-2 rounded"
                placeholder="Notes"
                value={form.Notes}
                onChange={(e) => {
                  const value = e.target.value;

                  // optional: hard limit typing at 300 chars
                  if (value.length <= 300) {
                    setForm({ ...form, Notes: value });

                    // clear error while typing
                    setFormErrors((prev) => ({ ...prev, Notes: "" }));
                  }
                }}
              />

              {/* Character Counter */}
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>
                  {form.Notes?.length || 0} / 300
                </span>

                {form.Notes?.length > 250 && (
                  <span className="text-orange-500">
                    Approaching limit
                  </span>
                )}
              </div>

              {/* Error Message */}
              {formErrors.Notes && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.Notes}
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <button className="w-full bg-blue-600 text-white py-2 rounded">
              {editData ? "Update" : "Save"}
            </button>
          </form>
        </div>
      </div>

      {/* COMPANY MODAL */}
      {newCompanyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div
            className="bg-white p-5 rounded w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Add Company</h2>

            {/* NAME */}
            <input
              placeholder="Name"
              className="w-full border p-2 mb-1 rounded"
              value={companyForm.Name}
              onChange={(e) =>
                setCompanyForm({ ...companyForm, Name: e.target.value })
              }
            />
            {companyErrors.Name && (
              <p className="text-red-500 text-xs">{companyErrors.Name}</p>
            )}

            {/* WEBSITE */}
            <input
              placeholder="Website"
              className="w-full border p-2 mb-1 rounded"
              value={companyForm.Website}
              onChange={(e) =>
                setCompanyForm({ ...companyForm, Website: e.target.value })
              }
            />
            {companyErrors.Website && (
              <p className="text-red-500 text-xs">{companyErrors.Website}</p>
            )}

            {/* LOCATION */}
            <input
              placeholder="Location"
              className="w-full border p-2 mb-3 rounded"
              value={companyForm.Location}
              onChange={(e) =>
                setCompanyForm({ ...companyForm, Location: e.target.value })
              }
            />
            {companyErrors.Location && (
              <p className="text-red-500 text-xs">{companyErrors.Location}</p>
            )}

            {/* BUTTONS ROW */}
            <div className="flex gap-2">
              {/* SAVE */}
              <button
                onClick={() => {
                  const ok = validateCompany();
                  if (!ok) return;

                  handleCreateCompany();
                }}
                className="bg-blue-600 text-white w-full py-2 rounded"
              >
                Save Company
              </button>

              {/* CANCEL */}
              <button
                type="button"
                onClick={() => {
                  setNewCompanyModal(false);
                  setCompanyForm({ Name: "", Website: "", Location: "" });
                  setCompanyErrors({});
                }}
                className="border w-full py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddApplicationModal;