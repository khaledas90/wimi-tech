'use client'
import React from 'react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PaginationComp: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null
  const generatePages = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex justify-center items-center mt-6 gap-2 flex-wrap text-sm font-semibold">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        السابق
      </button>

      {generatePages().map((p, idx) =>
        typeof p === 'number' ? (
          <button
            key={idx}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded transition ${
              page === p
                ? 'bg-blue-600 text-white scale-105 shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className="px-2 text-gray-500">
            {p}
          </span>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        التالي
      </button>
    </div>
  )
}

export default PaginationComp
