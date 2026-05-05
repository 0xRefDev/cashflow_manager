import { ReportsTableProps } from "@/types/report.types";

import { Add } from "@/icons/app/Add";
import { Minus } from "@/icons/app/Minus";
import { getCurrencyIcon } from "@/utils/Currencies";

import { ChevronRight } from "@/icons/ChevronRight";

export function ReportsTable({ reports, headers }: ReportsTableProps) {
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
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222]">
          {reports?.map((report, idx) => {
            const isMovement = "_id" in report;
            const date = isMovement ? new Date(report.date) : report.date;
            const amount = report.quantity;
            const type = report.type;
            const symbol = isMovement ? report.walletId.currencyId.symbol : "$";
            const Icon = isMovement ? getCurrencyIcon(report.walletId.currencyId.name) : null;
            const walletName = isMovement ? report.walletId.name : "N/A";

            return (
              <tr key={isMovement ? report._id : idx} className="hover:bg-[#1a1a1a] transition-colors">
                <td className={`p-4 pt-5.5 flex items-center gap-2 font-semibold font-manrope ${type === "income" ? "text-landing-primary" : "text-[#FF7351]"}`}>
                  {type === "income" ?
                    <Add className="w-4.5 h-4.5" /> :
                    <Minus className="w-4.5 h-4.5" />
                  }
                  {symbol}{amount.toLocaleString()}
                </td>
                <td className="pl-8 py-4 text-white/80 text-center">
                  <div className="flex items-center justify-center w-fit bg-[#20201F] p-2 rounded-xl" title={`${walletName} | ${symbol}`}>
                    {Icon && <Icon className="w-5 h-5 opacity-80" />}
                  </div>
                </td>
                <td className="p-4 text-white/60 text-sm">
                  <p className="text-white font-semibold">{report.title}</p>
                  <span className="text-white/50 font-inter text-sm flex items-center">
                    <ChevronRight className={`size-5 ${type === "income" ? "text-landing-primary/60" : "text-[#FF7351]/60"}`} />{report.description || "No description"}
                  </span>
                </td>
                <td className="p-4 text-[#ADAAAA] text-sm">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {(!reports || reports.length === 0) && (
        <div className="p-8 text-center text-white/40 italic">
          No records found.
        </div>
      )}
    </div>
  );
}