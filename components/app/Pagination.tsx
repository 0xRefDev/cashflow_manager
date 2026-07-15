import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Button } from "@/components/Button";
import { ChevronLeft } from "@/icons/ChevronLeft";
import { ChevronRight } from "@/icons/ChevronRight";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}) {
  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  }

  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#1a1a1a" highlightColor="#262626">
        <div className="flex items-center justify-end gap-1.5 px-4 py-3 bg-[#131313] border-t border-[#484847]/10">
          <Skeleton width={18} height={18} />
          <Skeleton width={14} height={18} />
          <Skeleton width={36} height={36} borderRadius={6} />
          <Skeleton width={36} height={36} borderRadius={6} />
          <Skeleton width={36} height={36} borderRadius={6} />
          <Skeleton width={14} height={18} />
          <Skeleton width={18} height={18} />
        </div>
      </SkeletonTheme>
    );
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (page) =>
        page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
    )
    .reduce<(number | "...")[]>((acc, page, idx, arr) => {
      if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push("...");
      acc.push(page);
      return acc;
    }, []);

  return (
    <div className="flex items-center justify-end gap-1 px-4 py-3 bg-[#131313] border-t border-[#484847]/10">
      <Button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-sm text-[#ADAAAA] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors relative flex items-center"
      >
        <ChevronLeft className="absolute -right-3" />
        <ChevronLeft className="absolute -right-4.5" />
      </Button>
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm text-[#ADAAAA] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft />
      </Button>

      {pages.map((item, idx) =>
        item === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 font-semibold text-[#ADAAAA]">
            ...
          </span>
        ) : (
          <Button
            key={item}
            onClick={() => handlePageChange(item as number)}
            className={`px-4 py-2.5 text-sm rounded-md transition-colors ${
              currentPage === item
                ? "bg-landing-primary text-[#004820] font-extrabold"
                : "text-[#ADAAAA] hover:text-white bg-[#262626] font-medium"
            }`}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm text-[#ADAAAA] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight />
      </Button>
      <Button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-sm text-[#ADAAAA] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center relative"
      >
        <ChevronRight className="absolute -left-3" />
        <ChevronRight className="absolute -left-4.5" />
      </Button>
    </div>
  );
}