import { cn } from '@/lib/utils'

interface LogoImageProps {
  className?: string
  alt?: string
  src?: string
}

export const LogoImage = ({ className, alt = 'Logo', src = '/logo.png' }: LogoImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('h-8 w-auto object-contain', className)}
    />
  )
}