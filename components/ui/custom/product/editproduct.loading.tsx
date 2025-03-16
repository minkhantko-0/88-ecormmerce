'use client';

export default function EditProductLoading() {
  return (
    <div className='container mx-auto max-w-md p-4'>
      {/* Title Skeleton */}
      <div className='mb-4'>
        <div className='mx-auto h-8 w-1/2 animate-pulse rounded bg-gray-200'></div>
      </div>
      <div className='space-y-6'>
        {/* Product Name Field Skeleton */}
        <div className='space-y-2'>
          <div className='h-4 w-24 animate-pulse rounded bg-gray-200'></div>
          <div className='h-10 w-full animate-pulse rounded bg-gray-200'></div>
          <div className='h-3 w-1/2 animate-pulse rounded bg-gray-200'></div>
        </div>

        {/* Image Upload & Preview Skeleton */}
        <div className='space-y-2'>
          <div className='h-4 w-40 animate-pulse rounded bg-gray-200'></div>
          <div className='relative h-60 w-full animate-pulse rounded bg-gray-200'></div>
        </div>

        {/* Price Field Skeleton */}
        <div className='space-y-2'>
          <div className='h-4 w-16 animate-pulse rounded bg-gray-200'></div>
          <div className='h-10 w-full animate-pulse rounded bg-gray-200'></div>
        </div>

        {/* Description Field Skeleton */}
        <div className='space-y-2'>
          <div className='h-4 w-24 animate-pulse rounded bg-gray-200'></div>
          <div className='h-20 w-full animate-pulse rounded bg-gray-200'></div>
        </div>

        {/* Featured Toggle, Category and Type Fields Skeleton */}
        <div className='space-y-2'>
          <div className='h-4 w-20 animate-pulse rounded bg-gray-200'></div>
          <div className='flex gap-4'>
            <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
            <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
          </div>
        </div>

        {/* Form Actions Skeleton */}
        <div className='flex justify-between'>
          <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
          <div className='flex gap-4'>
            <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
            <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
