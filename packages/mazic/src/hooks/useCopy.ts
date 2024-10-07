import { toast } from 'sonner'

export const useCopy = () => {
  const copy = async (text: string, message?: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(message || 'Copied to clipboard')
  }

  return copy
}
