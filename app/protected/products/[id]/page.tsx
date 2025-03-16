'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ui/custom/confirm.dialog';
import EditProductLoading from '@/components/ui/custom/product/editproduct.loading';
import { Dropzone } from '@/components/ui/dropzone';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUploadThing } from '@/hooks/uploadthing';
import { extractFileKey } from '@/lib/extract-url.utils';
import { deleteImage } from '@/server/actions';
import { useMutation, useQuery } from 'convex/react';
import Image from 'next/image';

// Define the form schema.
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Product name must be at least 2 characters.' }),
  imageUrl: z.string().optional(),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number.' })
    .min(0, { message: 'Price must be non-negative.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  isFeatured: z.boolean().optional().default(false),
  category: z.string().min(1, { message: 'Category is required.' }),
  type: z.string().min(1, { message: 'Type is required.' }),
  file: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  // Mutations for updating and deleting the product.
  const updateProductMutation = useMutation(api.products.updateProduct);
  const deleteProductMutation = useMutation(api.products.deleteProduct);

  // Fetch product details.
  const product = useQuery(api.products.getProduct, {
    id: productId as Id<'products'>
  });

  // Fetch select options.
  const categories = useQuery(api.categories.getCategories);
  const types = useQuery(api.types.getTypes);

  const { startUpload } = useUploadThing('imageUploader');

  // Always call useForm with initial empty defaults.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: product?.name || '',
      imageUrl: product?.imageUrl || '',
      price: product?.price || 0,
      description: product?.description || '',
      isFeatured: product?.isFeatured || false,
      category: product?.category || '',
      type: product?.type || '',
      file: null
    },
    resetOptions: {
      keepDirtyValues: true
    }
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting }
  } = form;

  // If product data is not available, show loading.
  if (!product) {
    return <EditProductLoading />;
  }
  // Save original image URL for later comparison.
  const originalImageUrl = product?.imageUrl || '';

  // Get the current image URL from the form.
  const currentImageUrl = watch('imageUrl');

  // Remove the current image.
  const handleRemoveImage = () => {
    setValue('imageUrl', '');
    setValue('file', null);
  };

  // Delete product action.
  const handleDeleteProduct = async () => {
    try {
      await deleteProductMutation({
        id: productId as Id<'products'>
      });

      if (originalImageUrl) {
        const fileKey = extractFileKey(originalImageUrl);
        try {
          await deleteImage(fileKey);
        } catch (delError) {
          console.error('Failed to delete image:', delError);
        }
      }
      toast.success('Product deleted successfully!', { richColors: true });
      router.replace('/products');
      router.refresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An error occurred while deleting the product.', {
        richColors: true
      });
    }
  };

  // On form submit: optionally upload a new image, update the product, and delete the old image if needed.
  const onSubmit = async (data: FormValues) => {
    try {
      let uploadedImageUrl = currentImageUrl;
      if (data.file instanceof File) {
        const uploadResponse = await startUpload([data.file]);
        if (uploadResponse && uploadResponse[0]?.ufsUrl) {
          uploadedImageUrl = uploadResponse[0].ufsUrl;
          setValue('imageUrl', uploadedImageUrl);
        }
      }

      await updateProductMutation({
        id: productId as Id<'products'>,
        name: data.name,
        imageUrl: uploadedImageUrl || '',
        price: data.price,
        description: data.description,
        isFeatured: data.isFeatured,
        category: data.category as Id<'categories'>,
        type: data.type as Id<'types'>
      });

      toast.success('Product updated successfully!', { richColors: true });
      if (originalImageUrl && originalImageUrl !== uploadedImageUrl) {
        const fileKey = extractFileKey(originalImageUrl);
        try {
          await deleteImage(fileKey);
        } catch (delError) {
          console.error('Failed to delete old image:', delError);
        }
      }
      router.push('/products');
      router.refresh();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred while updating the product.', {
        richColors: true
      });
    }
  };

  return (
    <div className='container mx-auto max-w-md p-4'>
      <h1 className='mb-4 text-center text-2xl font-bold'>Edit Product</h1>
      <FormProvider {...form}>
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

          {currentImageUrl ? (
            <div>
              <FormLabel>Product Image Preview</FormLabel>
              <div className='relative mb-4 h-60 w-full'>
                <Image
                  src={currentImageUrl}
                  alt='Product Image Preview'
                  fill
                  className='rounded-md object-cover shadow-lg'
                />
                <Button
                  variant='ghost'
                  type='button'
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  className='absolute right-2 top-2 cursor-pointer rounded-full bg-white p-1 shadow hover:bg-red-100'
                  title='Remove Image'
                >
                  <Trash2 size={16} className='text-red-500' />
                </Button>
              </div>
            </div>
          ) : (
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
          )}

          {/* Price Field */}
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='1'
                    placeholder='Product price'
                    {...field}
                  />
                </FormControl>
                <FormDescription>The price of the product.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
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
            render={({ field }) => {
              console.log(field.value);
              return (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories && categories.length === 0 && (
                          <SelectItem disabled value='none'>
                            No Category to Select
                          </SelectItem>
                        )}
                        {categories &&
                          categories.length > 0 &&
                          categories.map(cat => (
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
              );
            }}
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
                      {types && types.length === 0 && (
                        <SelectItem value='none' disabled>
                          No Type to Select
                        </SelectItem>
                      )}
                      {types &&
                        types.length > 0 &&
                        types.map(ty => (
                          <SelectItem key={ty._id} value={ty._id.toString()}>
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
          <div className='flex items-center justify-between'>
            <ConfirmDialog
              title='Delete Product'
              description='Are you sure you want to delete this product? This action cannot be undone.'
              confirmText='Delete'
              cancelText='Cancel'
              onConfirm={handleDeleteProduct}
              trigger={
                <Button
                  type='button'
                  variant='destructive'
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              }
            />
            <div className='flex gap-x-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
