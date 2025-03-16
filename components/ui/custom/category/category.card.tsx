'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { SignedIn } from '@clerk/nextjs';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export function CategoryCard({
  id,
  name,
  description,
  imageUrl
}: CategoryCardProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => {
        const params = new URLSearchParams();
        params.set('category', id);
        router.push(`/products?${params.toString()}`);
      }}
      className={cn(
        'relative w-72 transform cursor-pointer overflow-hidden rounded-xl bg-background shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-2xl'
      )}
    >
      <div className='relative h-48 w-full'>
        <Image
          src={imageUrl || '/assets/images/no-image.jpg'}
          alt={name}
          fill
          className='object-cover'
        />
        <SignedIn>
          <Button
            variant='ghost'
            className='absolute right-2 top-2 rounded-full bg-white text-gray-600 shadow hover:bg-gray-200 hover:text-gray-800'
            onClick={e => {
              e.stopPropagation();
              router.push(`/protected/categories/${id}`);
            }}
          >
            <Edit size={16} />
          </Button>
        </SignedIn>
      </div>
      <CardHeader className='bg-background p-4'>
        <CardTitle className='text-xl font-semibold text-muted-foreground'>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4'>
        <p className='text-sm text-muted-foreground'>{description || '-'}</p>
      </CardContent>
    </Card>
  );
}
