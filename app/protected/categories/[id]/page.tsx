'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';

import CategoryEditLoading from '@/components/ui/custom/category/editcategory.loading';
import { ConfirmDialog } from '@/components/ui/custom/confirm.dialog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUploadThing } from '@/hooks/uploadthing';
import { extractFileKey } from '@/lib/extract-url.utils';
import { deleteImage } from '@/server/actions';
import { useMutation, useQuery } from 'convex/react';
import Image from 'next/image';

// Define the form schema.
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  imageUrl: z.string().optional(),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  file: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const updateCategoryMutation = useMutation(api.categories.updateCategory);
  const deleteCategoryMutation = useMutation(api.categories.deleteCategory);

  // Fetch category data based on the URL id.
  const category = useQuery(api.categories.getCategory, {
    id: categoryId as Id<'categories'>
  });

  const { startUpload } = useUploadThing('imageUploader');

  // Initialize the form unconditionally using default values.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: category?.name || '',
      imageUrl: category?.imageUrl || '',
      description: category?.description || '',
      file: null
    },
    resetOptions: {
      keepDirty: true
    }
  });

  // Now that hooks have been called, if there's no category, render the loading skeleton.
  if (!category) {
    return <CategoryEditLoading />;
  }

  // Save the original image URL for later comparison.
  const originalImageUrl = category.imageUrl || '';

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting }
  } = form;

  // Use hook form's watch to retrieve the current image URL.
  const currentImageUrl = watch('imageUrl');

  // Remove image from form state.
  const handleRemoveImage = () => {
    setValue('imageUrl', '');
    setValue('file', null);
  };

  // Delete category action.
  const handleDeleteCategory = async () => {
    try {
      await deleteCategoryMutation({
        id: categoryId as Id<'categories'>
      });

      if (originalImageUrl) {
        const fileKey = extractFileKey(originalImageUrl);
        try {
          await deleteImage(fileKey);
        } catch (delError) {
          console.error('Failed to delete image:', delError);
        }
      }
      toast.success('Category deleted successfully!', { richColors: true });
      router.replace('/categories');
      router.refresh();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('An error occurred while deleting the category.', {
        richColors: true
      });
    }
  };

  // On form submit: optionally upload a new image, update the category, and delete the old image if needed.
  const onSubmit = async (data: FormValues) => {
    try {
      let uploadedImageUrl = currentImageUrl;
      if (data.file instanceof File) {
        const uploadResponse = await startUpload([data.file]);
        if (uploadResponse && uploadResponse[0]?.url) {
          uploadedImageUrl = uploadResponse[0].url;
          setValue('imageUrl', uploadedImageUrl);
        }
      }

      await updateCategoryMutation({
        id: categoryId as Id<'categories'>,
        name: data.name,
        imageUrl: uploadedImageUrl || '',
        description: data.description
      });

      toast.success('Category updated successfully!', { richColors: true });
      if (originalImageUrl && originalImageUrl !== uploadedImageUrl) {
        const fileKey = extractFileKey(originalImageUrl);
        try {
          await deleteImage(fileKey);
        } catch (delError) {
          console.error('Failed to delete old image:', delError);
        }
      }
      router.push('/categories');
      router.refresh();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('An error occurred while updating the category.', {
        richColors: true
      });
    }
  };

  return (
    <div className='mx-auto max-w-md p-4'>
      <h1 className='mb-4 text-center text-2xl font-bold'>Edit Category</h1>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Name Field */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Category name' {...field} />
                </FormControl>
                <FormDescription>The name of the category.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Preview / Dropzone */}
          <div>
            <FormLabel>Category Image</FormLabel>
            {currentImageUrl ? (
              <div className='relative h-48 w-48'>
                <Image
                  src={currentImageUrl}
                  fill
                  alt='Category Image Preview'
                  className='mt-1 rounded-md object-cover shadow-lg'
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
            ) : (
              <FormField
                control={form.control}
                name='file'
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <Dropzone onFileSelect={onChange} file={value} />
                    <FormDescription>
                      Drag and drop an image here, or click to select one.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Description Field */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Category description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of the category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className='flex items-center justify-between'>
            <ConfirmDialog
              title='Delete Category'
              description='Are you sure you want to delete this category? This action cannot be undone.'
              confirmText='Delete'
              cancelText='Cancel'
              onConfirm={handleDeleteCategory}
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
