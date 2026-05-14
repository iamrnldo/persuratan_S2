/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Users, User, ChevronDown } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ── Org Chart Node ── */
function OrgNode({ member, level = 0, isLast = false }) {
  const [expanded, setExpanded] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), level * 150);
    return () => clearTimeout(t);
  }, [level]);

  const hasChildren = member.children && member.children.length > 0;

  const levelColors = [
    "from-green-600 to-green-800",
    "from-green-500 to-green-700",
    "from-emerald-500 to-emerald-700",
    "from-teal-500 to-teal-700",
  ];
  const color = levelColors[level % levelColors.length];

  return (
    <div
      className={`flex flex-col items-center transition-all duration-500 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      {/* card */}
      <div className="relative group">
        <div
          className={`relative bg-white rounded-2xl shadow-md border-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default ${
            level === 0
              ? "border-green-500 w-52"
              : level === 1
                ? "border-green-400 w-44"
                : "border-green-200 w-40"
          }`}
        >
          {/* top accent */}
          <div className={`h-2 w-full bg-gradient-to-r ${color}`} />

          <div className="p-4 text-center">
            {/* avatar */}
            <div
              className={`w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
            >
              {member.foto ? (
                <img
                  src={member.foto}
                  alt={member.nama}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <User
                className="w-7 h-7 text-white"
                style={{ display: member.foto ? "none" : "block" }}
              />
            </div>

            {/* jabatan */}
            <p
              className={`text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full mb-2 leading-tight`}
            >
              {member.jabatan}
            </p>

            {/* nama */}
            <p
              className={`font-bold text-gray-900 leading-tight ${level === 0 ? "text-sm" : "text-xs"}`}
            >
              {member.nama}
            </p>

            {/* nip */}
            {member.nip && (
              <p className="text-xs text-gray-400 mt-1">{member.nip}</p>
            )}
          </div>
        </div>

        {/* expand toggle */}
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-10"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${expanded ? "" : "rotate-180"}`}
            />
          </button>
        )}
      </div>

      {/* children */}
      {hasChildren && expanded && (
        <div className="mt-8 relative">
          {/* vertical line down */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-green-300"
            style={{ top: "-16px" }}
          />

          {/* horizontal bar */}
          {member.children.length > 1 && (
            <div
              className="absolute top-0 bg-green-300 h-0.5"
              style={{
                left: "calc(50% / " + member.children.length + " + 0px)",
                right: "calc(50% / " + member.children.length + " + 0px)",
                width: `calc(100% - ${100 / member.children.length}%)`,
                left: `${100 / member.children.length / 2}%`,
                top: 0,
              }}
            />
          )}

          <div
            className="flex gap-6 items-start justify-center"
            style={{ paddingTop: member.children.length > 1 ? "16px" : "0" }}
          >
            {member.children.map((child, idx) => (
              <div key={child.id || idx} className="flex flex-col items-center">
                {/* vertical line up to horizontal */}
                <div className="w-0.5 h-4 bg-green-300 mb-0" />
                <OrgNode
                  member={child}
                  level={level + 1}
                  isLast={idx === member.children.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Build tree from flat array ── */
function buildTree(list) {
  if (!list || list.length === 0) return [];
  const map = {};
  const roots = [];
  list.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });
  list.forEach((item) => {
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });
  return roots;
}

/* ── Fallback data ── */
const fallbackData = [
  {
    id: 1,
    parent_id: null,
    nama: "H. Suherman, S.IP",
    jabatan: "Kepala Desa",
    nip: null,
  },
  {
    id: 2,
    parent_id: 1,
    nama: "Drs. Agus Salim",
    jabatan: "Sekretaris Desa",
    nip: null,
  },
  {
    id: 3,
    parent_id: 2,
    nama: "Ibu Wati",
    jabatan: "Kaur Keuangan",
    nip: null,
  },
  { id: 4, parent_id: 2, nama: "Bpk. Rudi", jabatan: "Kaur Umum", nip: null },
  {
    id: 5,
    parent_id: 2,
    nama: "Ibu Sari",
    jabatan: "Kaur Perencanaan",
    nip: null,
  },
  {
    id: 6,
    parent_id: 1,
    nama: "Bpk. Joko",
    jabatan: "Kasi Pemerintahan",
    nip: null,
  },
  {
    id: 7,
    parent_id: 1,
    nama: "Ibu Rina",
    jabatan: "Kasi Kesejahteraan",
    nip: null,
  },
  {
    id: 8,
    parent_id: 1,
    nama: "Bpk. Hendra",
    jabatan: "Kasi Pelayanan",
    nip: null,
  },
];

export default function StrukturOrganisasiPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API}/struktur-organisasi`)
      .then(({ data: d }) => {
        const list = d.data || d || [];
        setData(list.length > 0 ? list : fallbackData);
      })
      .catch(() => setData(fallbackData))
      .finally(() => setLoading(false));
  }, []);

  const tree = buildTree(data);

  const handleZoom = (dir) => {
    setScale((prev) => Math.max(0.5, Math.min(1.5, prev + dir * 0.1)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-5">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            Struktur Organisasi
          </h1>
          <p className="text-green-100 text-lg">
            Perangkat Desa Sukamaju periode 2022–2027
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* chart */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* zoom controls */}
        <div className="flex items-center justify-end gap-2 mb-6">
          <span className="text-xs text-gray-500 mr-2">Zoom:</span>
          <button
            onClick={() => handleZoom(-1)}
            className="w-8 h-8 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors font-bold"
          >
            –
          </button>
          <span className="text-xs text-gray-600 w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => handleZoom(1)}
            className="w-8 h-8 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors font-bold"
          >
            +
          </button>
          <button
            onClick={() => setScale(1)}
            className="px-3 h-8 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
          >
            Reset
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div
            ref={containerRef}
            className="overflow-auto bg-white rounded-3xl border border-green-100 shadow-sm p-8 min-h-[400px]"
          >
            <div
              className="transition-transform duration-200 origin-top"
              style={{ transform: `scale(${scale})` }}
            >
              <div className="flex flex-col items-center min-w-max mx-auto pb-8">
                {tree.map((root, i) => (
                  <OrgNode key={root.id || i} member={root} level={0} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {[
            { color: "from-green-600 to-green-800", label: "Kepala Desa" },
            { color: "from-green-500 to-green-700", label: "Sekretaris" },
            { color: "from-emerald-500 to-emerald-700", label: "Kaur / Kasi" },
            { color: "from-teal-500 to-teal-700", label: "Staff" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-md bg-gradient-to-br ${color}`}
              />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
