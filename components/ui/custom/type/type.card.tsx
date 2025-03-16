'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { SignedIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface TypeCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export function TypeCard({ id, name, description, imageUrl }: TypeCardProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => {
        const params = new URLSearchParams();
        params.set('type', id);
        router.push(`/products?${params.toString()}`);
      }}
      className={cn(
        'flex w-72 cursor-pointer items-center overflow-hidden rounded-lg border border-muted-foreground bg-background shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg'
      )}
    >
      <div className='relative h-32 w-32 flex-shrink-0'>
        <Image
          src={imageUrl || '/assets/images/no-image.jpg'}
          alt={name}
          fill
          className='object-cover'
        />
        <SignedIn>
          <Button
            variant='ghost'
            className='absolute left-2 top-2 rounded-full bg-white text-gray-600 shadow hover:bg-gray-200 hover:text-gray-800'
            onClick={e => {
              e.stopPropagation();
              router.push(`/protected/types/${id}`);
            }}
          >
            <Edit size={14} />
          </Button>
        </SignedIn>
      </div>
      <CardContent className='pl-4'>
        <h3 className='text-lg font-bold text-muted-foreground'>{name}</h3>
        <p className='mt-1 text-sm text-muted-foreground'>
          {description || '-'}
        </p>
      </CardContent>
    </Card>
  );
}
