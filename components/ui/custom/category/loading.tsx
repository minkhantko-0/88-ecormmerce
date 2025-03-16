'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Loading() {
  // Create an array with 5 skeleton items
  const skeletons = Array.from({ length: 5 });

  return (
    <section className='py-12'>
      <div className='container mx-auto'>
        <h1 className='mb-8 font-serif text-3xl font-bold'>Categories</h1>
        <div className='flex flex-wrap gap-6'>
          {skeletons.map((_, index) => (
            <div key={index} className='w-72'>
              <Card
                className={cn('overflow-hidden rounded-xl bg-white shadow-lg')}
              >
                {/* Image skeleton */}
                <div className='relative h-48 w-full animate-pulse bg-gray-200' />
                {/* Header skeleton */}
                <CardHeader className='bg-gray-100 p-4'>
                  <CardTitle className='h-6 w-1/2 animate-pulse bg-gray-200' />
                </CardHeader>
                {/* Content skeleton */}
                <CardContent className='p-4'>
                  <p className='h-4 w-full animate-pulse bg-gray-200' />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
