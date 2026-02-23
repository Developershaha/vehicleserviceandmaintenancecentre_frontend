interface Props {
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PAGE_SIZE = 10;

const CommonPagination = ({ totalCount, currentPage, onPageChange }: Props) => {
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-1 p-4">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700
                   hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      {/* Pages */}
      <div className="mx-2 flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 rounded-lg text-sm font-medium transition
              ${
                page === currentPage
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700
                   hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default CommonPagination;
