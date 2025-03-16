'use client';

export default function TypeEditLoading() {
  return (
    <div className='mx-auto max-w-md p-4'>
      {/* Title Skeleton */}
      <div className='mb-4 h-8 w-1/2 animate-pulse bg-gray-200'></div>

      <div className='space-y-6'>
        {/* Name Field Skeleton */}
        <div className='space-y-2'>
          <div className='h-4 w-20 animate-pulse bg-gray-200'></div>
          <div className='h-10 w-full animate-pulse rounded bg-gray-200'></div>
          <div className='h-3 w-32 animate-pulse bg-gray-200'></div>
        </div>

        {/* Image Preview / Dropzone Skeleton */}
        <div className='space-y-2'>
          <div className='h-4 w-40 animate-pulse bg-gray-200'></div>
          <div className='relative h-48 w-48 animate-pulse rounded bg-gray-200'></div>
        </div>

        {/* Description Field Skeleton */}
        <div className='space-y-2'>
          <div className='h-4 w-24 animate-pulse bg-gray-200'></div>
          <div className='h-20 w-full animate-pulse rounded bg-gray-200'></div>
          <div className='h-3 w-40 animate-pulse bg-gray-200'></div>
        </div>

        {/* Form Actions Skeleton */}
        <div className='flex items-center justify-between'>
          <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
          <div className='flex gap-x-4'>
            <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
            <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
