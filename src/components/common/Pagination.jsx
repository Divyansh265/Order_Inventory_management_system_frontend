const Pagination = ({ meta, onPageChange }) => {
    if (!meta || meta.totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-5 text-sm text-gray-500">
            <span>
                Page {meta.page} of {meta.totalPages}
                <span className="text-gray-400 ml-1">({meta.total} total)</span>
            </span>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(meta.page - 1)}
                    disabled={meta.page <= 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50 hover:border-maroon-300 transition-colors"
                >
                    ← Previous
                </button>
                <button
                    onClick={() => onPageChange(meta.page + 1)}
                    disabled={meta.page >= meta.totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50 hover:border-maroon-300 transition-colors"
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default Pagination;
