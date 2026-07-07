const variants: Record<string, React.CSSProperties> = {
  published: { background: '#dcfce7', color: '#166534' },
  draft: { background: '#f3f4f6', color: '#374151' },
  verified: { background: '#dcfce7', color: '#166534' },
  pending: { background: '#fef9c3', color: '#854d0e' },
  rejected: { background: '#fecaca', color: '#991b1b' },
  active: { background: '#dbeafe', color: '#1e40af' },
  inactive: { background: '#f3f4f6', color: '#374151' },
  ADMIN: { background: '#fde68a', color: '#92400e' },
  TEACHER: { background: '#bbf7d0', color: '#166534' },
  STUDENT: { background: '#bfdbfe', color: '#1e40af' },
  OPERATOR: { background: '#e9d5ff', color: '#6b21a8' },
  SUPERADMIN: { background: '#fecaca', color: '#991b1b' },
  ALUMNI: { background: '#f3f4f6', color: '#374151' },
  HADIR: { background: '#dcfce7', color: '#166534' },
  IZIN: { background: '#fef9c3', color: '#854d0e' },
  SAKIT: { background: '#e0e7ff', color: '#3730a3' },
  ALPA: { background: '#fecaca', color: '#991b1b' },
};

export function Badge({ label }: { label: string }) {
  const style = variants[label] || variants.draft;
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium" style={style}>
      {label}
    </span>
  );
}
