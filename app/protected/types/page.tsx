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
    .min(2, { message: 'Type name must be at least 2 characters.' }),
  // imageUrl will be filled after file upload.
  imageUrl: z.string().optional(),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  // File used for image upload.
  file: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function AddTypePage() {
  const router = useRouter();
  // Replace with your actual mutation for adding a type.
  const addTypeMutation = useMutation(api.types.createType);
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
        console.log(uploadResponse);
        if (uploadResponse && uploadResponse[0]?.ufsUrl) {
          uploadedImageUrl = uploadResponse[0].ufsUrl;
        }
      }

      const result = await addTypeMutation({
        name: data.name,
        imageUrl: uploadedImageUrl || '',
        description: data.description
      });

      if (result) {
        toast.success('Type added successfully!', { richColors: true });
        reset();
        router.push('/types');
      } else {
        toast.error('Failed to add type', { richColors: true });
      }
    } catch (error) {
      console.error('Error adding type:', error);
      toast.error('An error occurred while adding the type.', {
        richColors: true
      });
    }
  };

  return (
    <div className='container mx-auto max-w-lg p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Add New Type</h1>
      <p className='mb-6'>Fill in the details below to add a new type.</p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Type Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type Name</FormLabel>
                <FormControl>
                  <Input placeholder='Type name' {...field} />
                </FormControl>
                <FormDescription>The name of the type.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type Image Upload */}
          <FormField
            control={form.control}
            name='file'
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Upload Type Image</FormLabel>
                <Dropzone onFileSelect={onChange} file={value} />
                <FormDescription>Upload an image for the type.</FormDescription>
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
                    placeholder='Type description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of the type.
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
              {isSubmitting ? 'Adding...' : 'Add Type'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
