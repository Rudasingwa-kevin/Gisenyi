export function exportToCSV(items, columns, filename = 'export.csv') {
  if (!items.length) return;
  const headers = columns.map(c => c.label);
  const rows = items.map(item =>
    columns.map(c => {
      const val = typeof c.accessor === 'function' ? c.accessor(item) : item[c.accessor];
      const str = String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    })
  );
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
