interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  color?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  color = "#22c55e",
}: StatCardProps) {
  return (
    <div className="bg-[#2A2A2A] border border-[#333] rounded-xl overflow-hidden shadow">
      <div className="flex">
        {/* Color stripe */}
        <div
          className="w-1.5 flex-shrink-0"
          style={{ backgroundColor: color }}
        />

        <div className="p-5 flex-1">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-3xl font-heading font-semibold text-gray-100">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
