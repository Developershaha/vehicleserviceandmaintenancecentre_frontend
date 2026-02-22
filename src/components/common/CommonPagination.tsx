interface Props {
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PAGE_SIZE = 10; // backend default

const CommonPagination = ({
  totalCount,
  currentPage,
  onPageChange,
}: Props) => {
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end gap-2 p-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default CommonPagination;
