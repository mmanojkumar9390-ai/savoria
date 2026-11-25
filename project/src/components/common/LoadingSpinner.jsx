import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 40, text = 'Loading...', fullPage = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 size={size} className="animate-spin text-orange-500" />
      <p className="text-sm text-gray-500 font-medium">{text}</p>
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    )
  }
  return spinner
}
