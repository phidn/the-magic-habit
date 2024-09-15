export interface ImageUploadAreaProps {
  isDragActive: boolean
  children: React.ReactNode
  labelClassName?: string
  id: string
  disabled?: boolean
}

export interface UploadingIndicatorProps {
  progress: number
}

export interface UploadedImageDisplayProps {
  uploadedImagePath: string
  fileName?: string | null
  removeSelectedImage: () => void
}

export interface ImageUploadProps {
  onUpload: (
    file: File,
    onProgress: (progress: number) => void,
    onComplete: (imageUrl: string) => void
  ) => Promise<string>
  className?: string
  fileName?: string | null
  onRemove?: () => void
  maxImageWidth?: number
  maxImageHeight?: number
  maxSize?: number
  id: string
  imageUrl: string | null
}
