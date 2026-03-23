"use client";

interface EmptyStateProps {
  icon: string;
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#2A2A2A] border border-[#333] flex items-center justify-center mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{message}</p>
    </div>
  );
}
