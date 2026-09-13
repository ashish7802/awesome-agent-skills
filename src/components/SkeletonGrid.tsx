import React from 'react';

interface SkeletonGridProps {
  count?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-5 sm:p-6 space-y-4"
        >
          <div className="flex justify-between">
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-14 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
            <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
