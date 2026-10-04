import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, MoreHorizontal, Download, Trash2, CheckSquare } from 'lucide-react';
import { Pagination } from './Pagination';
import { EmptyState } from './EmptyState';
import clsx from 'clsx';

export const DataTable = ({
  columns,
  data = [],
  searchKey,
  searchPlaceholder = 'Search records...',
  bulkActions,
  onRowClick,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no items matching your criteria.',
  className,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filter logic
  let processedData = [...data];
  if (searchQuery && searchKey) {
    const q = searchQuery.toLowerCase();
    processedData = processedData.filter((row) => {
      const val = row[searchKey];
      return val ? String(val).toLowerCase().includes(q) : false;
    });
  }

  // 2. Sort logic
  if (sortColumn) {
    processedData.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 3. Pagination logic
  const totalItems = processedData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = processedData.slice(startIndex, startIndex + pageSize);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleHeaderSort = (key) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const allSelected = paginatedData.length > 0 && paginatedData.every((d) => selectedIds.includes(d.id));

  return (
    <div className={clsx('rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden', className)}>
      {/* Top Bar / Bulk Actions Header */}
      {selectedIds.length > 0 ? (
        <div className="flex items-center justify-between border-b border-indigo-100 bg-indigo-50/80 px-4 py-3 text-xs text-indigo-900 transition-all">
          <div className="flex items-center gap-2 font-semibold">
            <CheckSquare className="h-4 w-4 text-indigo-600" />
            <span>{selectedIds.length} item(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Exporting ${selectedIds.length} items...`)}
              className="flex items-center gap-1 rounded border border-indigo-200 bg-white px-2.5 py-1 font-medium text-indigo-700 hover:bg-indigo-50"
            >
              <Download className="h-3.5 w-3.5" /> Export Selected
            </button>
            <button
              onClick={() => {
                alert(`Deleted ${selectedIds.length} items.`);
                setSelectedIds([]);
              }}
              className="flex items-center gap-1 rounded bg-rose-600 px-2.5 py-1 font-medium text-white hover:bg-rose-700"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Selected
            </button>
          </div>
        </div>
      ) : null}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/90 backdrop-blur text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="w-10 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleHeaderSort(col.key)}
                  className={clsx(
                    'px-4 py-3 font-semibold text-slate-700',
                    col.sortable !== false && 'cursor-pointer select-none hover:text-slate-900',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                >
                  <div className={clsx('flex items-center gap-1', col.align === 'right' && 'justify-end', col.align === 'center' && 'justify-center')}>
                    {col.header}
                    {col.sortable !== false && (
                      <span className="text-slate-400">
                        {sortColumn === col.key ? (
                          sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 text-indigo-600" /> : <ChevronDown className="h-3 w-3 text-indigo-600" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id || idx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={clsx(
                      'transition-colors hover:bg-slate-50/80',
                      onRowClick && 'cursor-pointer',
                      isSelected && 'bg-indigo-50/30'
                    )}
                  >
                    <td className="w-10 px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(row.id, e)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={clsx(
                          'px-4 py-3 text-slate-700',
                          col.align === 'right' && 'text-right',
                          col.align === 'center' && 'text-center'
                        )}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="py-12">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <Pagination
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
};
