'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format-currency';
import { cn } from '@/lib/utils';
import { SignedIn } from '@clerk/nextjs';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PlaceOrderDialog } from './placeorder.dialog';

interface ProductProps {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  isFeatured: boolean;
  category: string; // id or name, depending on your usage
  type: string; // id or name, depending on your usage
}

export function ProductCard({
  id,
  name,
  imageUrl,
  price,
  description,
  isFeatured
}: ProductProps) {
  const router = useRouter();
  return (
    <PlaceOrderDialog productId={id} productName={name} productPrice={price}>
      <Card
        className={cn(
          'w-72 overflow-hidden rounded-xl bg-background shadow-md transition-transform duration-300 hover:scale-105'
        )}
      >
        <div className='relative h-60 w-full'>
          <Image src={imageUrl} alt={name} fill className='object-cover' />
          {isFeatured && (
            <div className='absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white'>
              FEATURED
            </div>
          )}
          <SignedIn>
            <Button
              variant='ghost'
              className='absolute right-2 top-2 rounded-full bg-white text-gray-600 shadow hover:bg-gray-200 hover:text-gray-800'
              onClick={e => {
                e.stopPropagation();
                router.push(`/protected/products/${id}`);
              }}
            >
              <Edit size={16} />
            </Button>
          </SignedIn>
        </div>
        <CardHeader className='p-4'>
          <CardTitle className='text-lg font-bold text-primary'>
            {name}
          </CardTitle>
          <div className='mt-2 text-xl font-semibold text-foreground/50'>
            {formatCurrency(price)}
          </div>
        </CardHeader>
        <CardContent className='px-4 pb-4'>
          <p className='line-clamp-2 text-sm text-muted-foreground'>
            {description}
          </p>
        </CardContent>
      </Card>
    </PlaceOrderDialog>
  );
}
