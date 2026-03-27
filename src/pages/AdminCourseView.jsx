import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ─── API BASE URL ─────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000";

// ─── API Helper ───────────────────────────────────────────────────────────────
const api = {
  get: (path) =>
    fetch(`${API_BASE}${path}`).then((r) => {
      if (!r.ok) throw new Error(`GET ${path} failed: ${r.status}`);
      return r.json();
    }),

  post: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => {
      if (!r.ok) throw new Error(`POST ${path} failed: ${r.status}`);
      return r.json();
    }),

  put: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => {
      if (!r.ok) throw new Error(`PUT ${path} failed: ${r.status}`);
      return r.json();
    }),

  patch: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => {
      if (!r.ok) throw new Error(`PATCH ${path} failed: ${r.status}`);
      return r.json();
    }),

  delete: (path) =>
    fetch(`${API_BASE}${path}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error(`DELETE ${path} failed: ${r.status}`);
      return r.json();
    }),
};

// ─── Local ID generator (for optimistic UI only) ──────────────────────────────
let _tmpId = 1;
const tmpId = () => `tmp_${_tmpId++}`;

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
  book: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  pencil:
    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  check: "M5 13l4 4L19 7",
  back: "M10 19l-7-7m0 0l7-7m-7 7h18",
  chevron: "M19 9l-7 7-7-7",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  image:
    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  code: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  video:
    "M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  eyeOff:
    "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
  spinner:
    "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
  warn: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
};

const BLOCK_TYPES = [
  { type: "text", icon: IC.pencil, label: "Text" },
  { type: "code", icon: IC.code, label: "Code" },
  { type: "image", icon: IC.image, label: "Image" },
  { type: "video", icon: IC.video, label: "Video" },
  { type: "link", icon: IC.link, label: "Link" },
];

const BLOCK_DEFAULTS = {
  text: "<p>New paragraph...</p>",
  code: "// write your code here",
  image: null,
  video: "",
  link: { href: "", label: "", desc: "" },
};

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-indigo-500",
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg ${colors[type]} transition-all`}
    >
      {type === "error" && <Icon d={IC.warn} size={4} />}
      {type === "success" && <Icon d={IC.check} size={4} />}
      {message}
      <button
        onClick={onClose}
        className="ml-2 opacity-70 hover:opacity-100 text-xs"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
      <svg
        className="w-8 h-8 animate-spin text-indigo-400"
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
      <span className="text-sm">{label}</span>
    </div>
  );
}

// ─── Text Block ───────────────────────────────────────────────────────────────
function TextBlock({ block, onChange }) {
  const ref = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current && ref.current) {
      ref.current.innerHTML = block.value || "";
      mounted.current = true;
    }
  }, []);

  const exec = (cmd, val = null) => {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(ref.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt("URL:", "https://");
    if (url) exec("createLink", url);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {[
          ["B", "bold"],
          ["I", "italic"],
          ["U", "underline"],
        ].map(([l, c]) => (
          <button
            key={c}
            title={l}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(c);
            }}
            className="w-6 h-6 text-xs font-bold text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded transition-colors flex items-center justify-center"
          >
            {l}
          </button>
        ))}
        <div className="w-px h-4 bg-gray-300 mx-1" />
        {[
          ["H2", "h2"],
          ["H3", "h3"],
          ["P", "p"],
        ].map(([l, t]) => (
          <button
            key={t}
            onMouseDown={(e) => {
              e.preventDefault();
              exec("formatBlock", t);
            }}
            className="px-1.5 h-6 text-xs font-semibold text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded transition-colors"
          >
            {l}
          </button>
        ))}
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertUnorderedList");
          }}
          className="px-2 h-6 text-xs text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded transition-colors"
        >
          • List
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertOrderedList");
          }}
          className="px-2 h-6 text-xs text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded transition-colors"
        >
          1. List
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
          className="flex items-center gap-1 px-2 h-6 text-xs text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded transition-colors"
        >
          <Icon d={IC.link} size={3} /> Link
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            exec("unlink");
          }}
          className="px-2 h-6 text-xs text-gray-400 hover:bg-gray-200 rounded transition-colors"
        >
          Unlink
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current.innerHTML)}
        className="min-h-20 px-4 py-3 text-sm text-gray-700 leading-relaxed focus:outline-none prose prose-sm max-w-none"
      />
    </div>
  );
}

// ─── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({ block, onChange }) {
  const lines = (block.value || "").split("\n").length;
  return (
    <div className="rounded-xl overflow-hidden shadow border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex gap-1.5">
          {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((c) => (
            <div key={c} className={`w-3 h-3 rounded-full ${c}/70`} />
          ))}
        </div>
        <span className="text-xs text-gray-400 font-mono">javascript</span>
      </div>
      <textarea
        value={block.value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        rows={Math.max(3, lines + 1)}
        className="w-full bg-gray-900 text-green-300 font-mono text-sm px-4 py-3 focus:outline-none resize-none"
      />
    </div>
  );
}

// ─── Image Block ──────────────────────────────────────────────────────────────
function ImageBlock({ block, onChange }) {
  const fileRef = useRef(null);
  const src = block.value?.src;
  const caption = block.value?.caption || "";

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ src: reader.result, caption });
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50">
      {src ? (
        <div className="relative group">
          <img
            src={src}
            alt="block"
            className="w-full max-h-80 object-contain bg-white"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-white text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium shadow"
            >
              Change Image
            </button>
          </div>
          <div className="px-3 py-2 bg-white border-t border-gray-100">
            <input
              value={caption}
              onChange={(e) => onChange({ src, caption: e.target.value })}
              placeholder="Add caption..."
              className="w-full text-xs text-gray-500 focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-10 flex flex-col items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors"
        >
          <Icon d={IC.image} size={8} />
          <span className="text-sm font-medium">Click to upload image</span>
          <span className="text-xs">PNG, JPG, GIF supported</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ─── Video Block ──────────────────────────────────────────────────────────────
function VideoBlock({ block, onChange }) {
  const [url, setUrl] = useState(block.value || "");

  const getEmbed = (raw) => {
    const yt = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vim = raw.match(/vimeo\.com\/(\d+)/);
    if (vim) return `https://player.vimeo.com/video/${vim[1]}`;
    return raw;
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
      <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
        <Icon d={IC.video} size={4} className="text-gray-500" />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube / Vimeo URL..."
          className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={() => onChange(url)}
          className="text-xs bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Embed
        </button>
      </div>
      {block.value ? (
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={getEmbed(block.value)}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center gap-2 text-gray-400">
          <Icon d={IC.video} size={8} />
          <span className="text-sm">
            Paste a YouTube or Vimeo URL above and click Embed
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Link Block ───────────────────────────────────────────────────────────────
function LinkBlock({ block, onChange }) {
  const [form, setForm] = useState(
    block.value || { href: "", label: "", desc: "" },
  );

  return (
    <div className="border border-indigo-100 bg-indigo-50/60 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Icon d={IC.link} size={4} className="text-indigo-500" />
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
          Link Block
        </span>
      </div>
      {[
        ["label", "Link label..."],
        ["href", "https://..."],
        ["desc", "Short description (optional)"],
      ].map(([k, p]) => (
        <input
          key={k}
          value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          placeholder={p}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        />
      ))}
      <button
        onClick={() => onChange(form)}
        className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors"
      >
        Save Link
      </button>
      {form.href && form.label && (
        <a
          href={form.href}
          target="_blank"
          rel="noreferrer"
          className="block mt-1 text-sm text-indigo-600 underline font-medium"
        >
          {form.label} →
        </a>
      )}
    </div>
  );
}

// ─── Block View (read mode) ───────────────────────────────────────────────────
function BlockView({ block }) {
  if (block.type === "text") {
    return (
      <div
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: block.value }}
      />
    );
  }

  if (block.type === "code") {
    return (
      <div className="rounded-xl overflow-hidden shadow border border-gray-700">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex gap-1.5">
            {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((c) => (
              <div key={c} className={`w-3 h-3 rounded-full ${c}/70`} />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-mono">javascript</span>
        </div>
        <pre className="bg-gray-900 text-green-300 font-mono text-sm px-4 py-3 overflow-x-auto whitespace-pre-wrap">
          {block.value}
        </pre>
      </div>
    );
  }

  if (block.type === "image" && block.value?.src) {
    return (
      <figure className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <img
          src={block.value.src}
          alt={block.value.caption || ""}
          className="w-full max-h-96 object-contain bg-white"
        />
        {block.value.caption && (
          <figcaption className="text-center text-xs text-gray-500 px-4 py-2 bg-gray-50">
            {block.value.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "video" && block.value) {
    const getEmbed = (raw) => {
      const yt = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
      const vim = raw.match(/vimeo\.com\/(\d+)/);
      if (vim) return `https://player.vimeo.com/video/${vim[1]}`;
      return raw;
    };
    return (
      <div
        className="relative w-full rounded-xl overflow-hidden shadow border border-gray-200"
        style={{ paddingTop: "56.25%" }}
      >
        <iframe
          src={getEmbed(block.value)}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (block.type === "link" && block.value?.href) {
    return (
      <div className="border border-indigo-100 bg-indigo-50 rounded-xl px-4 py-3 flex items-start gap-3">
        <Icon
          d={IC.link}
          size={4}
          className="text-indigo-500 mt-0.5 shrink-0"
        />
        <div>
          <a
            href={block.value.href}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 font-semibold text-sm hover:underline"
          >
            {block.value.label || block.value.href}
          </a>
          {block.value.desc && (
            <p className="text-xs text-gray-500 mt-0.5">{block.value.desc}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// ─── Block Edit Row ───────────────────────────────────────────────────────────
function BlockRow({ block, index, total, onChange, onDelete, onMove, onAdd }) {
  return (
    <div className="group relative">
      {/* Move up/down */}
      <div className="absolute -left-10 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          className="w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-400 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 flex items-center justify-center text-xs transition-colors"
        >
          ↑
        </button>
        <button
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1}
          className="w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-400 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 flex items-center justify-center text-xs transition-colors"
        >
          ↓
        </button>
      </div>

      {/* Block content */}
      {block.type === "text" && (
        <TextBlock
          block={block}
          onChange={(v) => onChange(index, { ...block, value: v })}
        />
      )}
      {block.type === "code" && (
        <CodeBlock
          block={block}
          onChange={(v) => onChange(index, { ...block, value: v })}
        />
      )}
      {block.type === "image" && (
        <ImageBlock
          block={block}
          onChange={(v) => onChange(index, { ...block, value: v })}
        />
      )}
      {block.type === "video" && (
        <VideoBlock
          block={block}
          onChange={(v) => onChange(index, { ...block, value: v })}
        />
      )}
      {block.type === "link" && (
        <LinkBlock
          block={block}
          onChange={(v) => onChange(index, { ...block, value: v })}
        />
      )}

      {/* Delete block */}
      <button
        onClick={() => onDelete(index)}
        className="absolute -right-8 top-2 w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-400 hover:text-red-500 hover:border-red-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
      >
        <Icon d={IC.trash} size={3} />
      </button>

      {/* Insert strip between blocks */}
      <div className="relative flex items-center justify-center my-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-200" />
        <div className="relative flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
          {BLOCK_TYPES.map(({ type, icon, label }) => (
            <button
              key={type}
              title={`Add ${label}`}
              onClick={() => onAdd(index + 1, type)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-full transition-colors"
            >
              <Icon d={icon} size={3} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // ── State ──
  const [course, setCourse] = useState(null); // { id, title, student_count, duration }
  const [sections, setSections] = useState([]); // full tree from backend
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null); // { message, type }

  // topic editing
  const [addingTopic, setAddingTopic] = useState(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [editingTopic, setEditingTopic] = useState(null);
  const [editTopicName, setEditTopicName] = useState("");

  // section editing
  const [showAddSection, setShowAddSection] = useState(false);
  const [addingSectionName, setAddingSectionName] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [editSectionName, setEditSectionName] = useState("");

  // ── Toast helper ──
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // ── Fetch course + sections on mount ──
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Expected FastAPI endpoints:
        //   GET /courses/{courseId}          → { id, title, student_count, duration }
        //   GET /courses/{courseId}/sections → [ { id, title, visible, order, topics: [ { id, title, visible, order, blocks: [...] } ] } ]
        const [courseData, sectionsData] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/courses/${courseId}/sections`),
        ]);
        setCourse(courseData);
        setSections(sectionsData);

        // Auto-open first section and topic
        if (sectionsData.length > 0) {
          const first = sectionsData[0];
          setActiveSection(first.id);
          if (first.topics && first.topics.length > 0) {
            setActiveTopic(first.topics[0]);
          }
        }
      } catch (err) {
        showToast(
          "Failed to load course data. Check your backend connection.",
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  // ── Sync active topic back into sections tree ──
  const syncTopic = (updated) => {
    setActiveTopic(updated);
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        topics: s.topics.map((t) => (t.id === updated.id ? updated : t)),
      })),
    );
  };

  // ── Block operations (local state, saved on "Save Changes") ──
  const updateBlock = (idx, newBlock) =>
    syncTopic({
      ...activeTopic,
      blocks: activeTopic.blocks.map((b, i) => (i === idx ? newBlock : b)),
    });

  const deleteBlock = (idx) =>
    syncTopic({
      ...activeTopic,
      blocks: activeTopic.blocks.filter((_, i) => i !== idx),
    });

  const moveBlock = (idx, dir) => {
    const bs = [...activeTopic.blocks];
    const to = idx + dir;
    if (to < 0 || to >= bs.length) return;
    [bs[idx], bs[to]] = [bs[to], bs[idx]];
    syncTopic({ ...activeTopic, blocks: bs });
  };

  const addBlock = (atIdx, type) => {
    const nb = { id: tmpId(), type, value: BLOCK_DEFAULTS[type] };
    const bs = [...activeTopic.blocks];
    bs.splice(atIdx, 0, nb);
    syncTopic({ ...activeTopic, blocks: bs });
  };

  // ── Save ALL changes to backend ──
  // Sends the complete current sections tree to the backend in one batch PUT
  // FastAPI endpoint: PUT /courses/{courseId}/sections  body: [ ...sections ]
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await api.put(`/courses/${courseId}/sections`, sections);
      showToast("All changes saved successfully!");
      setEditMode(false);
    } catch (err) {
      showToast("Save failed. Please try again.", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Section accordion toggle ──
  const toggleSection = (id) => {
    if (editingSection === id) return;
    setActiveSection((p) => (p === id ? null : id));
    if (activeSection !== id) setActiveTopic(null);
  };

  // ── Section: toggle visibility (local) ──
  const toggleSectionVisible = (id) =>
    setSections((p) =>
      p.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    );

  // ── Section: rename (local) ──
  const startEditSection = (e, section) => {
    e.stopPropagation();
    setEditingSection(section.id);
    setEditSectionName(section.title);
    setActiveSection(section.id);
  };

  const saveEditSection = (id) => {
    const name = editSectionName.trim();
    if (!name) {
      setEditingSection(null);
      return;
    }
    setSections((p) =>
      p.map((s) => (s.id === id ? { ...s, title: name.toUpperCase() } : s)),
    );
    setEditingSection(null);
  };

  // ── Section: delete (local) ──
  const deleteSection = (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this section and all its topics?")) return;
    setSections((p) => p.filter((s) => s.id !== id));
    if (activeSection === id) {
      setActiveSection(null);
      setActiveTopic(null);
    }
  };

  // ── Section: add new (local, gets a tmp id) ──
  const addSection = () => {
    if (!addingSectionName.trim()) return;
    const newSection = {
      id: tmpId(),
      title: addingSectionName.trim().toUpperCase(),
      visible: true,
      order: sections.length,
      topics: [],
    };
    setSections((p) => [...p, newSection]);
    setAddingSectionName("");
    setShowAddSection(false);
  };

  // ── Topic: toggle visibility (local) ──
  const toggleTopicVisible = (sid, tid) =>
    setSections((p) =>
      p.map((s) =>
        s.id === sid
          ? {
              ...s,
              topics: s.topics.map((t) =>
                t.id === tid ? { ...t, visible: !t.visible } : t,
              ),
            }
          : s,
      ),
    );

  // ── Topic: add new (local) ──
  const addTopic = (sectionId) => {
    if (!newTopicName.trim()) return;
    const section = sections.find((s) => s.id === sectionId);
    const newTopic = {
      id: tmpId(),
      title: newTopicName.trim(),
      visible: true,
      order: section?.topics?.length || 0,
      blocks: [
        { id: tmpId(), type: "text", value: "<p>Start writing here...</p>" },
      ],
    };
    setSections((p) =>
      p.map((s) =>
        s.id === sectionId ? { ...s, topics: [...s.topics, newTopic] } : s,
      ),
    );
    setNewTopicName("");
    setAddingTopic(null);
    setActiveTopic(newTopic);
    setActiveSection(sectionId);
  };

  // ── Topic: delete (local) ──
  const deleteTopic = (sid, tid) => {
    setSections((p) =>
      p.map((s) =>
        s.id === sid
          ? { ...s, topics: s.topics.filter((t) => t.id !== tid) }
          : s,
      ),
    );
    if (activeTopic?.id === tid) setActiveTopic(null);
  };

  // ── Topic: rename (local) ──
  const saveEditTopic = (sid, tid) => {
    setSections((p) =>
      p.map((s) =>
        s.id === sid
          ? {
              ...s,
              topics: s.topics.map((t) =>
                t.id === tid ? { ...t, title: editTopicName } : t,
              ),
            }
          : s,
      ),
    );
    if (activeTopic?.id === tid)
      setActiveTopic((p) => ({ ...p, title: editTopicName }));
    setEditingTopic(null);
  };

  // ── Search ──
  const q = search.trim().toLowerCase();
  const isSearching = q.length > 0;
  const searchResults = sections.flatMap((s) =>
    s.topics
      .filter((t) => t.title.toLowerCase().includes(q))
      .map((t) => ({ ...t, sectionTitle: s.title, sectionId: s.id })),
  );

  // ── Topic Row component ──
  const TopicRow = ({ topic, sectionId }) => {
    const isActive = activeTopic?.id === topic.id;
    if (!editMode && !topic.visible) return null;

    return (
      <div
        onClick={() => {
          if (editingTopic !== topic.id) {
            setActiveTopic(topic);
            if (!isSearching) setActiveSection(sectionId);
          }
        }}
        className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer group transition-colors
          ${isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-50 text-gray-700"}
          ${!topic.visible && editMode ? "opacity-50" : ""}`}
      >
        {editMode && editingTopic === topic.id ? (
          <div
            className="flex items-center gap-1 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={editTopicName}
              onChange={(e) => setEditTopicName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEditTopic(sectionId, topic.id);
                if (e.key === "Escape") setEditingTopic(null);
              }}
              className="text-xs border border-indigo-300 rounded px-1.5 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              onClick={() => saveEditTopic(sectionId, topic.id)}
              className="text-indigo-600 font-bold text-xs"
            >
              ✓
            </button>
          </div>
        ) : (
          <>
            <span className="text-xs truncate">{topic.title}</span>
            {editMode && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTopicVisible(sectionId, topic.id);
                  }}
                  title={topic.visible ? "Hide" : "Show"}
                  className={`p-1 rounded transition-colors ${topic.visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                >
                  <Icon d={topic.visible ? IC.eye : IC.eyeOff} size={3} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTopic(topic.id);
                    setEditTopicName(topic.title);
                  }}
                  title="Rename"
                  className="p-1 rounded text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <Icon d={IC.pencil} size={3} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTopic(sectionId, topic.id);
                  }}
                  title="Delete"
                  className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Icon d={IC.trash} size={3} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // ── Render ──
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ══ SIDEBAR ════════════════════════════════════════════════════════ */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm shrink-0">
        {/* Sidebar header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="w-1 h-5 bg-indigo-600 rounded-full" />
          <span className="text-indigo-700 font-extrabold text-lg tracking-tight">
            Course Topics
          </span>
        </div>

        {/* Sections list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <svg
                className="w-5 h-5 animate-spin text-indigo-400"
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
            </div>
          ) : isSearching ? (
            /* Search results */
            <div>
              <p className="text-[10px] font-semibold text-gray-400 px-3 pb-2 uppercase tracking-wider">
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} across all sections
              </p>
              {searchResults.length === 0 && (
                <p className="text-xs text-gray-400 px-3 py-4 text-center italic">
                  No topics found
                </p>
              )}
              {searchResults.map((topic) => (
                <div key={topic.id}>
                  <TopicRow topic={topic} sectionId={topic.sectionId} />
                  <p className="text-[10px] text-gray-400 px-4 -mt-0.5 mb-1">
                    in {topic.sectionTitle}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            /* Accordion sections */
            sections.map((section) => {
              if (!editMode && !section.visible) return null;
              const isOpen = activeSection === section.id;

              return (
                <div
                  key={section.id}
                  className={`mb-1 ${!section.visible && editMode ? "opacity-60" : ""}`}
                >
                  {/* Section header row */}
                  <div
                    onClick={() => toggleSection(section.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group
                      ${isOpen ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                  >
                    {/* Left: chevron + title or rename input */}
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <Icon
                        d={IC.chevron}
                        size={3}
                        className={`text-gray-400 transition-transform shrink-0 ${isOpen ? "rotate-180 text-indigo-400" : ""}`}
                      />

                      {editMode && editingSection === section.id ? (
                        <div
                          className="flex items-center gap-1 flex-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            autoFocus
                            value={editSectionName}
                            onChange={(e) => setEditSectionName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                saveEditSection(section.id);
                              if (e.key === "Escape") setEditingSection(null);
                            }}
                            className="text-xs font-bold border border-indigo-300 rounded px-1.5 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 uppercase"
                          />
                          <button
                            onClick={() => saveEditSection(section.id)}
                            className="text-indigo-600 font-bold text-xs shrink-0"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingSection(null)}
                            className="text-gray-400 text-xs shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-bold tracking-widest truncate ${isOpen ? "text-indigo-600" : "text-gray-500"}`}
                        >
                          {section.title}
                        </span>
                      )}
                    </div>

                    {/* Right: edit-mode section action buttons */}
                    {editMode && editingSection !== section.id && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionVisible(section.id);
                          }}
                          title={
                            section.visible ? "Hide section" : "Show section"
                          }
                          className={`p-1 rounded transition-colors ${section.visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                        >
                          <Icon
                            d={section.visible ? IC.eye : IC.eyeOff}
                            size={3}
                          />
                        </button>
                        <button
                          onClick={(e) => startEditSection(e, section)}
                          title="Rename section"
                          className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Icon d={IC.pencil} size={3} />
                        </button>
                        <button
                          onClick={(e) => deleteSection(e, section.id)}
                          title="Delete section"
                          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Icon d={IC.trash} size={3} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Topics list */}
                  {isOpen && (
                    <div className="ml-3 mt-1 space-y-0.5">
                      {section.topics.length === 0 && !editMode && (
                        <p className="text-xs text-gray-400 px-3 py-2 italic">
                          No topics yet.
                        </p>
                      )}
                      {section.topics.map((t) => (
                        <TopicRow key={t.id} topic={t} sectionId={section.id} />
                      ))}

                      {editMode &&
                        (addingTopic === section.id ? (
                          <div className="flex items-center gap-1 px-2 py-1">
                            <input
                              autoFocus
                              value={newTopicName}
                              onChange={(e) => setNewTopicName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") addTopic(section.id);
                                if (e.key === "Escape") setAddingTopic(null);
                              }}
                              placeholder="Topic name..."
                              className="text-xs border border-indigo-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            />
                            <button
                              onClick={() => addTopic(section.id)}
                              className="text-indigo-600 font-bold text-xs"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setAddingTopic(null)}
                              className="text-gray-400 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAddingTopic(section.id);
                              setNewTopicName("");
                            }}
                            className="w-full text-xs text-indigo-500 hover:text-indigo-700 border border-dashed border-indigo-200 hover:border-indigo-400 rounded-lg py-1.5 transition-colors mt-1"
                          >
                            + Add Topic
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-2">
          {/* Back to course management */}
          <button
            onClick={() => navigate("/admin/courses")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-50 w-full transition-colors"
          >
            <Icon d={IC.back} size={4} /> Back to Course
          </button>

          {/* Add section */}
          {editMode &&
            (showAddSection ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  value={addingSectionName}
                  onChange={(e) => setAddingSectionName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addSection();
                    if (e.key === "Escape") setShowAddSection(false);
                  }}
                  placeholder="Section name..."
                  className="text-xs border border-indigo-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <button
                  onClick={addSection}
                  className="text-indigo-600 font-bold text-xs"
                >
                  ✓
                </button>
                <button
                  onClick={() => setShowAddSection(false)}
                  className="text-gray-400 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAddSection(true);
                  setAddingSectionName("");
                }}
                className="w-full text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-dashed border-indigo-300 hover:border-indigo-500 rounded-lg py-2 transition-colors"
              >
                + Add Section
              </button>
            ))}
        </div>
      </aside>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shadow-sm">
          {/* Course info — comes from backend */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Icon d={IC.book} size={5} className="text-indigo-600" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-base leading-tight">
                {loading ? (
                  <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
                ) : (
                  course?.title || "Course"
                )}
              </div>
              <div className="text-xs text-gray-400">
                {loading ? (
                  <span className="inline-block w-24 h-3 bg-gray-100 rounded animate-pulse mt-1" />
                ) : (
                  `${course?.student_count ?? 0} Students · ${course?.duration ?? ""}`
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-80">
              <Icon
                d={IC.search}
                size={4}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics across all sections..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {editMode && (
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl shadow transition-all"
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
                  <Icon d={IC.check} size={4} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
            <button
              onClick={() => setEditMode((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow transition-all
                ${editMode ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-900 hover:bg-gray-700 text-white"}`}
            >
              <Icon d={IC.pencil} size={4} />
              {editMode ? "Editing Mode" : "Edit Mode"}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <Spinner label="Loading course content..." />
          ) : activeTopic ? (
            <div className="max-w-3xl mx-auto px-8 py-8">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                {activeTopic.title}
              </h1>

              {editMode && (
                <div className="mb-5 flex items-center gap-2 text-xs text-indigo-500 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg">
                  <Icon d={IC.info} size={3.5} />
                  Hover any block to move, delete, or insert new blocks. Click{" "}
                  <strong>Save Changes</strong> to push to backend.
                </div>
              )}

              {/* Empty block state */}
              {editMode && activeTopic.blocks.length === 0 && (
                <div className="flex flex-wrap items-center justify-center gap-3 py-12 border-2 border-dashed border-gray-200 rounded-xl">
                  {BLOCK_TYPES.map(({ type, icon, label }) => (
                    <button
                      key={type}
                      onClick={() => addBlock(0, type)}
                      className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-200"
                    >
                      <Icon d={icon} size={6} />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Block list */}
              <div className={`space-y-3 ${editMode ? "pl-12" : ""}`}>
                {activeTopic.blocks.map((block, index) =>
                  editMode ? (
                    <BlockRow
                      key={block.id}
                      block={block}
                      index={index}
                      total={activeTopic.blocks.length}
                      onChange={updateBlock}
                      onDelete={deleteBlock}
                      onMove={moveBlock}
                      onAdd={addBlock}
                    />
                  ) : (
                    <BlockView key={block.id} block={block} />
                  ),
                )}
              </div>

              {/* Bottom add strip */}
              {editMode && activeTopic.blocks.length > 0 && (
                <div className="mt-6 pl-12">
                  <div className="flex flex-wrap items-center justify-center gap-1 py-2.5 border border-dashed border-gray-200 rounded-xl">
                    <span className="text-xs text-gray-400 mr-1">
                      Add block:
                    </span>
                    {BLOCK_TYPES.map(({ type, icon, label }) => (
                      <button
                        key={type}
                        onClick={() =>
                          addBlock(activeTopic.blocks.length, type)
                        }
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1.5 rounded-lg transition-colors"
                      >
                        <Icon d={icon} size={3} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <Icon d={IC.book} size={16} className="text-gray-200" />
              <p className="text-sm">
                Select a topic from the sidebar to view content
              </p>
              {editMode && (
                <p className="text-xs text-indigo-400">
                  Use "+ Add Topic" inside any section to create content
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
