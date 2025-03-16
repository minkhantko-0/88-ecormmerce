'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dropzone } from '@/components/ui/dropzone';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import { useUploadThing } from '@/hooks/uploadthing';
import { useMutation, useQuery } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Product name must be at least 2 characters.' }),
  // imageUrl will be filled after file upload.
  imageUrl: z.string().optional(),
  // Coerce input to a number since Input returns a string.
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number.' })
    .min(0, { message: 'Price must be non-negative.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  isFeatured: z.boolean().optional().default(false),
  category: z.string().min(1, { message: 'Category is required.' }),
  type: z.string().min(1, { message: 'Type is required.' }),
  // File used for the image upload.
  file: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const addProductMutation = useMutation(api.products.addProduct);
  const { startUpload } = useUploadThing('imageUploader');

  // Query categories and types from the database.
  const categories = useQuery(api.categories.getCategories) || [];
  const types = useQuery(api.types.getTypes) || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      price: 0,
      description: '',
      isFeatured: false,
      category: '',
      type: '',
      file: null
    }
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = form;

  const onSubmit = async (data: FormValues) => {
    try {
      let uploadedImageUrl = '';

      if (data.file instanceof File) {
        const uploadResponse = await startUpload([data.file]);
        if (uploadResponse && uploadResponse[0]?.ufsUrl) {
          uploadedImageUrl = uploadResponse[0].ufsUrl;
        }
      }

      const result = await addProductMutation({
        name: data.name,
        imageUrl: uploadedImageUrl || '',
        price: data.price,
        description: data.description,
        isFeatured: data.isFeatured,
        category: data.category as Id<'categories'>,
        type: data.type as Id<'types'>
      });

      if (result) {
        toast.success('Product added successfully!', { richColors: true });
        reset();
        router.push('/products');
      } else {
        toast.error('Failed to add product', { richColors: true });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred while adding the product.', {
        richColors: true
      });
    }
  };

  return (
    <div className='container mx-auto max-w-lg p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Add New Product</h1>
      <p className='mb-6'>
        Fill in the details below to add a new product to the store.
      </p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Product Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder='Product name' {...field} />
                </FormControl>
                <FormDescription>The name of the product.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Image Upload */}
          <FormField
            control={form.control}
            name='file'
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Upload Product Image</FormLabel>
                <Dropzone onFileSelect={onChange} file={value} />
                <FormDescription>
                  Upload an image for the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Product price'
                    {...field}
                  />
                </FormControl>
                <FormDescription>The price of the product.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Product description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Featured Toggle */}
          <FormField
            control={form.control}
            name='isFeatured'
            render={({ field }) => (
              <FormItem className='flex flex-row items-end space-x-2'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='font-normal'>Featured</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Select */}
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select the category for the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type Select */}
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(ty => (
                        <SelectItem key={ty._id} value={ty._id}>
                          {ty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select the type for the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className='flex justify-end space-x-4'>
            <Button
              type='reset'
              variant='outline'
              onClick={() => {
                reset();
                router.replace('/products');
              }}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
