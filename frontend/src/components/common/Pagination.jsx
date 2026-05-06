import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  total,
  limit,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <p className="text-sm text-gray-600">
        Menampilkan <span className="font-medium">{start}</span>-
        <span className="font-medium">{end}</span> dari{" "}
        <span className="font-medium">{total}</span> data
      </p>

      <div className="flex gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Pages */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
