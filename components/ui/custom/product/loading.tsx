'use client';

import { ProductCardSkeleton } from './productcard.loading'; // Adjust the path as needed

export default function ProductListLoading() {
  return (
    <div className='flex flex-wrap justify-center gap-6 lg:justify-start'>
      {Array.from({ length: 5 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
