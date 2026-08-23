interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex space-x-3">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3 h-44 space-y-2 border border-slate-100">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-12 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PwaSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="bg-green-600 p-4 flex justify-between items-center">
        <Skeleton className="h-6 w-24 bg-green-500" />
        <Skeleton className="h-5 w-20 bg-green-500" />
      </div>
      <div className="p-4 max-w-lg mx-auto w-full space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </div>
    </div>
  );
}
