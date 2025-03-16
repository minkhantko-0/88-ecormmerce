'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FilterPanel from './filterpanel'; // Adjust the path as needed

interface FilterDialogProps {
  initialSearch: string;
  initialCategory: string;
  initialType: string;
}

export default function FilterDialog({
  initialSearch,
  initialCategory,
  initialType
}: FilterDialogProps) {
  const [open, setOpen] = useState(false);

  // This function will be called from FilterPanel once filtering is applied.
  const handleFilter = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Filter Products</DialogTitle>
        </DialogHeader>
        <FilterPanel
          initialSearch={initialSearch}
          initialCategory={initialCategory}
          initialType={initialType}
          onFilter={handleFilter} // Pass the callback to close the dialog
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
