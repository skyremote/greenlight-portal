export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {/* Green circle logo with inner rings */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <div className="absolute inset-0 rounded-full bg-green-500 opacity-20" />
        <div className="absolute inset-1.5 rounded-full bg-green-500 opacity-40" />
        <div className="absolute inset-3 rounded-full bg-green-500" />
      </div>

      {!compact && (
        <div className="flex flex-col">
          <span className="font-heading text-xl font-semibold text-gray-100 leading-tight">
            Greenlight
          </span>
          <span className="text-[11px] text-green-400/70 tracking-wider uppercase leading-tight">
            Coaching Portal
          </span>
        </div>
      )}
    </div>
  );
}
