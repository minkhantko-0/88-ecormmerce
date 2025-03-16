'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { CategoryCard } from '@/components/ui/custom/category/category.card'; // Adjust the path as needed
import Loading from '@/components/ui/custom/category/loading';

export default function Page() {
  const categories = useQuery(api.categories.getCategories);

  if (!categories) {
    return <Loading />;
  }

  return (
    <section className='py-12'>
      <div className='container mx-auto'>
        <h1 className='mb-8 font-serif text-3xl font-bold'>Categories</h1>
        {categories.length === 0 ? (
          <p className='mt-12 text-center'>No categories found.</p>
        ) : (
          <div className='flex flex-wrap gap-6'>
            {categories.map(category => (
              <CategoryCard
                key={category._id} // Ensure each category has a unique id field
                id={category._id}
                name={category.name}
                description={category.description}
                imageUrl={category.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
