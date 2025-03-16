'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ProductCard } from '@/components/ui/custom/product/product.card';
import FilterPanel from '@/components/ui/custom/product/filterpanel';
import FilterDialog from '@/components/ui/custom/product/filterdialog';
import { Id } from '@/convex/_generated/dataModel';
import ProductListLoading from '@/components/ui/custom/product/loading';

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter values from URL query parameters.
  const searchText = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';

  // Fetch products based on the filters.
  const products = useQuery(api.products.getProducts, {
    search: searchText,
    category: category ? (category as Id<'categories'>) : undefined,
    type: type ? (type as Id<'types'>) : undefined
  });

  return (
    <section className='py-12'>
      <div className='container mx-auto'>
        <h1 className='mb-8 font-serif text-3xl font-bold'>Products</h1>
        <div className='flex flex-col gap-6 lg:flex-row'>
          {/* Desktop Filter Sidebar */}
          <div className='hidden lg:block lg:w-1/4'>
            <FilterPanel
              initialSearch={searchText}
              initialCategory={category}
              initialType={type}
            />
          </div>

          {/* Mobile Filter Dialog Trigger */}
          <div className='mb-4 block lg:hidden'>
            <FilterDialog
              initialSearch={searchText}
              initialCategory={category}
              initialType={type}
            />
          </div>

          {/* Product List */}
          <div className='w-full lg:w-3/4'>
            {products === undefined ? (
              <ProductListLoading />
            ) : products.length === 0 ? (
              <p className='mt-12 text-center'>No products found.</p>
            ) : (
              <div className='flex flex-wrap justify-center gap-6 lg:justify-start'>
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    {...product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
