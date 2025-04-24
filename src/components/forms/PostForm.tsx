import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FileUploader from '../shared/FileUploader'
import { PostValidation } from '@/lib/validation'
import { Models } from 'appwrite'
import {
  useCreatePost,
  useUpdatePost,
} from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

type PostFormProps = {
  post?: Models.Document
  action: 'Create' | 'Update'
}

const PostForm = ({ post, action }: PostFormProps) => {
  const imageUrl = post?.imageId
    ? `https://fra.cloud.appwrite.io/v1/storage/buckets/6804287b0010312e9f15/files/${post.imageId}/view?project=67fb0953002bfc85058c&mode=admin`
    : ''

  const { mutateAsync: createPost } = useCreatePost()

  const { mutateAsync: updatePost } = useUpdatePost()

  const { user } = useUserContext()
  const { toast } = useToast()
  const navigate = useNavigate()

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : '',
      file: [],
      location: post ? post?.location : '',
      tags: post ? post?.tags.join(',') : '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && action === 'Update') {
      const updatedPost = updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      })

      if (!updatedPost) {
        toast({ title: 'Please try again!' })
      }

      return navigate(`/posts/${post.$id}`)
    }

    const newPost = await createPost({ ...values, userId: user.id })

    if (!newPost) {
      toast({
        title: 'Something went wrong',
      })
    }

    navigate('/')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add photos</FormLabel>
              <FormControl>
                <FileUploader fileChange={field.onChange} mediaUrl={imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input rounded" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add tags (separated by comma ", ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input rounded"
                  {...field}
                  placeholder="Art, Expression"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4 rounded">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap rounded"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
export default PostForm
