import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null
  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }

    return pages
  }

  const goToPrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const goToNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-[50px] flex-wrap ">
      <Button variant="outline" size="icon" onClick={goToPrevious} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-muted-foreground select-none">...</span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className="w-10"
          >
            {page}
          </Button>
        )
      )}

      <Button variant="outline" size="icon" onClick={goToNext} disabled={currentPage === totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
