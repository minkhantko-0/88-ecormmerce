'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { TypeCard } from '@/components/ui/custom/type/type.card'; // Adjust the path as needed
import Loading from '@/components/ui/custom/type/loading';

export default function Page() {
  const types = useQuery(api.types.getTypes);

  if (!types) {
    return <Loading />;
  }

  return (
    <section className='py-12'>
      <div className='container mx-auto'>
        <h1 className='mb-8 font-serif text-3xl font-bold'>Types</h1>
        {types.length === 0 ? (
          <p className='mt-12 text-center'>No types found.</p>
        ) : (
          <div className='flex flex-wrap gap-6'>
            {types.map(type => (
              <TypeCard
                id={type._id} // Pass the id prop
                key={type._id} // Ensure each type has a unique id field
                name={type.name}
                description={type.description}
                imageUrl={type.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
