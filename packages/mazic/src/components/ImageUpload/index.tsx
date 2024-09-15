import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarImage, Input, RadialProgress } from '@mazic-design-system'

import { cn } from '@mazic/utils/cn'

import {
  ImageUploadAreaProps,
  ImageUploadProps,
  UploadedImageDisplayProps,
  UploadingIndicatorProps,
} from './types'

const ImageUploadArea = ({
  isDragActive,
  children,
  labelClassName,
  id,
  disabled,
}: ImageUploadAreaProps) => (
  <label
    htmlFor={id}
    className={cn(
      'w-36 h-36 p-1 relative flex flex-col items-center justify-center border-2 border-dashed rounded-full cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors duration-300',
      disabled && 'cursor-not-allowed',
      labelClassName,
      isDragActive
        ? 'border-zinc-600 dark:border-zinc-500 transition-colors duration-300'
        : 'border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
    )}
  >
    {children}
  </label>
)

const UploadingIndicator = ({ progress }: UploadingIndicatorProps) => (
  <div className="text-center max-w-md">
    <RadialProgress progress={progress} />
    <p className="text-sm font-semibold">Uploading...</p>
  </div>
)

const UploadPrompt = () => (
  <div className="text-center">
    <div className="rounded-md max-w-min mx-auto">
      <Plus />
    </div>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      <span className="font-semibold">Upload</span>
    </p>
  </div>
)

const UploadedImageDisplay = ({
  uploadedImagePath,
  removeSelectedImage,
}: UploadedImageDisplayProps) => (
  <div className="text-center">
    <div className="relative group">
      <div className="w-full h-full relative mx-auto">
        <Avatar className="h-full w-full opacity-100 group-hover:opacity-50 ">
          <AvatarImage src={uploadedImagePath} />
        </Avatar>
        <div className="absolute rounded-lg h-full w-full top-0 left-0">
          <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100">
            <Trash2
              className="text-black dark:text-white hover:text-red-500 dark:hover:text-red-500 cursor-pointer"
              size="1.5em"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                removeSelectedImage()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const ImageUpload = ({
  onUpload,
  className,
  fileName,
  onRemove,
  maxSize = 10 * 1024 * 1024,
  id,
  imageUrl,
}: ImageUploadProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(imageUrl)

  useEffect(() => {
    if (imageUrl && typeof imageUrl === 'string') {
      setUploadedImagePath(imageUrl)
    }
  }, [imageUrl])

  const handleUpload = async (
    file: File,
    event?: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = async () => {
      setLoading(true)
      await onUpload(file, setProgress, (imageUrl: string) => {
        setUploadedImagePath(imageUrl)
        setLoading(false)
      })
      URL.revokeObjectURL(image.src)
    }
    image.onerror = () => {
      toast.error('There was an error processing your image. It can be wrong format or too large.')
      setLoading(false)
      URL.revokeObjectURL(image.src)
    }
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      handleUpload(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, inputRef } = useDropzone({
    onDrop,
    maxSize,
    noClick: true,
    noKeyboard: true,
  })

  const removeSelectedImage = () => {
    onRemove?.()
    acceptedFiles.length = 0
    acceptedFiles.splice(0, acceptedFiles.length)
    if (inputRef.current) {
      inputRef.current.value = ''
    }

    setLoading(false)
    setUploadedImagePath(null)
    setProgress(0)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0]
      handleUpload(file, event)
    }
  }

  return (
    <div {...getRootProps()} className={cn('flex items-center justify-center', className)}>
      <ImageUploadArea disabled={loading} id={id} isDragActive={isDragActive}>
        {loading && <UploadingIndicator progress={progress} />}
        {!loading && !uploadedImagePath && <UploadPrompt />}
        {uploadedImagePath && !loading && (
          <UploadedImageDisplay
            uploadedImagePath={uploadedImagePath}
            fileName={fileName}
            removeSelectedImage={removeSelectedImage}
          />
        )}
      </ImageUploadArea>
      <Input
        {...getInputProps({
          onChange: handleImageChange,
        })}
        id={id}
        accept="image/*"
        type="file"
        className="hidden"
        disabled={loading}
      />
    </div>
  )
}
