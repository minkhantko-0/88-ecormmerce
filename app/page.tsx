'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <section className='py-24'>
      <div className='container text-center md:px-24 lg:px-48'>
        <h1 className='font-serif text-5xl font-bold'>
          Experience Luxury & Exclusivity
        </h1>
        <p className='mt-5 text-xl text-muted-foreground'>
          Buy authentic products from luxury brands on sale. Discover our
          curated collection of premium items and indulge in exclusive deals
          that let you elevate your lifestyle with sophistication and style.
        </p>
        <div className='mt-8'>
          <Button onClick={() => router.push('/products')}>Browse</Button>
        </div>
      </div>
    </section>
  );
}
