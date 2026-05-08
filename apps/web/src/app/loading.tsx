export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-xs text-[#71717A]">Loading...</p>
      </div>
    </div>
  );
}
