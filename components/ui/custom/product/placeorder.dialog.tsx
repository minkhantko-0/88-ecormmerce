'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { sendOrderEmail } from '@/server/actions';

interface OrderFormValues {
  name: string;
  phone: string;
  note: string;
}

export function PlaceOrderDialog({
  productId,
  productName,
  productPrice,
  children
}: {
  productId: string;
  productName: string;
  productPrice: number;
  children: React.ReactNode;
}) {
  const orderMutation = useMutation(api.orders.addOrder);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<OrderFormValues>({
    defaultValues: { name: '', phone: '', note: '' }
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      await orderMutation({
        productId: productId as Id<'products'>,
        name: data.name,
        phoneNo: data.phone,
        note: data.note
      });
      toast.success('Order placed successfully!');
      reset();
      sendOrderEmail(data.name, data.phone, productName, productPrice);
      setOpen(false);
    } catch (error) {
      toast.error('Failed to place order!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-full sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-medium'>Name</label>
            <Input
              placeholder='Your name'
              {...register('name', { required: true })}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>
              Phone Number
            </label>
            <Input
              placeholder='Your phone number'
              {...register('phone', { required: true })}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>Note</label>
            <Textarea
              placeholder='Any additional note?'
              {...register('note')}
              className='resize-none'
            />
          </div>
          <DialogFooter className='flex justify-end gap-4'>
            <DialogClose asChild>
              <Button variant='outline' type='button'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Placing...' : 'Place Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
