'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { api } from '@/convex/_generated/api';
import { useUploadThing } from '@/hooks/uploadthing';
import { useMutation } from 'convex/react';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters.' }),
  // imageUrl will be filled after file upload.
  imageUrl: z.string().optional(),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  // File used for image upload.
  file: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCategoryPage() {
  const router = useRouter();
  // Replace with your actual mutation for adding a category.
  const addCategoryMutation = useMutation(api.categories.createCategory);
  const { startUpload } = useUploadThing('imageUploader');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      description: '',
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

      const result = await addCategoryMutation({
        name: data.name,
        imageUrl: uploadedImageUrl || '',
        description: data.description
      });

      if (result) {
        toast.success('Category added successfully!', { richColors: true });
        reset();
        router.push('/categories');
      } else {
        toast.error('Failed to add category', { richColors: true });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('An error occurred while adding the category.', {
        richColors: true
      });
    }
  };

  return (
    <div className='container mx-auto max-w-lg p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Add New Category</h1>
      <p className='mb-6'>Fill in the details below to add a new category.</p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Category Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder='Category name' {...field} />
                </FormControl>
                <FormDescription>The name of the category.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Image Upload */}
          <FormField
            control={form.control}
            name='file'
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Upload Category Image</FormLabel>
                <Dropzone onFileSelect={onChange} file={value} />
                <FormDescription>
                  Upload an image representing the category.
                </FormDescription>
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
          <div className='flex justify-end space-x-4'>
            <Button
              type='reset'
              variant='outline'
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
