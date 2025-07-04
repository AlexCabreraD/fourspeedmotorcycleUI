import { Camera } from 'lucide-react'

interface ImagePlaceholderProps {
  message?: string
  className?: string
  showIcon?: boolean
}

export default function ImagePlaceholder({ 
  message = "Image coming soon", 
  className = "",
  showIcon = true 
}: ImagePlaceholderProps) {
  return (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-steel-50 to-steel-100 text-steel-500 ${className}`}>
      {showIcon && (
        <Camera className="h-8 w-8 mb-2 text-steel-400" />
      )}
      <span className="text-sm font-medium text-center px-2">
        {message}
      </span>
    </div>
  )
}