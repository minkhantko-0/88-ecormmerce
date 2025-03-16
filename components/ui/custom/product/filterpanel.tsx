'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface FilterPanelProps {
  initialSearch: string;
  initialCategory: string;
  initialType: string;
  onFilter?: () => void;
}

export default function FilterPanel({
  initialSearch,
  initialCategory,
  initialType,
  onFilter
}: FilterPanelProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory || 'all');
  const [type, setType] = useState(initialType || 'all');

  // Fetch categories and types for select options.
  const categories = useQuery(api.categories.getCategories) || [];
  const types = useQuery(api.types.getTypes) || [];

  // When filter is applied, update the URL query parameters.
  const applyFilter = () => {
    const params = new URLSearchParams();
    if (searchText) params.set('search', searchText);
    if (category !== 'all') params.set('category', category);
    if (type !== 'all') params.set('type', type);
    router.push(`/products?${params.toString()}`);
  };

  // Clear filters and reset URL.
  const clearFilter = () => {
    setSearchText('');
    setCategory('all');
    setType('all');
    router.push('/products');
  };

  return (
    <div className='rounded-lg border p-4 shadow-md'>
      <div className='mb-4'>
        <Label className='mb-1 block'>Search</Label>
        <Input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder='Search products...'
        />
      </div>
      <div className='mb-4'>
        <Label className='mb-1 block'>Category</Label>
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='mb-4'>
        <Label className='mb-1 block'>Type</Label>
        <Select onValueChange={setType} value={type}>
          <SelectTrigger>
            <SelectValue placeholder='Select type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            {types.map(ty => (
              <SelectItem key={ty._id} value={ty._id}>
                {ty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex justify-between'>
        <Button variant='outline' onClick={clearFilter}>
          Clear
        </Button>
        <Button
          onClick={() => {
            applyFilter();
            if (onFilter) {
              onFilter();
            }
          }}
        >
          Filter
        </Button>
      </div>
    </div>
  );
}
