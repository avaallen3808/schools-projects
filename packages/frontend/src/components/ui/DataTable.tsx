'use client';

import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({ columns, data, emptyMessage = 'Tidak ada data', isLoading }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #f6f4ee' }}>
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f6f4ee' }}>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 text-left font-medium ${col.className || ''}`} style={{ color: '#4c4c4c' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center" style={{ color: '#999' }}>
                Memuat...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center" style={{ color: '#999' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={i} style={{ borderTop: '1px solid #f6f4ee' }} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
