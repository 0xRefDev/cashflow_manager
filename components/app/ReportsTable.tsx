import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ReportsTableProps } from "@/types/report.types";
import { Movement } from "@/types/report.types";

import { Add } from "@/icons/app/Add";
import { Minus } from "@/icons/app/Minus";
import { getCurrencyIcon } from "@/utils/Currencies";
import { Edit } from "@/icons/app/Edit";
import { Trash } from "@/icons/app/Trash";

import { ChevronRight } from "@/icons/ChevronRight";
import { usePreferences } from "@/hooks/usePreferences";

interface ReportsTableExtendedProps extends ReportsTableProps {
  isLoading?: boolean;
  skeletonRows?: number;
  formatAmount?: (amount: number, currency: string) => string;
  onEdit?: (movement: Movement) => void;
  onDelete?: (movement: Movement) => void;
}

export function ReportsTable({
  reports,
  headers,
  isLoading = false,
  skeletonRows = 7,
  formatAmount,
  onEdit,
  onDelete,
}: ReportsTableExtendedProps) {
  const hasActions = onEdit && onDelete;
  const { formatConverted } = usePreferences();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#131313] border-b border-[#222]">
          <tr>
            {headers.map((header) => (
              <th className="text-[#ADAAAA] p-4 font-inter text-xs uppercase tracking-wider" key={header.label}>
                {header.label}
              </th>
            ))}
            {hasActions && (
              <th className="text-[#ADAAAA] p-4 font-inter text-xs uppercase tracking-wider text-right pr-4">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222]">
          {isLoading ? (
            <SkeletonTheme baseColor="#1a1a1a" highlightColor="#262626">
              {Array.from({ length: skeletonRows }).map((_, idx) => (
                <tr key={idx}>
                  <td className="p-4 pt-5.5">
                    <div className="flex items-center gap-2">
                      <Skeleton circle width={18} height={18} />
                      <Skeleton width={70} height={16} />
                    </div>
                  </td>
                  <td className="pl-8 py-4">
                    <div className="flex justify-center">
                      <Skeleton width={36} height={36} borderRadius={12} />
                    </div>
                  </td>
                  <td className="p-4">
                    <Skeleton width={140} height={14} />
                    <div className="mt-1.5">
                      <Skeleton width={190} height={12} />
                    </div>
                  </td>
                  <td className="p-4">
                    <Skeleton width={90} height={14} />
                  </td>
                  {hasActions && <td className="p-4"><Skeleton width={80} height={24} borderRadius={8} /></td>}
                </tr>
              ))}
            </SkeletonTheme>
          ) : (
            reports?.map((report, idx) => {
              const isMovement = "_id" in report;
              const date = isMovement ? new Date(report.date) : report.date;
              const amount = report.quantity;
              const type = report.type;
              const currencyName = isMovement ? report.walletId.currencyId.name : "USD";
              const symbol = isMovement ? report.walletId.currencyId.symbol : "$";
              const Icon = isMovement ? getCurrencyIcon(currencyName) : null;
              const walletName = isMovement ? report.walletId.name : "N/A";

              const displayAmount = formatAmount ? formatAmount(amount, currencyName) : `${symbol}${amount.toLocaleString()}`;
              const converted = formatConverted(amount, currencyName).converted;

              return (
                <tr key={isMovement ? report._id : idx} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className={`p-4 pt-5.5 flex items-center gap-2 font-semibold font-manrope ${type === "income" ? "text-landing-primary" : "text-[#FF7351]"}`}>
                    {type === "income" ? <Add className="w-4.5 h-4.5" /> : <Minus className="w-4.5 h-4.5" />}
                    <div className="flex flex-col">
                      <span>{displayAmount}</span>
                      {converted && (
                        <span className="text-[11px] font-normal text-white/40">{converted}</span>
                      )}
                    </div>
                  </td>
                  <td className="pl-8 py-4 text-white/80 text-center">
                    <div className="flex items-center justify-center w-fit bg-[#20201F] p-2 rounded-xl" title={`${walletName} | ${symbol}`}>
                      {Icon && <Icon className="w-5 h-5 opacity-80" />}
                    </div>
                  </td>
                  <td className="p-4 text-white/60 text-sm">
                    <p className="text-white font-semibold">{report.title}</p>
                    <span className="text-white/50 font-inter text-sm flex items-center">
                      <ChevronRight className={`size-5 ${type === "income" ? "text-landing-primary/60" : "text-[#FF7351]/60"}`} />
                      {report.description || "No description"}
                    </span>
                  </td>
                  <td className="p-4 text-[#ADAAAA] text-sm">
                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  {hasActions && isMovement && (
                    <td className="p-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit?.(report)}
                          className="p-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                          title="Edit"
                          aria-label="Edit transaction"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete?.(report)}
                          className="p-2 rounded-lg bg-white/5 text-[#FF7351]/70 hover:bg-white/10 hover:text-[#FF7351] transition-colors"
                          title="Delete"
                          aria-label="Delete transaction"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {!isLoading && (!reports || reports.length === 0) && (
        <div className="p-8 text-center text-white/40 italic">
          No records found.
        </div>
      )}
    </div>
  );
}