const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasPrevPage, hasNextPage } = pagination;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      <button
        disabled={!hasPrevPage}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
