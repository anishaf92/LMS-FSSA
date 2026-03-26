import React, { useState } from "react";
import * as XLSX from "xlsx";

const initialStudents = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    batch: "2024",
    section: "A",
    courses: 3,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    batch: "2024",
    section: "B",
    courses: 2,
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    batch: "2023",
    section: "A",
    courses: 4,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    batch: "2023",
    section: "C",
    courses: 1,
    status: "Active",
  },
];

const emptyForm = {
  name: "",
  email: "",
  batch: "2024",
  section: "A",
  courses: "",
  status: "Active",
};

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-[450px] max-w-[95vw] shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-100 w-8 h-8 rounded-full"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

const FormRow = ({ label, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
};

export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [form, setForm] = useState(() => ({ ...emptyForm }));
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let added = 0;
      let skipped = 0;

      const newStudents = rows.map((row, index) => {
        const student = {
          id: Date.now() + index,
          name: row.name?.toString().trim(),
          email: row.email?.toString().trim(),
          batch: row.batch?.toString() || "2024",
          section: row.section?.toString() || "A",
          courses: Number(row.courses) || 0,
          status: row.status === "Inactive" ? "Inactive" : "Active",
        };

        // validation
        if (!student.name || !emailRegex.test(student.email)) {
          skipped++;
          return null;
        }

        added++;
        return student;
      });

      setStudents((prev) => [...prev, ...newStudents.filter(Boolean)]);

      alert(`${added} added, ${skipped} skipped`);
    };

    reader.readAsArrayBuffer(file);
  }

  function openAdd() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(student) {
    setForm({ ...student });
    setEditingId(student.id);
    setShowModal(true);
  }

  function saveStudent() {
    if (!form.name.trim() || !form.email.trim()) {
      return alert("Name & Email required");
    }

    if (editingId) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)),
      );
    } else {
      setStudents((prev) => [
        ...prev,
        {
          ...form,
          id: Date.now(),
          courses: Number(form.courses),
        },
      ]);
    }

    setShowModal(false);
    setForm({ ...emptyForm });
    setEditingId(null);
  }

  function confirmDelete() {
    setStudents((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Students</h1>

          <div className="flex gap-3">
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Bulk Upload
            </button>

            <input
              id="fileInput"
              type="file"
              accept=".xlsx, .xls"
              hidden
              onChange={handleFileUpload}
            />

            <button
              onClick={openAdd}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              + Add Student
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          placeholder="Search..."
          className="mb-4 w-64 px-3 py-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3">Batch</th>
                <th className="p-3">Section</th>
                <th className="p-3">Courses</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3 text-gray-600">{s.email}</td>
                  <td className="p-3 text-center">{s.batch}</td>
                  <td className="p-3 text-center">{s.section}</td>
                  <td className="p-3 text-center">{s.courses}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        s.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  {/* ✅ UPDATED BUTTONS */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal (UNCHANGED) */}
      {showModal && (
        <Modal
          title={editingId ? "Edit Student" : "Add Student"}
          onClose={() => setShowModal(false)}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div className="col-span-2">
              <FormRow label="Full Name">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </FormRow>
            </div>

            <div className="col-span-2">
              <FormRow label="Email Address">
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </FormRow>
            </div>

            <FormRow label="Batch">
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form.batch}
                onChange={(e) =>
                  setForm((f) => ({ ...f, batch: e.target.value }))
                }
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </FormRow>

            <FormRow label="Section">
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form.section}
                onChange={(e) =>
                  setForm((f) => ({ ...f, section: e.target.value }))
                }
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </FormRow>

            <FormRow label="Courses Enrolled">
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form.courses}
                onChange={(e) =>
                  setForm((f) => ({ ...f, courses: e.target.value }))
                }
              />
            </FormRow>

            <FormRow label="Status">
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </FormRow>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={saveStudent}
            >
              {editingId ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </Modal>
      )}

      {/* ✅ UPDATED DELETE MODAL */}
      {deleteId && (
        <Modal title="Delete Student" onClose={() => setDeleteId(null)}>
          <div className="space-y-4">
            <p className="text-gray-600">
              This action cannot be undone. Are you sure you want to delete this
              student?
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
