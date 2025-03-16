'use client';

import { cn } from '@/lib/utils';

export function ProductCardSkeleton() {
  return (
    <div
      className={cn(
        'w-72 animate-pulse overflow-hidden rounded-xl bg-background shadow-md'
      )}
    >
      <div className='relative h-60 w-full bg-gray-200'></div>
      <div className='p-4'>
        <div className='mb-2 h-4 w-3/4 rounded bg-gray-200'></div>
        <div className='mb-2 h-6 w-1/2 rounded bg-gray-200'></div>
        <div className='h-4 w-full rounded bg-gray-200'></div>
      </div>
    </div>
  );
}
