import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── API BASE ────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000";

const api = {
  get: (path) =>
    fetch(`${API_BASE}${path}`).then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }),
  post: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }),
  patch: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }),
  delete: (path) =>
    fetch(`${API_BASE}${path}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }),
};

// ─── Placeholder gradient covers when no image uploaded ─────────────────────
const GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-cyan-600",
  "from-emerald-500 to-green-600",
  "from-sky-500 to-blue-600",
];

const pickGradient = (id) => GRADIENTS[id % GRADIENTS.length];

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 4, className = "" }) => (
  <svg
    className={`w-${size} h-${size} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const IC = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  plus: "M12 4v16m8-8H4",
  edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  eyeOff:
    "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
  image:
    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  close: "M6 18L18 6M6 6l12 12",
  book: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  arrow: "M13 7l5 5m0 0l-5 5m5-5H6",
  warn: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  check: "M5 13l4 4L19 7",
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const bg = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl ${bg}`}
    >
      <Icon d={type === "error" ? IC.warn : IC.check} size={4} />
      {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <Icon d={IC.close} size={3} />
      </button>
    </div>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({
  course,
  index,
  onEdit,
  onDelete,
  onToggleVisible,
  onOpen,
}) {
  const [imgError, setImgError] = useState(false);
  const gradient = pickGradient(index);
  const hasImage = course.image_url && !imgError;

  return (
    <div
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col
        ${!course.is_visible ? "opacity-60 grayscale" : ""}`}
    >
      {/* ── Cover Image ── */}
      <div
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={() => onOpen(course)}
      >
        {hasImage ? (
          <img
            src={course.image_url}
            alt={course.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
          >
            <Icon d={IC.book} size={14} className="text-white/30" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
              Open Course <Icon d={IC.arrow} size={3} />
            </span>
          </div>
        </div>

        {/* Hidden badge */}
        {!course.is_visible && (
          <div className="absolute top-3 left-3 bg-gray-800/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Icon d={IC.eyeOff} size={3} /> Hidden
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          onClick={() => onOpen(course)}
          className="font-bold text-gray-900 text-lg leading-snug mb-1.5 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-1"
        >
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {course.description || "No description provided."}
        </p>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          {/* Visibility toggle */}
          <button
            onClick={() => onToggleVisible(course)}
            title={course.is_visible ? "Hide course" : "Show course"}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all
              ${
                course.is_visible
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <Icon d={course.is_visible ? IC.eye : IC.eyeOff} size={3} />
            {course.is_visible ? "Visible" : "Hidden"}
          </button>

          <div className="flex-1" />

          {/* Edit */}
          <button
            onClick={() => onEdit(course)}
            title="Edit course"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all"
          >
            <Icon d={IC.edit} size={3} /> Edit
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(course)}
            title="Delete course"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
          >
            <Icon d={IC.trash} size={3} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function CourseModal({ mode, initial, onSave, onClose, saving }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    image_url: initial?.image_url || "",
  });
  const [preview, setPreview] = useState(initial?.image_url || null);
  const [imageFile, setImageFile] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setForm((f) => ({ ...f, image_url: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSave({ ...form, _imageFile: imageFile, _previewBase64: preview });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: "fadeInUp 0.2s ease both" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-xl">
              {mode === "add" ? "Add New Course" : "Edit Course"}
            </h2>
            <p className="text-indigo-200 text-xs mt-0.5">
              {mode === "add"
                ? "Fill in the course details below"
                : "Update course information"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-xl hover:bg-white/10"
          >
            <Icon d={IC.close} size={5} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Cover Image
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="relative h-44 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-colors cursor-pointer group bg-gray-50"
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full transition-all">
                      Change Image
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <Icon d={IC.image} size={10} />
                  <span className="text-sm font-medium">
                    Click or drag image here
                  </span>
                  <span className="text-xs">PNG, JPG, WebP</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />

            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                or paste URL
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => {
                setForm({ ...form, image_url: e.target.value });
                setPreview(e.target.value || null);
                setImageFile(null);
              }}
              placeholder="https://example.com/cover.jpg"
              className="mt-2 w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-600 placeholder-gray-300"
            />
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Course Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. JavaScript Mastery"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800 placeholder-gray-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What will students learn in this course?"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800 placeholder-gray-300 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !form.title.trim()}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
            >
              {saving ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <Icon d={mode === "add" ? IC.plus : IC.check} size={4} />
              )}
              {saving
                ? "Saving..."
                : mode === "add"
                  ? "Create Course"
                  : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirm({ course, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full"
        style={{ animation: "fadeInUp 0.2s ease both" }}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <Icon d={IC.trash} size={6} className="text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Delete Course?</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">
              "{course.title}"
            </span>{" "}
            and all its content will be permanently deleted.
          </p>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-5/6" />
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <div className="h-8 bg-gray-100 rounded-xl w-24" />
          <div className="flex-1" />
          <div className="h-8 bg-gray-100 rounded-xl w-16" />
          <div className="h-8 bg-gray-100 rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCourseManagement() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // { mode: "add"|"edit", course? }
  const [delModal, setDelModal] = useState(null); // course to delete
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Fetch all courses on mount ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // GET /courses → [{ id, title, description, image_url, is_visible }]
        const data = await api.get("/courses");
        setCourses(data);
      } catch {
        showToast("Failed to load courses. Check backend connection.", "error");
        // Demo fallback so UI is usable offline during development
        setCourses([
          {
            id: 1,
            title: "Python",
            description: "Learn Python from scratch.",
            image_url: "",
            is_visible: true,
          },
          {
            id: 2,
            title: "JavaScript",
            description: "Master modern JavaScript.",
            image_url: "",
            is_visible: true,
          },
          {
            id: 3,
            title: "React",
            description: "Build UIs with React.",
            image_url: "",
            is_visible: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Filtered list ──
  const filtered = courses.filter((c) => {
    const q = search.trim().toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
  });

  // ── Create ──
  const handleCreate = async (formData) => {
    setSaving(true);
    try {
      // POST /courses  body: { title, description, image_url, is_visible }
      // If file was uploaded, send base64 as image_url (or handle multipart separately)
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image_url: formData._previewBase64 || formData.image_url || "",
        is_visible: true,
      };
      const created = await api.post("/courses", payload);
      setCourses((p) => [...p, created]);
      showToast("Course created successfully!");
      setModal(null);
    } catch {
      showToast("Failed to create course.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Update ──
  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      // PATCH /courses/{id}  body: { title, description, image_url }
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image_url: formData._previewBase64 || formData.image_url || "",
      };
      const updated = await api.patch(`/courses/${modal.course.id}`, payload);
      setCourses((p) => p.map((c) => (c.id === updated.id ? updated : c)));
      showToast("Course updated!");
      setModal(null);
    } catch {
      showToast("Failed to update course.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle visibility ──
  const handleToggleVisible = async (course) => {
    try {
      // PATCH /courses/{id}  body: { is_visible: bool }
      const updated = await api.patch(`/courses/${course.id}`, {
        is_visible: !course.is_visible,
      });
      setCourses((p) => p.map((c) => (c.id === updated.id ? updated : c)));
      showToast(
        updated.is_visible
          ? "Course is now visible."
          : "Course hidden from students.",
      );
    } catch {
      showToast("Failed to update visibility.", "error");
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    try {
      // DELETE /courses/{id}
      await api.delete(`/courses/${delModal.id}`);
      setCourses((p) => p.filter((c) => c.id !== delModal.id));
      showToast("Course deleted.");
      setDelModal(null);
    } catch {
      showToast("Failed to delete course.", "error");
    }
  };

  // ── Open course → navigate to CourseTopicsPage ──
  const handleOpen = (course) => {
    navigate(`/admin/courses/${course.id}/topics`);
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-enter { animation: fadeInUp 0.35s ease both; }
      `}</style>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <CourseModal
          mode={modal.mode}
          initial={modal.course}
          saving={saving}
          onSave={modal.mode === "add" ? handleCreate : handleUpdate}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete Confirm */}
      {delModal && (
        <DeleteConfirm
          course={delModal}
          onConfirm={handleDelete}
          onClose={() => setDelModal(null)}
        />
      )}

      {/* ── Sticky Header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <Icon d={IC.book} size={5} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Course Management
              </h1>
              <p className="text-xs text-gray-400">
                {courses.length} course{courses.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-sm">
            <Icon
              d={IC.search}
              size={4}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all placeholder-gray-300"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon d={IC.close} size={3.5} />
              </button>
            )}
          </div>

          {/* Add Course button */}
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center -end gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-semibold rounded-2xl shadow-md shadow-indigo-200 transition-all active:scale-95 shrink-0"
          >
            <Icon d={IC.plus} size={4} />
            <span className="hidden sm:inline">Add Course</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {search && !loading && (
          <p className="text-sm text-gray-500 mb-5">
            {filtered.length > 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filtered.length}
                </span>{" "}
                result{filtered.length !== 1 ? "s" : ""} for "
                <span className="font-semibold text-indigo-600">{search}</span>"
              </>
            ) : (
              <>
                No results for "
                <span className="font-semibold text-indigo-600">{search}</span>"
              </>
            )}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-gray-400 gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center">
              <Icon
                d={search ? IC.search : IC.book}
                size={10}
                className="text-gray-300"
              />
            </div>
            <p className="text-lg font-semibold text-gray-500">
              {search ? "No courses found" : "No courses yet"}
            </p>
            <p className="text-sm text-center text-gray-400 max-w-xs">
              {search
                ? "Try a different search term."
                : `Click "Add Course" to create your first one.`}
            </p>
            {!search && (
              <button
                onClick={() => setModal({ mode: "add" })}
                className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-2xl transition-colors shadow-md shadow-indigo-100"
              >
                <Icon d={IC.plus} size={4} /> Add Course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((course, i) => (
              <div
                key={course.id}
                className="card-enter"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <CourseCard
                  course={course}
                  index={i}
                  onEdit={(c) => setModal({ mode: "edit", course: c })}
                  onDelete={(c) => setDelModal(c)}
                  onToggleVisible={(c) => handleToggleVisible(c)}
                  onOpen={(c) => handleOpen(c)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
