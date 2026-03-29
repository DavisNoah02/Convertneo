import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoImageProps {
  className?: string
  alt?: string
  src?: string
}

export const LogoImage = ({ className, alt = 'Logo', src = '/logo.png' }: LogoImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={128}
      height={32}
      className={cn('h-8 w-auto object-contain', className)}
    />
  )
}