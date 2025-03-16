'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Utility function for merging class names (optional)

export default function Loading() {
  // Create an array of 5 skeletons
  const skeletons = Array.from({ length: 5 });

  return (
    <section className='py-12'>
      <div className='container mx-auto'>
        <h1 className='mb-8 font-serif text-3xl font-bold'>Types</h1>
        <div className='flex flex-wrap gap-6'>
          {skeletons.map((_, idx) => (
            <div key={idx} className='w-72'>
              <Card
                className={cn(
                  'flex items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50'
                )}
              >
                <div className='relative h-24 w-24 animate-pulse bg-gray-200' />
                <CardContent className='pl-4'>
                  <div className='mb-2 h-6 w-32 animate-pulse bg-gray-200' />
                  <div className='h-4 w-40 animate-pulse bg-gray-200' />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
