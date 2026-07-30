import React, { useState } from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { Search, Eye, Filter, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Enterprise Recent Batch Table Component
 * Displays batch inspection records with status chips, quality scores, defect indicators, and quick review triggers
 */
export function RecentBatchTable({ batches = [], className = '' }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.line.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Toolbar / Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F0F9FF] p-3 rounded-[12px] border border-[#E0F2FE]">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter batches or lines..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E0F2FE] rounded-[8px] text-[13px] text-[#075985] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748B]">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#E0F2FE] text-[#075985] text-[12px] font-medium rounded-[8px] px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Enterprise Table Container */}
      <div className="overflow-x-auto rounded-[12px] border border-[#E0F2FE] bg-white">
        <table className="w-full text-left text-[13px] border-collapse">
          <thead className="bg-[#F0F9FF] text-[#075985] font-semibold border-b border-[#E0F2FE] sticky top-0">
            <tr>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1 cursor-pointer select-none hover:text-[#0EA5E9]">
                  Batch Reference <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Line & Shift</th>
              <th className="py-3 px-4 text-center">Packages</th>
              <th className="py-3 px-4 text-center">Quality Score</th>
              <th className="py-3 px-4">Defect Summary</th>
              <th className="py-3 px-4 text-center">Review Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0F2FE]">
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => (
                <tr
                  key={batch.id}
                  className="hover:bg-[#F0F9FF]/60 transition-colors group cursor-pointer"
                  onClick={() => navigate('/inspection-summary')}
                >
                  <td className="py-3.5 px-4 font-semibold text-[#075985]">
                    <div>{batch.id}</div>
                    <div className="text-[11px] font-normal text-[#64748B]">{batch.name}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#075985]">
                    <div className="font-medium">{batch.line}</div>
                    <div className="text-[11px] text-[#64748B]">{batch.shift}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-[#075985]">
                    <span className="text-[#22C55E]">{batch.passed}</span> / <span className="text-[#64748B]">{batch.totalImages}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block font-bold px-2.5 py-0.5 rounded-md text-[13px] ${
                        batch.qualityScore >= 95
                          ? 'bg-[#F0FDF4] text-[#22C55E]'
                          : batch.qualityScore >= 90
                          ? 'bg-[#FFFBEB] text-[#F59E0B]'
                          : 'bg-[#FEF2F2] text-[#EF4444]'
                      }`}
                    >
                      {batch.qualityScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B] max-w-xs truncate">
                    {batch.defectSummary}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => navigate('/inspection-summary')}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#64748B]">
                  No matching batch inspection records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
