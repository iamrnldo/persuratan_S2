/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import {
  Users,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { strukturOrganisasiService } from "../../../api/strukturOrganisasiService";
import { getImageUrl } from "../../../utils/imageUrl";

// Helper: build tree dari flat array
const buildTree = (items, parentId = null) =>
  items
    .filter((i) => (i.parent_id ?? null) === parentId)
    .sort((a, b) => a.urutan - b.urutan || a.level - b.level)
    .map((i) => ({ ...i, children: buildTree(items, i.id) }));

// Hitung total descendants
const countDescendants = (node) => {
  if (!node.children?.length) return 0;
  return node.children.reduce((acc, c) => acc + 1 + countDescendants(c), 0);
};

// Warna berdasarkan level
const getLevelStyle = (level, isRoot) => {
  if (isRoot || level === 1)
    return {
      border: "border-primary-500",
      bg: "bg-primary-50",
      avatar: "bg-primary-500 text-white",
      jabatan: "text-primary-600",
    };
  if (level === 2)
    return {
      border: "border-blue-400",
      bg: "bg-blue-50",
      avatar: "bg-blue-500 text-white",
      jabatan: "text-blue-600",
    };
  if (level === 3)
    return {
      border: "border-emerald-400",
      bg: "bg-emerald-50",
      avatar: "bg-emerald-500 text-white",
      jabatan: "text-emerald-600",
    };
  return {
    border: "border-gray-300",
    bg: "bg-white",
    avatar: "bg-gray-200 text-gray-600",
    jabatan: "text-gray-500",
  };
};

// Node Card
const OrgNode = ({ node, isRoot = false }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children?.length > 0;
  const style = getLevelStyle(node.level, isRoot);
  const fotoUrl = getImageUrl(node.foto);

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div className="relative group">
        <div
          className={`
            flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border-2 shadow-sm
            transition-all duration-200 min-w-[140px] max-w-[180px]
            ${style.border} ${style.bg}
            hover:shadow-lg hover:-translate-y-0.5
          `}
        >
          {/* Avatar / Foto */}
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={node.nama}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-14 h-14 rounded-full items-center justify-center
              text-xl font-bold shadow ${style.avatar}`}
            style={{ display: fotoUrl ? "none" : "flex" }}
          >
            {node.nama?.charAt(0)?.toUpperCase()}
          </div>

          {/* Nama & Jabatan */}
          <div className="text-center">
            <p className="font-semibold text-gray-800 text-sm leading-tight">
              {node.nama}
            </p>
            <p className={`text-xs mt-0.5 font-medium ${style.jabatan}`}>
              {node.jabatan}
            </p>
          </div>

          {/* Level badge */}
          <span className="absolute -top-2 -right-2 text-[10px] bg-white border border-gray-200 text-gray-400 rounded-full px-1.5 py-0.5 shadow-sm">
            L{node.level}
          </span>

          {/* Nonaktif badge */}
          {!node.is_active && (
            <span className="absolute -top-2 -left-2 text-[10px] bg-red-100 border border-red-300 text-red-500 rounded-full px-1.5 py-0.5 shadow-sm">
              off
            </span>
          )}
        </div>

        {/* Collapse / Expand toggle */}
        {hasChildren && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10
              w-6 h-6 rounded-full bg-white border border-gray-300 shadow
              flex items-center justify-center text-gray-500
              hover:bg-gray-50 hover:text-gray-700 transition-colors"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && !collapsed && (
        <div className="flex flex-col items-center mt-6">
          {/* Garis vertikal dari parent */}
          <div className="w-px h-6 bg-gray-300" />

          {node.children.length === 1 ? (
            <OrgNode node={node.children[0]} />
          ) : (
            <div className="flex items-start">
              {node.children.map((child, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === node.children.length - 1;

                return (
                  <div
                    key={child.id}
                    className="flex flex-col items-center px-4"
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`h-px bg-gray-300 flex-1 ${isFirst ? "invisible" : ""}`}
                      />
                      <div className="w-px h-5 bg-gray-300" />
                      <div
                        className={`h-px bg-gray-300 flex-1 ${isLast ? "invisible" : ""}`}
                      />
                    </div>
                    <OrgNode node={child} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Collapsed indicator */}
      {hasChildren && collapsed && (
        <div className="flex flex-col items-center mt-6">
          <div className="w-px h-4 bg-gray-300" />
          <span className="text-[11px] text-gray-400 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5">
            +{countDescendants(node)} tersembunyi
          </span>
        </div>
      )}
    </div>
  );
};

// Legend
const Legend = () => (
  <div className="flex flex-wrap gap-3 text-xs">
    {[
      { color: "bg-primary-500", label: "Level 1 (Root)" },
      { color: "bg-blue-500", label: "Level 2" },
      { color: "bg-emerald-500", label: "Level 3" },
      { color: "bg-gray-300", label: "Level 4+" },
    ].map(({ color, label }) => (
      <div key={label} className="flex items-center gap-1.5">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-gray-500">{label}</span>
      </div>
    ))}
  </div>
);

// Main Component
const StrukturOrganisasiPreview = ({ isOpen, onClose }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [filterActive, setFilterActive] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filterActive) params.is_active = "true";
      const res = await strukturOrganisasiService.getAll(params);
      const flat = res.data ?? [];
      setTreeData(buildTree(flat));
    } catch {
      setError("Gagal memuat data struktur organisasi.");
    } finally {
      setLoading(false);
    }
  }, [filterActive]);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  // Tutup dengan Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const zoomIn = () => setZoom((z) => Math.min(+(z + 0.15).toFixed(2), 2));
  const zoomOut = () => setZoom((z) => Math.max(+(z - 0.15).toFixed(2), 0.3));
  const resetZoom = () => setZoom(1);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
        flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl
          max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                Preview Struktur Organisasi
              </h2>
              <p className="text-xs text-gray-400">
                Diagram hierarki pengurus desa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter aktif saja */}
            <label className="flex items-center gap-2 text-sm text-gray-600 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={filterActive}
                onChange={(e) => setFilterActive(e.target.checked)}
                className="accent-primary-500 w-4 h-4"
              />
              Aktif saja
            </label>

            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={zoomOut}
                className="p-1.5 rounded-md hover:bg-white hover:shadow
                  transition-all text-gray-600"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="px-2 py-1 rounded-md hover:bg-white hover:shadow
                  transition-all text-xs font-mono text-gray-600
                  min-w-[44px] text-center"
                title="Reset zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={zoomIn}
                className="p-1.5 rounded-md hover:bg-white hover:shadow
                  transition-all text-gray-600"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="p-1.5 rounded-md hover:bg-white hover:shadow
                  transition-all text-gray-500"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100
                transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 overflow-auto bg-gray-50 p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-sm">Memuat struktur organisasi...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-red-400">
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchData}
                className="text-xs bg-red-50 border border-red-200 text-red-500
                  px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                Coba lagi
              </button>
            </div>
          ) : treeData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <Users className="w-12 h-12 opacity-30" />
              <p className="text-sm">Belum ada data struktur organisasi</p>
            </div>
          ) : (
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              }}
              className="transition-transform duration-200 ease-out pb-16"
            >
              <div className="flex gap-16 justify-center items-start flex-wrap">
                {treeData.map((root) => (
                  <OrgNode key={root.id} node={root} isRoot />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-3
            border-t border-gray-100 bg-gray-50 flex-shrink-0"
        >
          <Legend />
          <p className="text-xs text-gray-400 hidden sm:block">
            Klik ▾ / ▸ pada node untuk collapse · Tekan{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-500 font-mono">
              Esc
            </kbd>{" "}
            untuk menutup
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrukturOrganisasiPreview;
