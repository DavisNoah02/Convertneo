"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'

interface LogoImageProps {
  className?: string
  alt?: string
  src?: string
  /** Show the full logo including wordmark (default: true) */
  showWordmark?: boolean
  /** Size variant: 'sm' = 32px height, 'lg' = 64px height */
  size?: 'sm' | 'lg'
}

// SVG viewBox is "0 0 140 32" → aspect ratio ≈ 4.375 : 1
const LOGO_ASPECT_RATIO = 140 / 32
// Icon-only viewBox is "0 0 18 18" → 1 : 1
const ICON_ASPECT_RATIO = 1

export const LogoImage = ({
  className,
  alt = 'Convertneo',
  src = '/logo.svg',
  showWordmark = true,
  size = 'sm',
}: LogoImageProps) => {
  const [imgError, setImgError] = useState(false)
  const height = size === 'lg' ? 64 : 32
  const aspectRatio = showWordmark ? LOGO_ASPECT_RATIO : ICON_ASPECT_RATIO
  const width = Math.round(height * aspectRatio)

  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 transition-opacity duration-200 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-sm',
        className
      )}
      aria-label="Convertneo – go to homepage"
    >
      {imgError ? (
        <Logo
          className={cn('w-auto', size === 'lg' ? 'h-16' : 'h-8')}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          className="object-contain"
          style={{ height, width: 'auto' }}
          onError={() => setImgError(true)}
        />
      )}
    </Link>
  )
}