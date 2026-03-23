export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {/* Green circle logo with inner rings and subtle pulse */}
      <div className="relative w-10 h-10 flex-shrink-0 group">
        <div className="absolute inset-0 rounded-full bg-green-500 opacity-15 transition-opacity duration-500 group-hover:opacity-25" />
        <div className="absolute inset-1.5 rounded-full bg-green-500 opacity-30 transition-opacity duration-500 group-hover:opacity-45" />
        <div className="absolute inset-3 rounded-full bg-green-500 shadow-sm shadow-green-500/30 transition-shadow duration-500 group-hover:shadow-green-500/50" />
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
